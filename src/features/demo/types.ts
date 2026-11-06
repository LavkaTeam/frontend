// Contract of /api/demo/** (backend: docs/9-demo-mode.md). Every type, code and
// text that depends on the backend lives here or in model/demoCopy.ts, so a
// change of the contract touches this feature only.
import type { AuthResponse } from '@/types/auth';

export type DemoRole = 'BUYER' | 'SELLER';

export interface DemoInfo {
  enabled: boolean;
  tenantTtlHours: number;
  limits: {
    maxProducts: number;
    maxOrdersCreated: number;
    maxUploads: number;
    maxUploadBytes: number;
  };
  adminEnabled: boolean;
  seedVersion: number;
}

export interface DemoSessionResponse {
  token: string;
  refreshToken: string;
  user: AuthResponse['user'] & { demo: true; demoExpiresAt: string };
  demo: {
    tenantId: string;
    role: DemoRole;
    pairedRole: DemoRole;
    createdAt: string;
    expiresAt: string;
  };
}

export interface DemoMe {
  tenantId: string;
  role: DemoRole;
  createdAt: string;
  expiresAt: string;
  pairedUser: { id: string; role: DemoRole; companyName: string };
  usage: {
    productsCreated: number;
    ordersCreated: number;
    uploadsCount: number;
  };
}

// What `details.limit` of DEMO_LIMIT_REACHED can be.
export type DemoLimitName =
  'products' | 'orders' | 'uploads' | 'upload size in bytes' | 'cart items';

// Mirrors the DEMO_* members of ApiErrorCode.
export type DemoErrorCode =
  | 'DEMO_SESSION_EXPIRED'
  | 'DEMO_READ_ONLY'
  | 'DEMO_LIMIT_REACHED'
  | 'DEMO_CAPACITY_REACHED';
