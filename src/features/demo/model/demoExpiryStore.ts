// Whether the "Your demo has ended" dialog is open. A tiny external store, so
// the dialog and the hook that listens for the event share one source.
const listeners = new Set<() => void>();
let expired = false;

export const subscribeToDemoExpiry = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getDemoExpired = () => expired;

export const setDemoExpired = (value: boolean) => {
  if (expired === value) return;

  expired = value;
  listeners.forEach((listener) => listener());
};
