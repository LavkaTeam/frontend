import { useCallback, useEffect, useState } from 'react';

/**
 * Seconds-based countdown, e.g. for "Resend email in 42s".
 * `start(seconds)` (re)starts it; `secondsLeft` is 0 when it is over.
 */
const useCountdown = () => {
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    if (secondsLeft === 0) return undefined;

    const timerId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(timerId);
  }, [secondsLeft]);

  const start = useCallback((seconds: number) => {
    const startedAt = Date.now();

    setNow(startedAt);
    setEndsAt(startedAt + seconds * 1000);
  }, []);

  return { secondsLeft, start };
};

export { useCountdown };
