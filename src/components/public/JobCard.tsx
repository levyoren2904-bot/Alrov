import Link from 'next/link';
import { MapPin, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { employmentTypeLabels, formatDateShort } from '@/lib/utils';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    slug: string;
    city: string;
    employmentType: string;
    publishedAt: Date | null;
    hotel: { name: string };
    department: { name: string };
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.slug}`}>
      <Card hover className="h-full border-[var(--color-border)] rounded-2xl">
        <CardContent className="flex flex-col gap-3.5 pt-5 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-text-primary)] leading-snug">
                {job.title}
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-[0.18em]">
                {job.hotel.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-text-tertiary)]" />
              <span>{job.city}</span>
            </div>
            {job.publishedAt && (
              <span className="text-[var(--color-text-tertiary)]">
                {formatDateShort(job.publishedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 flex-wrap border-t border-[var(--color-border)] mt-1 pt-3">
            <Badge variant="accent">
              {employmentTypeLabels[job.employmentType] || job.employmentType}
            </Badge>
            <Badge>{job.department.name}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
