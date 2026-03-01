'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Upload, CheckCircle2, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { submitApplication } from '@/app/actions/applications';
import Link from 'next/link';

interface ScreeningQuestion {
  question: string;
  required: boolean;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

interface JobInfo {
  id: string;
  title: string;
  hotel: { name: string };
  screeningQuestions: ScreeningQuestion[];
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [job, setJob] = useState<JobInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push('/jobs');
        } else {
          setJob(data);
        }
      })
      .catch(() => router.push('/jobs'))
      .finally(() => setLoading(false));
  }, [jobId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set('jobId', jobId);
      formData.set('privacyConsent', String(privacyConsent));

      if (cvFile) {
        formData.set('cv', cvFile);
      }

      if (job?.screeningQuestions?.length) {
        const answers = job.screeningQuestions.map((q, i) => ({
          question: q.question,
          answer: screeningAnswers[i] || '',
        }));
        formData.set('screeningAnswers', JSON.stringify(answers));
      }

      const result = await submitApplication(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('אירעה שגיאה. נא לנסות שנית.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setCvFile(file);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="animate-skeleton h-7 w-56 rounded mb-4" />
        <div className="animate-skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-[var(--color-success)]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">
          תודה – קיבלנו את פנייתך ונחזור אליך בהקדם.
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          שלחנו לך אישור למייל שהזנת.
        </p>
        <Link href="/jobs">
          <Button variant="secondary">חזרה למשרות</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 md:py-16">
      {job && (
        <div className="mb-8 md:mb-10">
          <p className="text-xs tracking-[0.26em] text-[var(--color-text-tertiary)] mb-2">
            APPLICATION
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">
            הגשת מועמדות – {job.title}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {job.hotel.name}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-[var(--color-error-light)] text-[var(--color-error)] text-sm">
          {error}
        </div>
      )}

      <Card className="rounded-2xl border-[var(--color-border)]">
        <CardContent className="pt-7 pb-7 md:pt-8 md:pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="שם מלא"
              name="fullName"
              required
              placeholder="שם פרטי ומשפחה"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="אימייל"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                dir="ltr"
              />
              <Input
                label="טלפון"
                name="phone"
                type="tel"
                required
                placeholder="050-0000000"
                dir="ltr"
              />
            </div>

            <Input
              label="עיר מגורים"
              name="city"
              placeholder="עיר"
            />

            <Input
              label="LinkedIn"
              name="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/..."
              dir="ltr"
              hint="אופציונלי"
            />

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                קורות חיים <span className="text-[var(--color-error)]">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  cvFile
                    ? 'border-[var(--color-success)] bg-[var(--color-success-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCvFile(file);
                  }}
                />
                {cvFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-5 w-5 text-[var(--color-success)]" />
                    <span className="text-sm font-medium">{cvFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                      }}
                      className="p-1 hover:bg-white/50 rounded cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-[var(--color-text-tertiary)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      גררו קובץ לכאן או לחצו לבחירה
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                      PDF, DOC, DOCX (עד 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Screening Questions */}
            {job?.screeningQuestions?.map((q: ScreeningQuestion, i: number) => (
              <div key={i}>
                {q.type === 'textarea' ? (
                  <Textarea
                    label={q.question}
                    required={q.required}
                    value={screeningAnswers[i] || ''}
                    onChange={(e) =>
                      setScreeningAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                  />
                ) : (
                  <Input
                    label={q.question}
                    required={q.required}
                    value={screeningAnswers[i] || ''}
                    onChange={(e) =>
                      setScreeningAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}

            {/* Privacy Consent */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                required
              />
              <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                אני מאשר/ת שקראתי את{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  מדיניות הפרטיות
                </Link>{' '}
                ומסכים/ה לתנאיה.
              </span>
            </label>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={submitting}
              disabled={!privacyConsent || !cvFile}
            >
              שלח מועמדות
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
