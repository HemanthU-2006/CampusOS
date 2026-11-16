import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  badge?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, defaultOpenId, className }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn('space-y-3 w-full', className)} role="region" aria-label="Accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'rounded-row border bg-card transition-colors duration-200 overflow-hidden',
              isOpen ? 'border-lime/40 bg-[#1D1D1D]' : 'border-ring/80 hover:border-rule'
            )}
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group select-none outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <div className="flex items-center gap-3 pr-4">
                <span
                  className={cn(
                    'text-sm sm:text-base font-semibold transition-colors duration-200',
                    isOpen ? 'text-lime' : 'text-white group-hover:text-white/90'
                  )}
                >
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-row text-white/70 border border-ring">
                    {item.badge}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'w-8 h-8 rounded-full bg-row flex items-center justify-center shrink-0 border border-ring transition-transform duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                  isOpen
                    ? 'rotate-180 bg-lime text-lime-ink border-transparent shadow-[0_0_12px_rgba(131,243,77,0.3)]'
                    : 'text-white/50 group-hover:text-white'
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* CSS Grid 0fr to 1fr transition .32s */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 text-sm text-white/75 leading-relaxed border-t border-ring/40">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
