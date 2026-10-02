import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentDisplayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentDisplayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`transition-transform duration-150 ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 focus:outline-none'
            }`}
          >
            <Star
              className={`${starSizes[size] || starSizes.md} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'fill-slate-800 text-slate-600'
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
