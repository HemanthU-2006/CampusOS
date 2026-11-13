import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, value, onClear, onChange, ...props }, ref) => {
    return (
      <div
        className={cn(
          'relative flex items-center w-full transition-all duration-300 rounded-pill group',
          containerClassName
        )}
      >
        <div className="absolute left-4.5 text-white/50 group-focus-within:text-lime transition-colors duration-200 pointer-events-none flex items-center">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          style={{ fontFamily: 'var(--font-input)' }}
          className={cn(
            'w-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-white text-sm font-light tracking-wide rounded-pill pl-11 pr-10 py-2.5',
            'placeholder:text-white/40 placeholder:font-light outline-none transition-all duration-200',
            'focus:border-lime focus:ring-2 focus:ring-lime/30 focus:bg-white/[0.12] focus:shadow-[0_0_24px_rgba(131,243,77,0.2)]',
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 rounded-full hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
