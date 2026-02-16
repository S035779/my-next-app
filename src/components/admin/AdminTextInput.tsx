import { forwardRef } from 'react';
import { cn } from '@/src/lib/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const AdminTextInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          'block w-full rounded-lg border px-3 py-2 text-sm',
          'border-gray-300 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          props['aria-invalid'] && 'border-red-500 focus:ring-red-500',
          className,
        )}
      />
    );
  },
);

AdminTextInput.displayName = 'AdminTextInput';

export default AdminTextInput;
