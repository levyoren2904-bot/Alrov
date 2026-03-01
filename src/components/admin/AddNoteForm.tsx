'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { addApplicationNote } from '@/app/actions/applications';

interface AddNoteFormProps {
  applicationId: string;
}

export function AddNoteForm({ applicationId }: AddNoteFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const result = await addApplicationNote(applicationId, content.trim());
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('הערה נוספה');
        setContent('');
        router.refresh();
      }
    } catch {
      toast.error('אירעה שגיאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="הוסף הערה פנימית..."
        className="min-h-[80px]"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={loading} disabled={!content.trim()}>
          הוסף הערה
        </Button>
      </div>
    </form>
  );
}
