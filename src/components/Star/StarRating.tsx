import { EmptyStar } from './EmptyStar';
import { FilledStar } from './FilledStar';

interface StarRatingProps {
  rate: number;
}

const StarRating = ({ rate }: StarRatingProps) => {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) =>
        index < Math.floor(rate) ? (
          <FilledStar key={index} />
        ) : (
          <EmptyStar key={index} />
        ),
      )}
    </>
  );
};

export { StarRating };
