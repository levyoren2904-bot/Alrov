import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
}

export function KPICard({ title, value, icon: Icon, description }: KPICardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-md bg-[var(--color-soft-bg)] flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-0.5">{value}</p>
          {description && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
