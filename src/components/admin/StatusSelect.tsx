'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateApplicationStatus } from '@/app/actions/applications';
import { applicationStatusLabels } from '@/lib/utils';

interface StatusSelectProps {
  applicationId: string;
  currentStatus: string;
}

const statuses = [
  'NEW', 'IN_REVIEW', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED',
  'INTERVIEWED', 'OFFER_SENT', 'HIRED', 'REJECTED', 'WITHDRAWN', 'ARCHIVED',
];

export function StatusSelect({ applicationId, currentStatus }: StatusSelectProps) {
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const result = await updateApplicationStatus(applicationId, e.target.value);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('הסטטוס עודכן');
      router.refresh();
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="text-xs px-2 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {applicationStatusLabels[s]}
        </option>
      ))}
    </select>
  );
}
