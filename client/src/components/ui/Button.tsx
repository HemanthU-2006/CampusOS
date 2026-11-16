import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'lime' | 'outline' | 'white' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'lime', size = 'md', isLoading = false, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      lime: 'bg-lime text-lime-ink hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(131,243,77,0.45)] font-semibold border border-transparent',
      outline:
        'border border-lime/60 text-lime bg-transparent hover:bg-lime/10 hover:border-lime hover:-translate-y-[1px]',
      white:
        'bg-white text-page hover:bg-white/90 hover:-translate-y-[1px] font-medium border border-transparent',
      ghost:
        'bg-transparent text-white/80 hover:text-white hover:bg-white/5 border border-transparent',
      danger:
        'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 hover:-translate-y-[1px]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-btn gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-btn gap-2',
      lg: 'text-base px-6 py-3 rounded-btn gap-2.5 font-semibold',
      icon: 'h-10 w-10 p-0 rounded-btn',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
