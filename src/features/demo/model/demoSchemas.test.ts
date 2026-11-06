import { describe, expect, it } from 'vitest';

import { demoInfoSchema, demoMeSchema, demoSessionSchema } from './demoSchemas';

// Examples are copied from docs/9-demo-mode.md of the backend: if the backend
// changes a field, the fixture is the first thing to break.
const session = {
  token: 'access',
  refreshToken: 'refresh',
  user: {
    id: 'u1',
    role: 'SELLER',
    email: 'seller@demo.invalid',
    companyName: 'Demo Supplies 2C91',
    demo: true,
    demoExpiresAt: '2026-11-06T12:00:00Z',
  },
  demo: {
    tenantId: 't1',
    role: 'SELLER',
    pairedRole: 'BUYER',
    createdAt: '2026-11-05T12:00:00Z',
    expiresAt: '2026-11-06T12:00:00Z',
  },
};

describe('demo API contract', () => {
  it('accepts the session response', () => {
    expect(demoSessionSchema.safeParse(session).success).toBe(true);
  });

  it('rejects a session of a non-demo user', () => {
    const notDemo = { ...session, user: { ...session.user, demo: false } };

    expect(demoSessionSchema.safeParse(notDemo).success).toBe(false);
  });

  it('accepts /demo/info and /demo/me', () => {
    expect(
      demoInfoSchema.safeParse({
        enabled: true,
        tenantTtlHours: 24,
        limits: {
          maxProducts: 60,
          maxOrdersCreated: 50,
          maxUploads: 20,
          maxUploadBytes: 2097152,
        },
        adminEnabled: false,
        seedVersion: 1,
      }).success,
    ).toBe(true);

    expect(
      demoMeSchema.safeParse({
        tenantId: 't1',
        role: 'SELLER',
        createdAt: '2026-11-05T12:00:00Z',
        expiresAt: '2026-11-06T12:00:00Z',
        pairedUser: {
          id: 'u2',
          role: 'BUYER',
          companyName: 'Demo Bistro 7F3A',
        },
        usage: { productsCreated: 30, ordersCreated: 0, uploadsCount: 0 },
      }).success,
    ).toBe(true);
  });
});
