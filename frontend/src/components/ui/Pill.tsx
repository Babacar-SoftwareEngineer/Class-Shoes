import React from 'react';

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Pill: React.FC<PillProps> = ({
  children,
  selected = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full px-6 py-2 text-sm transition-colors focus-ring border';
  
  const selectedStyles = selected 
    ? 'border-(--ink) bg-(--ink) text-(--paper)' 
    : 'border-(--line) bg-transparent text-(--ink) hover:border-(--ink)';

  return (
    <button
      className={`${baseStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
