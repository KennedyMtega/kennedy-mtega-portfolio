
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";

// Define buttonVariants using cva for consistency with shadcn/ui
export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-transparent hover:bg-secondary',
        ghost: 'bg-transparent hover:bg-secondary',
        link: 'bg-transparent underline-offset-4 hover:underline text-primary',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'text-xs px-3 py-1.5 rounded-full',
        md: 'text-sm px-5 py-2.5 rounded-full',
        lg: 'text-base px-7 py-3 rounded-full',
        default: 'text-sm px-5 py-2.5 rounded-full',
        icon: 'h-10 w-10 rounded-full',
      },
      fullWidth: {
        true: 'w-full',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  to?: string;
  external?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    children,
    to,
    external,
    className,
    icon,
    iconPosition = 'right',
    fullWidth = false,
    loading = false,
    ...props
  }, ref) => {
    const baseStyles = cn(
      buttonVariants({ variant, size, fullWidth, className })
    );

    const loadingSpinner = (
      <svg 
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    const content = (
      <>
        {loading && loadingSpinner}
        {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && !loading && <span className="ml-2">{icon}</span>}
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          className={baseStyles}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }

    if (external) {
      return (
        <a
          href={external}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
          {...(props as any)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={baseStyles}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Export both as default and named export for flexibility
export { Button };
export default Button;
