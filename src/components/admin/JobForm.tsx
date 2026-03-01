'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { createJob, updateJob } from '@/app/actions/jobs';
import { slugify } from '@/lib/utils';

interface ScreeningQuestion {
  question: string;
  required: boolean;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

interface JobFormProps {
  job?: {
    id: string;
    title: string;
    slug: string;
    hotelId: string;
    departmentId: string;
    employmentType: string;
    city: string;
    description: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    screeningQuestions: ScreeningQuestion[];
    recipientEmails: string[];
    recruiterId: string | null;
    status: string;
  };
  hotels: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  recruiters: { id: string; name: string }[];
}

export function JobForm({ job, hotels, departments, recruiters }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(job?.title || '');
  const [slug, setSlug] = useState(job?.slug || '');
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>(
    (job?.screeningQuestions as ScreeningQuestion[]) || []
  );
  const [recipientEmails, setRecipientEmails] = useState<string[]>(
    (job?.recipientEmails as string[]) || []
  );
  const [newEmail, setNewEmail] = useState('');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!job) {
      setSlug(slugify(value));
    }
  };

  const addQuestion = () => {
    setScreeningQuestions([...screeningQuestions, { question: '', required: false, type: 'text' }]);
  };

  const removeQuestion = (index: number) => {
    setScreeningQuestions(screeningQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updates: Partial<ScreeningQuestion>) => {
    setScreeningQuestions(
      screeningQuestions.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const addEmail = () => {
    if (newEmail && !recipientEmails.includes(newEmail)) {
      setRecipientEmails([...recipientEmails, newEmail]);
      setNewEmail('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const employmentType = form.get('employmentType') as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP';
      const status = (form.get('status') as 'DRAFT' | 'PUBLISHED' | 'CLOSED') || 'DRAFT';
      const data = {
        title,
        slug,
        hotelId: form.get('hotelId') as string,
        departmentId: form.get('departmentId') as string,
        employmentType,
        city: form.get('city') as string,
        description: form.get('description') as string,
        responsibilities: form.get('responsibilities') as string,
        requirements: form.get('requirements') as string,
        benefits: form.get('benefits') as string,
        screeningQuestions,
        recipientEmails,
        recruiterId: (form.get('recruiterId') as string) || null,
        status,
      };

      const result = job
        ? await updateJob(job.id, data)
        : await createJob(data);

      if ('error' in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(job ? 'המשרה עודכנה' : 'המשרה נוצרה');
        router.push('/admin/jobs');
        router.refresh();
      }
    } catch (err) {
      toast.error('אירעה שגיאה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">פרטי המשרה</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="כותרת"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="מלון"
              name="hotelId"
              options={hotels.map((h) => ({ value: h.id, label: h.name }))}
              placeholder="בחר מלון"
              defaultValue={job?.hotelId}
              required
            />
            <Select
              label="מחלקה"
              name="departmentId"
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              placeholder="בחר מחלקה"
              defaultValue={job?.departmentId}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="סוג משרה"
              name="employmentType"
              options={[
                { value: 'FULL_TIME', label: 'משרה מלאה' },
                { value: 'PART_TIME', label: 'משרה חלקית' },
                { value: 'CONTRACT', label: 'חוזה' },
                { value: 'TEMPORARY', label: 'זמני' },
                { value: 'INTERNSHIP', label: 'התמחות' },
              ]}
              defaultValue={job?.employmentType || 'FULL_TIME'}
              required
            />
            <Input
              label="עיר"
              name="city"
              defaultValue={job?.city}
              required
            />
            <Select
              label="סטטוס"
              name="status"
              options={[
                { value: 'DRAFT', label: 'טיוטה' },
                { value: 'PUBLISHED', label: 'פורסם' },
                { value: 'CLOSED', label: 'סגור' },
              ]}
              defaultValue={job?.status || 'DRAFT'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">תוכן</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="תיאור"
            name="description"
            defaultValue={job?.description}
            required
            className="min-h-[150px]"
          />
          <Textarea
            label="תחומי אחריות"
            name="responsibilities"
            defaultValue={job?.responsibilities}
            required
          />
          <Textarea
            label="דרישות"
            name="requirements"
            defaultValue={job?.requirements}
            required
          />
          <Textarea
            label="שכר מתגמל והטבות"
            name="benefits"
            defaultValue={job?.benefits}
          />
        </CardContent>
      </Card>

      {/* Screening Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">שאלות סינון</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addQuestion}>
              <Plus className="h-4 w-4" />
              הוסף שאלה
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {screeningQuestions.length === 0 && (
            <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">
              אין שאלות סינון
            </p>
          )}
          {screeningQuestions.map((q, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-[var(--color-bg)] rounded-lg">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="שאלה"
                  value={q.question}
                  onChange={(e) => updateQuestion(i, { question: e.target.value })}
                />
                <div className="flex items-center gap-4">
                  <Select
                    options={[
                      { value: 'text', label: 'טקסט' },
                      { value: 'textarea', label: 'טקסט ארוך' },
                    ]}
                    value={q.type}
                    onChange={(e) => updateQuestion(i, { type: e.target.value as 'text' | 'textarea' })}
                  />
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(i, { required: e.target.checked })}
                      className="accent-[var(--color-accent)]"
                    />
                    חובה
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Assignment */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">הקצאה</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="מגייס/ת אחראי"
            name="recruiterId"
            options={recruiters.map((r) => ({ value: r.id, label: r.name }))}
            placeholder="לא הוקצה"
            defaultValue={job?.recruiterId || ''}
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              אימיילים לקבלת התראות
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@alrov.co.il"
                dir="ltr"
                type="email"
              />
              <Button type="button" variant="secondary" onClick={addEmail}>
                הוסף
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipientEmails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-bg)] rounded-full text-xs"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => setRecipientEmails(recipientEmails.filter((e) => e !== email))}
                    className="hover:text-[var(--color-error)] cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <CardFooter className="flex items-center justify-end gap-3 bg-transparent border-0 px-0">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          ביטול
        </Button>
        <Button type="submit" loading={loading}>
          {job ? 'עדכן משרה' : 'צור משרה'}
        </Button>
      </CardFooter>
    </form>
  );
}
