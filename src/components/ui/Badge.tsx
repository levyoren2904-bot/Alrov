import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-soft-bg)] text-[var(--color-text-secondary)]',
        accent: 'border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent',
        success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
        error: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
        warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
        info: 'bg-[var(--color-info-light)] text-[var(--color-info)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
