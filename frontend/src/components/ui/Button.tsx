import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors focus-ring';
  
  const variants = {
    primary: 'bg-(--ink) text-(--paper) hover:bg-opacity-90',
    secondary: 'bg-(--page-bg) text-(--ink) hover:bg-(--line)',
    outline: 'border border-(--line) bg-transparent text-(--ink) hover:border-(--ink)',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
