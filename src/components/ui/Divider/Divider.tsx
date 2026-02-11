import styles from './Divider.module.css';

interface DividerProps {
  className?: string;
  color?: string;
  height?: string | number;
  margin?: string;
}

export const Divider = ({
  className = '',
  color,
  height = '1.5px',
  margin = '0',
}: DividerProps) => {
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${styles.divider} ${className}`}
      style={{
        backgroundColor: color,
        height: heightValue,
        margin: margin,
      }}
    />
  );
};
