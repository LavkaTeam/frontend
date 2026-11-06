// Expiry time of the current sandbox, kept in sessionStorage so the banner can
// show the timer on the first render, before GET /user/me answers. The server
// stays the source of truth; every access is guarded (private mode, quotas).
const KEY = 'b2bar:demo:expires-at';
const WARNED_KEY = 'b2bar:demo:warned-for';

export const saveDemoExpiry = (expiresAt: string) => {
  try {
    sessionStorage.setItem(KEY, expiresAt);
  } catch {
    // Not critical: the banner waits for the user request instead.
  }
};

export const readDemoExpiry = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const clearDemoExpiry = () => {
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(WARNED_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
};

// The five-minute warning is shown once per sandbox.
export const wasWarnedFor = (expiresAt: string) => {
  try {
    return sessionStorage.getItem(WARNED_KEY) === expiresAt;
  } catch {
    return false;
  }
};

export const markWarnedFor = (expiresAt: string) => {
  try {
    sessionStorage.setItem(WARNED_KEY, expiresAt);
  } catch {
    // The warning may show again after a reload.
  }
};
