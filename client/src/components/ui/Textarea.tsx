import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-white/80 select-none">{label}</label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-card text-white text-sm rounded-btn border border-rule px-3.5 py-2.5 outline-none transition-all duration-200 placeholder:text-white/30 resize-y',
            'focus:border-lime focus:ring-2 focus:ring-lime/20 focus:bg-card/90',
            error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-medium pl-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
