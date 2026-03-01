export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getRecruiterFilter } from '@/lib/auth/guards';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { applicationStatusLabels, formatDateShort } from '@/lib/utils';
import { type ApplicationStatus } from '@prisma/client';

const statusVariantMap: Record<string, 'default' | 'accent' | 'success' | 'error' | 'warning' | 'info'> = {
  NEW: 'info',
  IN_REVIEW: 'accent',
  PHONE_SCREEN: 'warning',
  INTERVIEW_SCHEDULED: 'warning',
  INTERVIEWED: 'accent',
  OFFER_SENT: 'success',
  HIRED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'default',
  ARCHIVED: 'default',
};

interface ApplicationsPageProps {
  searchParams: Promise<{
    status?: string;
    jobId?: string;
    hotelId?: string;
    departmentId?: string;
  }>;
}

export default async function AdminApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const session = await auth();
  const jobFilter = session ? getRecruiterFilter(session) : {};
  const params = await searchParams;

  const where = {
    job: {
      ...jobFilter,
      ...(params.hotelId && { hotelId: params.hotelId }),
      ...(params.departmentId && { departmentId: params.departmentId }),
    },
    ...(params.status && { status: params.status as ApplicationStatus }),
    ...(params.jobId && { jobId: params.jobId }),
  };

  const [applications, hotels, departments, jobs] = await Promise.all([
    db.application.findMany({
      where,
      include: {
        job: {
          select: {
            title: true,
            hotel: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.hotel.findMany({ select: { id: true, name: true } }),
    db.department.findMany({ select: { id: true, name: true } }),
    db.job.findMany({
      where: jobFilter,
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">מועמדויות</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <FilterLink href="/admin/applications" label="הכל" active={!params.status} />
        {Object.entries(applicationStatusLabels).map(([value, label]) => (
          <FilterLink
            key={value}
            href={`/admin/applications?status=${value}`}
            label={label}
            active={params.status === value}
          />
        ))}
      </div>

      <Card>
        {applications.length === 0 ? (
          <EmptyState title="אין מועמדויות" description="עדיין לא התקבלו מועמדויות" />
        ) : (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>משרה</TableHead>
                  <TableHead>מלון</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="font-medium hover:text-[var(--color-accent)]"
                      >
                        {app.fullName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]" dir="ltr">
                      {app.email}
                    </TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]">
                      {app.job.title}
                    </TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]">
                      {app.job.hotel.name}
                    </TableCell>
                    <TableCell>
                      <StatusSelect applicationId={app.id} currentStatus={app.status} />
                    </TableCell>
                    <TableCell className="text-[var(--color-text-tertiary)] text-xs">
                      {formatDateShort(app.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-sm text-[var(--color-accent)] hover:underline"
                      >
                        צפה
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-[var(--color-accent)] text-white'
          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
      }`}
    >
      {label}
    </Link>
  );
}
