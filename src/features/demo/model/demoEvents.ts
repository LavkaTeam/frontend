// Fired when the sandbox of the visitor is gone: the API said so (401
// DEMO_SESSION_EXPIRED) or its expiry time has passed.
export const DEMO_EXPIRED_EVENT = 'demo:expired';

export const dispatchDemoExpired = () => {
  window.dispatchEvent(new Event(DEMO_EXPIRED_EVENT));
};
