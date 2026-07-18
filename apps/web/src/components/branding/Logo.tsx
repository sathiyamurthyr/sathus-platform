import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
};

export function Logo({ size = 'md', href = '/', className }: LogoProps) {
  return (
    <Link href={href} className={className}>
      <span className="sr-only">Sathus Technology</span>
      <Image
        src="/branding/logo.svg"
        alt="Sathus Technology"
        width={200}
        height={40}
        className={`${SIZE_CLASSES[size]} w-auto`}
        priority
      />
    </Link>
  );
}