export const dynamic = 'force-dynamic';

import { Briefcase, Users, Clock, FileCheck } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { KPICard } from '@/components/admin/KPICard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { applicationStatusLabels, formatRelativeTime } from '@/lib/utils';
import { getRecruiterFilter } from '@/lib/auth/guards';
import Link from 'next/link';

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

export default async function AdminDashboard() {
  const session = await auth();
  const jobFilter = session ? getRecruiterFilter(session) : {};

  const [activeJobs, totalApplications, recentApplicationsCount, pendingReview] = await Promise.all([
    db.job.count({ where: { status: 'PUBLISHED', ...jobFilter } }),
    db.application.count({
      where: { job: jobFilter },
    }),
    db.application.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        job: jobFilter,
      },
    }),
    db.application.count({
      where: { status: 'NEW', job: jobFilter },
    }),
  ]);

  const recentApplications = await db.application.findMany({
    where: { job: jobFilter },
    include: {
      job: { select: { title: true, hotel: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const recentEvents = await db.applicationEvent.findMany({
    include: {
      application: { select: { fullName: true, job: { select: { title: true } } } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">דשבורד</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="משרות פעילות" value={activeJobs} icon={Briefcase} />
        <KPICard title="סה״כ מועמדויות" value={totalApplications} icon={Users} />
        <KPICard title="מועמדויות 7 ימים" value={recentApplicationsCount} icon={Clock} />
        <KPICard title="ממתינות לבדיקה" value={pendingReview} icon={FileCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">מועמדויות אחרונות</h2>
                <Link href="/admin/applications" className="text-sm text-[var(--color-accent)] hover:underline">
                  הצג הכל
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>משרה</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>תאריך</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Link href={`/admin/applications/${app.id}`} className="font-medium hover:text-[var(--color-accent)]">
                          {app.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-[var(--color-text-secondary)]">
                        {app.job.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[app.status] || 'default'}>
                          {applicationStatusLabels[app.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[var(--color-text-tertiary)] text-xs">
                        {formatRelativeTime(app.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">פעילות אחרונה</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{event.user?.name || 'מערכת'}</span>
                      {' – '}
                      <span className="text-[var(--color-text-secondary)]">
                        {event.type === 'APPLICATION_SUBMITTED' && 'מועמדות חדשה'}
                        {event.type === 'STATUS_CHANGED' && 'עדכון סטטוס'}
                        {event.type === 'NOTE_ADDED' && 'הערה חדשה'}
                      </span>
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {event.application?.fullName} • {event.application?.job?.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {formatRelativeTime(event.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">אין פעילות אחרונה</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
