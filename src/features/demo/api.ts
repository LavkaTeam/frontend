import { apiRequest } from '@/shared/api/client';

import type { DemoInfo, DemoMe, DemoRole, DemoSessionResponse } from './types';

// Public calls are sent without the saved token: it may belong to a sandbox
// that is already gone, and the backend answers such a token with 401.
export const getDemoInfo = () =>
  apiRequest<DemoInfo>('/demo/info', { skipAuth: true });

export const createDemoSession = (role: DemoRole) =>
  apiRequest<DemoSessionResponse>('/demo/session', {
    method: 'POST',
    body: JSON.stringify({ role }),
    skipAuth: true,
  });

// Only for a demo user; anyone else gets 403.
export const getDemoMe = () => apiRequest<DemoMe>('/demo/me');

export const switchDemoRole = () =>
  apiRequest<DemoSessionResponse>('/demo/switch-role', { method: 'POST' });

// Shares the per-IP limit with createDemoSession: never retried by itself.
export const resetDemo = (role: DemoRole) =>
  apiRequest<DemoSessionResponse>('/demo/reset', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });

export const endDemo = () =>
  apiRequest<void>('/demo/session', { method: 'DELETE' });
