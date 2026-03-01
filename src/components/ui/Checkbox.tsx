'use client';

import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="flex items-start gap-2.5 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id={inputId}
              ref={ref}
              className={cn('peer sr-only', className)}
              {...props}
            />
            <div className={cn(
              'h-5 w-5 rounded border-2 border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200',
              'group-hover:border-[var(--color-border-hover)]',
              'peer-checked:bg-[var(--color-accent)] peer-checked:border-[var(--color-accent)]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] peer-focus-visible:ring-offset-2',
              error && 'border-[var(--color-error)]'
            )}>
              <Check className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity absolute top-0 right-0" />
            </div>
          </div>
          {label && (
            <span className="text-sm text-[var(--color-text-primary)] select-none leading-5">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
