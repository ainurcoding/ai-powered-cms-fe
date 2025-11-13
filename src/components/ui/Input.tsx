import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:shadow-[0_2px_4px_rgba(0,0,0,0.08)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0_1px_2px_rgba(255,255,255,0.03)] dark:focus-visible:shadow-[0_2px_4px_rgba(255,255,255,0.08)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
