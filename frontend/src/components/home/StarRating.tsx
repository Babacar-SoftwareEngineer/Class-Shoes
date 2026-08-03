import React from 'react';

interface StarRatingProps {
  rating: number;       // e.g. 4.5
  maxStars?: number;    // default 5
  size?: 'sm' | 'md';   // default 'sm'
}

export default function StarRating({ rating, maxStars = 5, size = 'sm' }: StarRatingProps) {
  const sizeClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

        return (
          <svg
            key={i}
            className={`${sizeClass} shrink-0`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`star-fill-${i}-${rating}`}>
                <stop offset={`${fillPercentage}%`} stopColor="#F59E0B" />
                <stop offset={`${fillPercentage}%`} stopColor="#D4D4D8" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={`url(#star-fill-${i}-${rating})`}
            />
          </svg>
        );
      })}
    </div>
  );
}
