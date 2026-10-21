// 75 -> "1:15", 9 -> "0:09"
export const formatCooldown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, '0');

  return `${minutes}:${rest}`;
};
