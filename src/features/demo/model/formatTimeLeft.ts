const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export const LOW_TIME_MS = 10 * MINUTE;
export const WARNING_TIME_MS = 5 * MINUTE;

// "23h 12m", "42m", "<1m", "0m".
export const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return '0m';
  if (ms < MINUTE) return '<1m';

  const hours = Math.floor(ms / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const isLowTime = (ms: number) => ms < LOW_TIME_MS;
