// Demo mode is a build-time switch for the separate demo deployment
// (demo.b2bar.tech). Without VITE_DEMO_MODE the constant is `false`, the
// bundler drops every `isDemoMode && ...` branch and the demo code never
// reaches the production bundle.
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const prodSiteUrl =
  import.meta.env.VITE_PROD_URL || 'https://b2bar.tech';

// Only for local UI work: replaces the demo endpoints with a fake backend.
export const isDemoMock =
  import.meta.env.DEV && import.meta.env.VITE_DEMO_MOCK === 'true';
