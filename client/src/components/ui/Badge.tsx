import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'overdue'
  | 'resolved'
  | 'cancelled'
  | 'lime'
  | 'neutral'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  dot = false,
  ...props
}) => {
  const variants: Record<BadgeVariant, { badge: string; dot: string }> = {
    pending: {
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    approved: {
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    resolved: {
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    rejected: {
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400',
    },
    cancelled: {
      badge: 'bg-white/5 text-white/50 border-white/10 line-through',
      dot: 'bg-white/30',
    },
    overdue: {
      badge: 'bg-red-500/15 text-red-300 border-red-500/40 font-semibold animate-pulse',
      dot: 'bg-red-400',
    },
    lime: {
      badge: 'bg-lime/10 text-lime border-lime/30 font-medium',
      dot: 'bg-lime',
    },
    neutral: {
      badge: 'bg-white/5 text-white/70 border-white/10',
      dot: 'bg-white/40',
    },
    info: {
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      dot: 'bg-blue-400',
    },
  };

  const current = variants[variant] || variants.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none tracking-wide capitalize',
        current.badge,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', current.dot)} />}
      {children}
    </span>
  );
};
