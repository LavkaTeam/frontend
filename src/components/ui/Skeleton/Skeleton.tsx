import type { CSSProperties, HTMLAttributes } from 'react';

import styles from './Skeleton.module.css';

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  radius?: CSSProperties['borderRadius'];
};

const Skeleton = ({
  width,
  height,
  radius,
  className = '',
  style,
  ...props
}: SkeletonProps) => (
  <div
    aria-hidden='true'
    className={`${styles.skeleton} ${className}`.trim()}
    style={{
      width,
      height,
      borderRadius: radius,
      ...style,
    }}
    {...props}
  />
);

export { Skeleton };
