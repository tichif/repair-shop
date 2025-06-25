'use client';

import { useRouter } from 'next/navigation';
import { type ButtonHTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';

type BackButtonProps = {
  title: string;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'outline'
    | null
    | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BackButton = ({
  title,
  className,
  value,
  variant,
  ...props
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => router.back()}
      title={title}
    >
      {title}
    </Button>
  );
};

export default BackButton;
