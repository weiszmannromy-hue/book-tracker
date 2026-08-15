interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md';
}

export default function RatingStars({
  rating,
  onChange,
  size = 'md',
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  const textSize = size === 'sm' ? 'text-base' : 'text-2xl';

  return (
    <div className={`flex gap-0.5 ${textSize}`} dir="ltr">
      {stars.map((star) => {
        const filled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(star === rating ? 0 : star)}
            className={`leading-none transition-transform ${
              onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } ${filled ? 'text-amber-500' : 'text-stone-300'}`}
            aria-label={`דרג ${star} כוכבים`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
