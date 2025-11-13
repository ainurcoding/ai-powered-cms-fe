import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary dark:hover:opacity-90 dark:hover:brightness-110 shadow-sm hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_8px_rgba(255,255,255,0.15)] active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-destructive dark:hover:opacity-90 dark:hover:brightness-110 shadow-sm hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_8px_rgba(255,255,255,0.15)] active:scale-[0.98]',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:border-primary/70 dark:hover:brightness-110 shadow-sm hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_8px_rgba(255,255,255,0.15)] active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary dark:hover:brightness-110 shadow-sm hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_8px_rgba(255,255,255,0.15)] active:scale-[0.98]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
