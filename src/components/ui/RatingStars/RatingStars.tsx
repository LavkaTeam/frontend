import { useId } from 'react';

import styles from './RatingStars.module.css';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
}

const starPath =
  'M10 1.9L12.55 7.067L18.253 7.9L14.127 11.92L15.101 17.6L10 14.918L4.899 17.6L5.873 11.92L1.747 7.9L7.45 7.067L10 1.9Z';

interface StarIconProps {
  variant: 'filled' | 'half' | 'empty';
  size: number;
}

const StarIcon = ({ variant, size }: StarIconProps) => {
  const clipPathId = useId();

  return (
    <svg
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles.starIcon}
      style={{ width: size, height: size }}
      aria-hidden='true'
    >
      {variant === 'half' ? (
        <defs>
          <clipPath id={clipPathId}>
            <rect x='0' y='0' width='10' height='20' />
          </clipPath>
        </defs>
      ) : null}

      {variant === 'filled' ? (
        <path d={starPath} fill='#FABB05' />
      ) : null}

      {variant === 'half' ? (
        <path d={starPath} fill='#FABB05' clipPath={`url(#${clipPathId})`} />
      ) : null}

      <path
        d={starPath}
        fill='none'
        stroke='#FABB05'
        strokeWidth='1.4'
        strokeLinejoin='round'
      />
    </svg>
  );
};

const RatingStars = ({ rating, max = 5, size = 20 }: RatingStarsProps) => {
  const stars = [];

  for (let i = 1; i <= max; i += 1) {
    if (rating >= i) {
      stars.push(<StarIcon key={i} variant='filled' size={size} />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarIcon key={i} variant='half' size={size} />);
    } else {
      stars.push(<StarIcon key={i} variant='empty' size={size} />);
    }
  }

  return <div className={styles.ratingStars}>{stars}</div>;
};

export { RatingStars };
