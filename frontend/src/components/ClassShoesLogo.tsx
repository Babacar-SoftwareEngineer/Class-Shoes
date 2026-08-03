import Image from 'next/image';

interface ClassShoesLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  height?: number;
}

export default function ClassShoesLogo({ className = '', variant = 'dark', height = 52 }: ClassShoesLogoProps) {
  const wrapperClassName =
    variant === 'light'
      ? 'inline-flex items-center justify-center border border-white/10 bg-[var(--paper)] px-3 py-2 shadow-sm'
      : 'inline-flex items-center justify-center';

  return (
    <div className={`${wrapperClassName} select-none ${className}`}>
      <Image
        src="/brand/class-shoes-logo.png"
        alt="Class Shoes"
        width={305}
        height={172}
        priority={variant === 'dark'}
        style={{ height: `${height}px`, width: 'auto' }}
        className="block w-auto max-w-none"
      />
    </div>
  );
}
