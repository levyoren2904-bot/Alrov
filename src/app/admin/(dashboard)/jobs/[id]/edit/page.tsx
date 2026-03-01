export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { JobForm } from '@/components/admin/JobForm';

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;

  const [job, hotels, departments, recruiters] = await Promise.all([
    db.job.findUnique({ where: { id } }),
    db.hotel.findMany({ select: { id: true, name: true } }),
    db.department.findMany({ select: { id: true, name: true } }),
    db.user.findMany({
      where: { role: { in: ['RECRUITER', 'HR_MANAGER'] } },
      select: { id: true, name: true },
    }),
  ]);

  if (!job) notFound();

  const jobData = {
    ...job,
    screeningQuestions: job.screeningQuestions as { question: string; required: boolean; type: 'text' | 'textarea' | 'select'; options?: string[] }[],
    recipientEmails: job.recipientEmails as string[],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">עריכת משרה</h1>
      <JobForm job={jobData} hotels={hotels} departments={departments} recruiters={recruiters} />
    </div>
  );
}
