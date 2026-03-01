export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { JobCard } from '@/components/public/JobCard';
import { JobFilters } from '@/components/public/JobFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';
import { type EmploymentType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'משרות פנויות',
  description: 'צפו במשרות הפנויות בקבוצת מלונות אלרוב',
};

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    hotel?: string;
    department?: string;
    type?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  const [hotels, departments] = await Promise.all([
    db.hotel.findMany({ select: { id: true, name: true } }),
    db.department.findMany({ select: { id: true, name: true } }),
  ]);

  const where = {
    status: 'PUBLISHED' as const,
    ...(params.hotel && { hotelId: params.hotel }),
    ...(params.department && { departmentId: params.department }),
    ...(params.type && { employmentType: params.type as EmploymentType }),
    ...(params.q && {
      OR: [
        { title: { contains: params.q, mode: 'insensitive' as const } },
        { description: { contains: params.q, mode: 'insensitive' as const } },
        { city: { contains: params.q, mode: 'insensitive' as const } },
      ],
    }),
  };

  const jobs = await db.job.findMany({
    where,
    include: { hotel: true, department: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
      <header className="mb-10 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.26em] text-[var(--color-text-tertiary)]">
            OPEN POSITIONS
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text-primary)]">
            משרות פנויות במלונות אלרוב.
          </h1>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] max-w-xl">
            בחרו מלון, מחלקה או סוג משרה כדי לגלות הזדמנויות קריירה מתאימות –
            בקבלה, מזון ומשקאות, ניהול, משאבי אנוש ועוד.
          </p>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] border border-[var(--color-border)] rounded-full px-4 py-1.5">
          {jobs.length} משרות פעילות כרגע
        </p>
      </header>

      <Suspense fallback={<div className="h-24 animate-skeleton rounded-2xl" />}>
        <JobFilters
          hotels={hotels.map((h) => ({ value: h.id, label: h.name }))}
          departments={departments.map((d) => ({ value: d.id, label: d.name }))}
        />
      </Suspense>

      <section className="mt-9">
        {jobs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="לא נמצאו משרות"
            description="נסו לשנות את מסנני החיפוש או לחזור במועד מאוחר יותר."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
