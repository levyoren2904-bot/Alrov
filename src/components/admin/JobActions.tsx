'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { publishJob, closeJob } from '@/app/actions/jobs';
import { Button } from '@/components/ui/Button';

interface JobActionsProps {
  jobId: string;
  status: string;
}

export function JobActions({ jobId, status }: JobActionsProps) {
  const router = useRouter();

  const handlePublish = async () => {
    const result = await publishJob(jobId);
    if (result.success) {
      toast.success('המשרה פורסמה');
      router.refresh();
    }
  };

  const handleClose = async () => {
    const result = await closeJob(jobId);
    if (result.success) {
      toast.success('המשרה נסגרה');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {status === 'DRAFT' && (
        <Button variant="ghost" size="sm" onClick={handlePublish}>
          פרסם
        </Button>
      )}
      {status === 'PUBLISHED' && (
        <Button variant="ghost" size="sm" onClick={handleClose}>
          סגור
        </Button>
      )}
      {status === 'CLOSED' && (
        <Button variant="ghost" size="sm" onClick={handlePublish}>
          פתח מחדש
        </Button>
      )}
    </div>
  );
}
