import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Building2, Briefcase, Clock } from 'lucide-react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShareButtons } from '@/components/public/ShareButtons';
import { employmentTypeLabels, formatDate } from '@/lib/utils';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await db.job.findUnique({
    where: { slug },
    include: { hotel: true },
  });

  if (!job) return { title: 'משרה לא נמצאה' };

  return {
    title: `${job.title} | ${job.hotel.name}`,
    description: job.description.substring(0, 160),
    openGraph: {
      title: `${job.title} - ${job.hotel.name}`,
      description: job.description.substring(0, 160),
      type: 'article',
    },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await db.job.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { hotel: true, department: true },
  });

  if (!job) notFound();

  const baseUrl = process.env.NEXTAUTH_URL || 'https://careers.alrov.co.il';
  const jobUrl = `${baseUrl}/jobs/${job.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt?.toISOString(),
    employmentType: job.employmentType.replace('_', ' '),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'אלרוב נכסים ומלונאות',
      sameAs: 'https://www.alrov.co.il',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressCountry: 'IL',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Israel',
    },
  };

  const sections = [
    { title: 'תיאור המשרה', content: job.description },
    { title: 'תחומי אחריות', content: job.responsibilities },
    { title: 'דרישות', content: job.requirements },
    { title: 'שכר מתגמל והטבות', content: job.benefits },
  ].filter((s) => s.content?.trim());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16 grid md:grid-cols-[1.4fr,1fr] gap-10 items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">
                {employmentTypeLabels[job.employmentType]}
              </Badge>
              <Badge>{job.department.name}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text-primary)]">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[var(--color-text-secondary)] text-sm">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {job.hotel.name}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.city}
              </span>
              {job.publishedAt && (
                <span className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--color-text-tertiary)]">
                  <Clock className="h-4 w-4" />
                  פורסם {formatDate(job.publishedAt)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <ShareButtons url={jobUrl} title={job.title} />
              <Link href={`/apply/${job.id}`} className="hidden md:block">
                <Button size="lg">הגש מועמדות</Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[var(--color-border)] bg-gradient-to-br from-[#1F2A44] via-[#2C2A7A] to-[#4F63A6] flex items-end">
              <div className="w-full p-5 flex flex-col gap-1.5 bg-gradient-to-t from-black/35 via-black/10 to-transparent text-white">
                <p className="text-[0.68rem] tracking-[0.18em] uppercase">
                  POSITION OVERVIEW
                </p>
                <p className="text-sm font-medium line-clamp-2">
                  תפקיד בחזית חוויית האורח במלון יוקרה, עם דגש על שירות אישי
                  ומקצועיות מוקפדת.
                </p>
                <p className="text-[0.7rem] opacity-80">
                  המחשה ויזואלית כללית, אינה מייצגת את החלל בפועל.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 py-12">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                {section.title}
              </h2>
              <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">מיקום</h2>
            <div className="bg-[var(--color-bg)] rounded-xl p-6 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[var(--color-accent)]" />
              <div>
                <p className="font-medium">{job.hotel.name}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{job.city}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 md:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 z-40">
        <Link href={`/apply/${job.id}`} className="block">
          <Button size="lg" className="w-full">הגש מועמדות</Button>
        </Link>
      </div>
    </>
  );
}
