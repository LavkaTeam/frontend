import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// client.ts keeps module state (the interceptor, a shared refresh request) and
// reads window, localStorage and fetch, so each test loads fresh copies of the
// modules over stubbed globals. Vitest runs in node: there is no DOM.
const storage = () => {
  const data = new Map<string, string>();

  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: vi.fn(() => data.clear()),
  };
};

const reply = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

interface Calls {
  urls: string[];
  headers: Headers[];
}

const setup = async (
  respond: (url: string, calls: Calls) => Response,
  { demo = true }: { demo?: boolean } = {},
) => {
  const events: string[] = [];
  const calls: Calls = { urls: [], headers: [] };

  vi.stubGlobal('window', {
    dispatchEvent: (event: Event) => {
      events.push(event.type);
      return true;
    },
    setTimeout,
  });
  vi.stubGlobal('localStorage', storage());
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.urls.push(url);
      calls.headers.push(new Headers(init?.headers));

      return respond(url, calls);
    }),
  );
  vi.resetModules();

  const client = await import('@/shared/api/client');
  const interceptor = await import('./demoAuthInterceptor');
  const transition = await import('./demoTransition');
  if (demo) interceptor.installDemoAuthInterceptor();

  client.saveAuthTokens({ token: 'old-token', refreshToken: 'old-refresh' });
  events.length = 0;

  return { client, transition, events, calls };
};

const isRefresh = (url: string) => url.endsWith('/auth/refresh');
const expired = { error: 'Your demo has ended', code: 'DEMO_SESSION_EXPIRED' };

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('demo 401 handling', () => {
  it('announces an expired sandbox without trying to refresh', async () => {
    const { client, events, calls } = await setup(() => reply(401, expired));

    await expect(client.apiRequest('/orders/me')).rejects.toMatchObject({
      code: 'DEMO_SESSION_EXPIRED',
    });

    expect(events).toContain('demo:expired');
    expect(events).not.toContain('auth:logout');
    expect(calls.urls.some(isRefresh)).toBe(false);
  });

  it('also announces it when /auth/refresh says so', async () => {
    const { client, events, calls } = await setup((url) =>
      isRefresh(url)
        ? reply(401, expired)
        : reply(401, { error: 'Invalid token', code: 'INVALID_TOKEN' }),
    );

    await expect(client.apiRequest('/orders/me')).rejects.toBeDefined();

    expect(calls.urls.some(isRefresh)).toBe(true);
    expect(events).toContain('demo:expired');
    expect(events).not.toContain('auth:logout');
  });

  it('ignores 401 while switching, resetting or leaving', async () => {
    const { client, transition, events, calls } = await setup(() =>
      reply(401, expired),
    );

    await transition.runDemoTransition(async () => {
      await expect(client.apiRequest('/orders/me')).rejects.toBeDefined();
    });

    expect(events).not.toContain('demo:expired');
    expect(events).not.toContain('auth:logout');
    expect(calls.urls.some(isRefresh)).toBe(false);
  });

  it('ignores a late 401 of a request sent with a replaced token', async () => {
    const { client, events } = await setup(() => reply(401, expired));

    // The new session is saved while the request with 'old-token' is in flight.
    vi.mocked(fetch).mockImplementationOnce(async () => {
      client.saveAuthTokens({
        token: 'new-token',
        refreshToken: 'new-refresh',
      });

      return reply(401, expired);
    });
    events.length = 0;

    await expect(client.apiRequest('/orders/me')).rejects.toBeDefined();

    expect(events).not.toContain('demo:expired');
    expect(client.getAccessToken()).toBe('new-token');
  });

  it('leaves other 401s to the normal flow and ends the session', async () => {
    const { client, events } = await setup(() =>
      reply(401, { error: 'Invalid token', code: 'INVALID_TOKEN' }),
    );

    await expect(client.apiRequest('/orders/me')).rejects.toBeDefined();

    expect(events).toContain('auth:logout');
    expect(events).not.toContain('demo:expired');
  });
});

describe('without the demo interceptor (production)', () => {
  it('keeps the old behaviour: refresh, then end the session', async () => {
    const { client, events, calls } = await setup(
      (url) => reply(401, isRefresh(url) ? { code: 'INVALID_TOKEN' } : expired),
      { demo: false },
    );

    await expect(client.apiRequest('/orders/me')).rejects.toBeDefined();

    expect(calls.urls.some(isRefresh)).toBe(true);
    expect(events).toContain('auth:logout');
    expect(events).not.toContain('demo:expired');
  });
});

describe('skipAuth', () => {
  it('sends no Authorization header, whatever token is saved', async () => {
    const { client, calls } = await setup(() => reply(200, { ok: true }));

    await client.apiRequest('/demo/info', { skipAuth: true });
    await client.apiRequest('/orders/me');

    expect(calls.headers[0].has('Authorization')).toBe(false);
    expect(calls.headers[1].get('Authorization')).toBe('Bearer old-token');
  });

  it('does not try to refresh a request that was sent without a token', async () => {
    const { client, calls } = await setup(() =>
      reply(401, { error: 'x', code: 'UNAUTHORIZED' }),
    );

    await expect(
      client.apiRequest('/demo/info', { skipAuth: true }),
    ).rejects.toBeDefined();

    expect(calls.urls.some(isRefresh)).toBe(false);
  });
});
