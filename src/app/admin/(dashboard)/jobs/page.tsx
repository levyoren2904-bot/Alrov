export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getRecruiterFilter } from '@/lib/auth/guards';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { jobStatusLabels, employmentTypeLabels, formatDateShort } from '@/lib/utils';
import { JobActions } from '@/components/admin/JobActions';

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  CLOSED: 'default',
};

export default async function AdminJobsPage() {
  const session = await auth();
  const jobFilter = session ? getRecruiterFilter(session) : {};

  const jobs = await db.job.findMany({
    where: jobFilter,
    include: {
      hotel: { select: { name: true } },
      department: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">משרות</h1>
        <Link href="/admin/jobs/new">
          <Button>
            <Plus className="h-4 w-4" />
            משרה חדשה
          </Button>
        </Link>
      </div>

      <Card>
        {jobs.length === 0 ? (
          <EmptyState
            title="אין משרות"
            description="צרו את המשרה הראשונה כדי להתחיל"
            action={{ label: 'צור משרה', href: '/admin/jobs/new' }}
          />
        ) : (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>כותרת</TableHead>
                  <TableHead>מלון</TableHead>
                  <TableHead>מחלקה</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>מועמדויות</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Link href={`/admin/jobs/${job.id}/edit`} className="font-medium hover:text-[var(--color-accent)]">
                        {job.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]">{job.hotel.name}</TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]">{job.department.name}</TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]">
                      {employmentTypeLabels[job.employmentType]}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[job.status] || 'default'}>
                        {jobStatusLabels[job.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{job._count.applications}</TableCell>
                    <TableCell className="text-[var(--color-text-tertiary)] text-xs">
                      {formatDateShort(job.createdAt)}
                    </TableCell>
                    <TableCell>
                      <JobActions jobId={job.id} status={job.status} />
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
