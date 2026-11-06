/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // 'true' on the demo deployment only.
  readonly VITE_DEMO_MODE?: string;
  // Link back to the real site, shown by the demo.
  readonly VITE_PROD_URL?: string;
  // Production only, optional: shows a "Try the demo" link.
  readonly VITE_DEMO_URL?: string;
  // Dev only: 'true' serves the demo endpoints from a fake backend.
  readonly VITE_DEMO_MOCK?: string;
  // Dev only: delay of the fake backend in milliseconds.
  readonly VITE_DEMO_MOCK_DELAY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
