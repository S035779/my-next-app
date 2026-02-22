'use client';

import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4',
  } as const;

  const variants = {
    primary: 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
    danger: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
    ghost: 'border-transparent bg-transparent text-gray-700 hover:bg-gray-50',
  } as const;

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
