import { z } from 'zod';

// Shape of the answers of /api/demo/** (docs/9-demo-mode.md). Used by the
// contract test, so a backend change shows up as a failing fixture.
const demoRoleSchema = z.enum(['BUYER', 'SELLER']);

export const demoSessionSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  user: z
    .object({
      id: z.string(),
      role: z.string(),
      email: z.string(),
      demo: z.literal(true),
      demoExpiresAt: z.string(),
    })
    .passthrough(),
  demo: z.object({
    tenantId: z.string(),
    role: demoRoleSchema,
    pairedRole: demoRoleSchema,
    createdAt: z.string(),
    expiresAt: z.string(),
  }),
});

export const demoInfoSchema = z.object({
  enabled: z.boolean(),
  tenantTtlHours: z.number().positive(),
  limits: z.object({
    maxProducts: z.number(),
    maxOrdersCreated: z.number(),
    maxUploads: z.number(),
    maxUploadBytes: z.number(),
  }),
  adminEnabled: z.boolean(),
  seedVersion: z.number(),
});

export const demoMeSchema = z.object({
  tenantId: z.string(),
  role: demoRoleSchema,
  createdAt: z.string(),
  expiresAt: z.string(),
  pairedUser: z.object({
    id: z.string(),
    role: demoRoleSchema,
    companyName: z.string(),
  }),
  usage: z.object({
    productsCreated: z.number(),
    ordersCreated: z.number(),
    uploadsCount: z.number(),
  }),
});
