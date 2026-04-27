import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@template/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' &&
          'bg-yellow-400 text-black hover:bg-yellow-500 focus-visible:ring-yellow-500',
        variant === 'secondary' &&
          'bg-blue-900 text-white hover:bg-blue-800 focus-visible:ring-blue-700',
        variant === 'ghost' && 'hover:bg-gray-100 focus-visible:ring-gray-500',
        variant === 'destructive' &&
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-12 px-6 text-lg',
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
