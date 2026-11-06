import { useDemoStatus } from './useDemoStatus';

// True for a signed-in demo visitor. The spec asks for one hook that the few
// places which differ for demo users share, instead of `isDemoMode` checks
// scattered over components.
export const useIsDemoUser = () => useDemoStatus().isDemoUser;
