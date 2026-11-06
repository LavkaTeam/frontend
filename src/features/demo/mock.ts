// A fake demo backend for local UI work (VITE_DEMO_MOCK=true, dev server
// only: config.ts ties it to import.meta.env.DEV, so production builds drop
// this file). It answers /demo/*, /user/me, /cart/me and /auth/refresh by
// wrapping fetch; every other request still goes to the real API.
//
// Handy in the console:
//   __demoMock.delay(15000)     slow first response ("Waking up the demo...")
//   __demoMock.fail('DEMO_CAPACITY_REACHED')   next create/reset fails
//   __demoMock.expire()         the sandbox dies: next call is 401
//   __demoMock.expiresIn(240000) sandbox ends in 4 minutes
//   __demoMock.calls            every request the mock has answered
import { apiUrl } from '@/shared/api/client';

import type { DemoRole, DemoSessionResponse } from './types';

interface MockState {
  role: DemoRole;
  tenantId: string;
  createdAt: number;
  expiresAt: number;
  token: string | null;
  expired: boolean;
}

const TTL_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'b2bar:demo-mock';
let counter = 0;
let delayMs = Number(import.meta.env.VITE_DEMO_MOCK_DELAY) || 0;
let nextFailure: string | null = null;
let state: MockState | null = null;
const calls: string[] = [];

// The fake sandbox survives a reload, like a real one on the server.
const persist = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ counter, state }));
  } catch {
    // The mock then forgets the sandbox on reload.
  }
};

const restore = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      counter = saved.counter;
      state = saved.state;
    }
  } catch {
    // Nothing to restore.
  }
};

const json = (body: unknown, status = 200) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const apiError = (status: number, code: string, details?: object) =>
  json({ error: code, code, details }, status);

const pairedRole = (role: DemoRole): DemoRole =>
  role === 'BUYER' ? 'SELLER' : 'BUYER';

const buildUser = (current: MockState) => ({
  id: `${current.tenantId}-${current.role.toLowerCase()}`,
  email: `${current.role.toLowerCase()}@demo.invalid`,
  role: current.role,
  firstName: 'Demo',
  lastName: current.role === 'BUYER' ? 'Buyer' : 'Seller',
  companyName:
    current.role === 'BUYER' ? 'Demo Bistro 7F3A' : 'Demo Supplies 2C91',
  verificationStatus: 'VERIFIED',
  products: [],
  demo: true,
  demoExpiresAt: new Date(current.expiresAt).toISOString(),
});

const startSession = (role: DemoRole, fresh: boolean): DemoSessionResponse => {
  counter += 1;
  const now = Date.now();
  state = {
    role,
    tenantId: fresh || !state ? `mock-${counter}` : state.tenantId,
    createdAt: fresh || !state ? now : state.createdAt,
    expiresAt: fresh || !state ? now + TTL_MS : state.expiresAt,
    token: `mock-token-${counter}`,
    expired: false,
  };
  persist();

  return {
    token: state.token as string,
    refreshToken: `mock-refresh-${counter}`,
    user: buildUser(state) as DemoSessionResponse['user'],
    demo: {
      tenantId: state.tenantId,
      role,
      pairedRole: pairedRole(role),
      createdAt: new Date(state.createdAt).toISOString(),
      expiresAt: new Date(state.expiresAt).toISOString(),
    },
  };
};

const isAuthorized = (request: Request) => {
  const header = request.headers.get('Authorization') || '';

  return Boolean(state && !state.expired && header === `Bearer ${state.token}`);
};

const unauthorized = () =>
  state?.expired
    ? apiError(401, 'DEMO_SESSION_EXPIRED')
    : apiError(401, 'INVALID_TOKEN');

const readRole = async (request: Request): Promise<DemoRole | null> => {
  try {
    const body = (await request.clone().json()) as { role?: string };

    return body.role === 'BUYER' || body.role === 'SELLER' ? body.role : null;
  } catch {
    return null;
  }
};

const handle = async (request: Request, path: string): Promise<Response> => {
  const method = request.method;

  if (path === '/demo/info') {
    return json({
      enabled: true,
      tenantTtlHours: 24,
      limits: {
        maxProducts: 60,
        maxOrdersCreated: 50,
        maxUploads: 20,
        maxUploadBytes: 2_097_152,
      },
      adminEnabled: false,
      seedVersion: 1,
    });
  }

  if (path === '/demo/session' && method === 'POST') {
    if (nextFailure) {
      const code = nextFailure;
      nextFailure = null;

      return code === 'TOO_MANY_REQUESTS'
        ? apiError(429, code, { retryAfterSeconds: 12 })
        : apiError(503, code, { retryAfterSeconds: 30 });
    }

    const role = await readRole(request);

    return role
      ? json(startSession(role, true), 201)
      : apiError(400, 'BAD_REQUEST');
  }

  if (path === '/auth/refresh') {
    return state?.expired
      ? apiError(401, 'DEMO_SESSION_EXPIRED')
      : apiError(401, 'INVALID_TOKEN');
  }

  if (!isAuthorized(request) || !state) return unauthorized();

  if (path === '/demo/me') {
    return json({
      tenantId: state.tenantId,
      role: state.role,
      createdAt: new Date(state.createdAt).toISOString(),
      expiresAt: new Date(state.expiresAt).toISOString(),
      pairedUser: {
        id: `${state.tenantId}-${pairedRole(state.role).toLowerCase()}`,
        role: pairedRole(state.role),
        companyName:
          state.role === 'BUYER' ? 'Demo Supplies 2C91' : 'Demo Bistro 7F3A',
      },
      usage: { productsCreated: 30, ordersCreated: 0, uploadsCount: 0 },
    });
  }

  if (path === '/demo/switch-role' && method === 'POST') {
    return json(startSession(pairedRole(state.role), false));
  }

  if (path === '/demo/reset' && method === 'POST') {
    const role = (await readRole(request)) ?? state.role;

    return json(startSession(role, true), 201);
  }

  if (path === '/demo/session' && method === 'DELETE') {
    state = null;
    persist();

    return new Response(null, { status: 204 });
  }

  if (path === '/user/me') return json(buildUser(state));
  if (path === '/cart/me') {
    return json({
      cartId: 'mock-cart',
      items: [],
      summary: { totalItems: 0, subtotal: 0, grandTotal: 0 },
    });
  }

  // Anything else of a signed-in mock user: a soft "not found", so pages show
  // their error state instead of the real API throwing the mock token out.
  return apiError(404, 'NOT_FOUND');
};

const MOCKED = /^\/(demo\/|user\/me$|cart\/me$|auth\/refresh$)/;

export const installDemoMock = () => {
  restore();
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const request = new Request(input, init);

    if (!request.url.startsWith(apiUrl)) return realFetch(request);

    const path = new URL(request.url).pathname.replace(
      new URL(apiUrl, window.location.origin).pathname,
      '',
    );
    const hasMockToken = (request.headers.get('Authorization') || '').includes(
      'mock-token',
    );
    if (!MOCKED.test(path) && !hasMockToken) return realFetch(request);

    calls.push(`${request.method} ${path}`);

    if (delayMs > 0 && path === '/demo/session') {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
    }

    return handle(request, path);
  };

  (window as unknown as Record<string, unknown>).__demoMock = {
    calls,
    delay: (ms: number) => {
      delayMs = ms;
    },
    fail: (code: string) => {
      nextFailure = code;
    },
    expire: () => {
      if (state) state.expired = true;
      persist();
    },
    expiresIn: (ms: number) => {
      if (state) state.expiresAt = Date.now() + ms;
      persist();
    },
  };
};
