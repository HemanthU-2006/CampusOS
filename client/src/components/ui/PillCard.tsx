import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export interface PillCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  showArrow?: boolean;
  active?: boolean;
}

export const PillCard = React.forwardRef<HTMLDivElement, PillCardProps>(
  ({ className, icon, title, subtitle, badge, showArrow = true, active = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-between p-3.5 sm:p-4 rounded-pill bg-card border border-ring/80 pill-hover-glow cursor-pointer select-none group',
          active && 'border-lime/60 shadow-[0_0_20px_rgba(131,243,77,0.25)] bg-[#212121]',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-2">
          {icon && (
            <div className="w-11 h-11 rounded-full bg-row flex items-center justify-center shrink-0 border border-ring text-lime group-hover:scale-105 group-hover:border-lime/40 transition-transform duration-200">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-lime transition-colors duration-200">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-white/60 truncate font-normal tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {showArrow && (
          <div className="w-8 h-8 rounded-full bg-row/80 flex items-center justify-center text-white/40 group-hover:text-lime group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 ml-2 border border-ring/60">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  }
);

PillCard.displayName = 'PillCard';
