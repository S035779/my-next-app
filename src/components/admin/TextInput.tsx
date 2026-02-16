import * as React from 'react';

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export default function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-300',
        className,
      )}
      {...rest}
    />
  );
}
