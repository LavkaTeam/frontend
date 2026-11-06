import { beforeEach, describe, expect, it, vi } from 'vitest';

const saveAuthTokens = vi.fn();
const syncLocalUserData = vi.fn();

vi.mock('@/shared/api/client', () => ({ saveAuthTokens }));
vi.mock('@/hooks/syncLocalUserData', () => ({ syncLocalUserData }));
vi.mock('@/store/cartSlice', () => ({
  clearCart: () => ({ type: 'cart/clear' }),
}));
vi.mock('@/store/favoritesSlice', () => ({
  clearFavorites: () => ({ type: 'favorites/clear' }),
}));
vi.mock('@/store/viewingHistorySlice', () => ({
  clearHistory: () => ({ type: 'history/clear' }),
}));

const response = {
  token: 'access',
  refreshToken: 'refresh',
  user: { id: 'u1', role: 'BUYER', demo: true, demoExpiresAt: 'later' },
  demo: {
    tenantId: 't1',
    role: 'BUYER',
    pairedRole: 'SELLER',
    createdAt: 'now',
    expiresAt: 'later',
  },
} as never;

const setup = () => {
  const order: string[] = [];
  saveAuthTokens.mockImplementation(() => order.push('saveAuthTokens'));
  const queryClient = {
    clear: vi.fn(() => order.push('clear')),
    invalidateQueries: vi.fn(async () => {
      order.push('invalidate');
    }),
  };
  const dispatch = vi.fn();
  const clearLocalStorage = vi.fn();
  vi.stubGlobal('localStorage', { clear: clearLocalStorage });

  return { order, queryClient, dispatch, clearLocalStorage };
};

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('finishDemoSession', () => {
  it('saves the tokens before anything is refetched, then reloads the user', async () => {
    const { finishDemoSession } = await import('./finishDemoSession');
    const { order, queryClient, dispatch } = setup();

    await finishDemoSession(response, {
      queryClient: queryClient as never,
      dispatch: dispatch as never,
      mode: 'switch',
    });

    expect(saveAuthTokens).toHaveBeenCalledWith(response);
    expect(order).toEqual(['saveAuthTokens', 'clear', 'invalidate']);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['user'],
    });
  });

  it('never clears localStorage as a whole', async () => {
    const { finishDemoSession } = await import('./finishDemoSession');
    const { queryClient, dispatch, clearLocalStorage } = setup();

    for (const mode of ['create', 'switch', 'reset'] as const) {
      await finishDemoSession(response, {
        queryClient: queryClient as never,
        dispatch: dispatch as never,
        mode,
      });
    }

    expect(clearLocalStorage).not.toHaveBeenCalled();
  });

  it('starts switch and reset from an empty cart, wishlist and history', async () => {
    const { finishDemoSession } = await import('./finishDemoSession');

    for (const mode of ['switch', 'reset'] as const) {
      const { queryClient, dispatch } = setup();

      await finishDemoSession(response, {
        queryClient: queryClient as never,
        dispatch: dispatch as never,
        mode,
      });

      expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
        'cart/clear',
        'favorites/clear',
        'history/clear',
      ]);
      expect(syncLocalUserData).not.toHaveBeenCalled();
    }
  });

  it('keeps the guest cart for the first session and merges it', async () => {
    const { finishDemoSession } = await import('./finishDemoSession');
    const { queryClient, dispatch } = setup();

    await finishDemoSession(response, {
      queryClient: queryClient as never,
      dispatch: dispatch as never,
      mode: 'create',
    });

    expect(dispatch).not.toHaveBeenCalled();
    expect(syncLocalUserData).toHaveBeenCalledTimes(1);
  });
});
