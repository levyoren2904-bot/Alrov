export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { JobForm } from '@/components/admin/JobForm';

export default async function NewJobPage() {
  const [hotels, departments, recruiters] = await Promise.all([
    db.hotel.findMany({ select: { id: true, name: true } }),
    db.department.findMany({ select: { id: true, name: true } }),
    db.user.findMany({
      where: { role: { in: ['RECRUITER', 'HR_MANAGER'] } },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">משרה חדשה</h1>
      <JobForm hotels={hotels} departments={departments} recruiters={recruiters} />
    </div>
  );
}
