export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download, Mail, Phone, MapPin, Linkedin, AlertTriangle, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { canAccessApplication } from '@/lib/auth/guards';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { AddNoteForm } from '@/components/admin/AddNoteForm';
import { applicationStatusLabels, formatDate, formatRelativeTime } from '@/lib/utils';

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  if (session && !(await canAccessApplication(session, id))) {
    notFound();
  }

  const application = await db.application.findUnique({
    where: { id },
    include: {
      job: {
        select: {
          title: true,
          hotel: { select: { name: true } },
          department: { select: { name: true } },
        },
      },
      notes: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      events: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!application) notFound();

  const isOld = Date.now() - application.createdAt.getTime() > 365 * 24 * 60 * 60 * 1000;
  const screeningAnswers = application.screeningAnswers as { question: string; answer: string }[];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{application.fullName}</h1>
          <p className="text-[var(--color-text-secondary)]">
            {application.job.title} | {application.job.hotel.name}
          </p>
        </div>
        <StatusSelect applicationId={application.id} currentStatus={application.status} />
      </div>

      {isOld && (
        <div className="flex items-center gap-2 p-3 bg-[var(--color-warning-light)] text-[var(--color-warning)] rounded-lg text-sm">
          <AlertTriangle className="h-4 w-4" />
          מועמדות ותיקה מעל 12 חודשים – יש לשקול ארכוב או מחיקה בהתאם למדיניות פרטיות
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">פרטי המועמד</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Mail} label="אימייל" value={application.email} dir="ltr" />
              <InfoRow icon={Phone} label="טלפון" value={application.phone} dir="ltr" />
              {application.city && (
                <InfoRow icon={MapPin} label="עיר" value={application.city} />
              )}
              {application.linkedinUrl && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* CV Download */}
              <div className="pt-3 border-t border-[var(--color-border)]">
                <a href={`/api/files/${application.cvPath}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4" />
                    הורד קו״ח – {application.cvOriginalName}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Screening Answers */}
          {screeningAnswers.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">תשובות סינון</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {screeningAnswers.map((qa, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium mb-1">{qa.question}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{qa.answer || '—'}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">הערות פנימיות</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <AddNoteForm applicationId={application.id} />

              {application.notes.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                  {application.notes.map((note) => (
                    <div key={note.id} className="bg-[var(--color-bg)] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{note.user.name}</span>
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          {formatRelativeTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-line">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">יומן פעילות</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.events.map((event) => {
                  const metadata = event.metadata as Record<string, string>;
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          {event.type === 'APPLICATION_SUBMITTED' && 'מועמדות הוגשה'}
                          {event.type === 'STATUS_CHANGED' && (
                            <>סטטוס עודכן ל{applicationStatusLabels[metadata?.newStatus] || metadata?.newStatus}</>
                          )}
                          {event.type === 'NOTE_ADDED' && 'הערה נוספה'}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                          {event.user?.name || 'מערכת'} • {formatRelativeTime(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {application.events.length === 0 && (
                  <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">
                    אין פעילות
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardContent>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  הוגש ב-{formatDate(application.createdAt)}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  עודכן ב-{formatDate(application.updatedAt)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, dir }: { icon: typeof Mail; label: string; value: string; dir?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
      <span className="text-sm text-[var(--color-text-secondary)]">{label}:</span>
      <span className="text-sm font-medium" dir={dir}>{value}</span>
    </div>
  );
}
