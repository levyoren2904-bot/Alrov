export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/public/JobCard';
import { db } from '@/lib/db';

export default async function HomePage() {
  const featuredJobs = await db.job.findMany({
    where: { status: 'PUBLISHED' },
    include: { hotel: true, department: true },
    orderBy: { publishedAt: 'desc' },
    take: 6,
  });

  return (
    <>
      {/* Hero Section – hotel-style full width */}
      <section className="relative overflow-hidden bg-[var(--color-surface)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 left-[-20%] w-[65%] bg-[var(--color-soft-bg)]" />
          <div className="absolute inset-y-10 right-[-10%] w-[55%] rounded-l-2xl bg-[var(--color-accent-light)]/80" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 lg:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 flex flex-col items-start text-right md:text-right">
            <p className="text-xs tracking-[0.28em] text-[var(--color-text-tertiary)] mb-4">
              LUXURY HOSPITALITY CAREERS
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[var(--color-text-primary)] leading-[1.15] mb-5">
              קריירה באלרוב
              <br />
              מלונות יוקרה.
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] max-w-md leading-relaxed mb-8">
              הזמנה להצטרף לצוותי המלונות היוקרתיים של קבוצת אלרוב – תפקידי
              שירות, ניהול ומטה, באווירה ירושלמית אלגנטית וחוויה מקצועית
              יוצאת דופן.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/jobs">
                <Button size="lg" className="text-sm md:text-base px-7">
                  לכל המשרות הפתוחות
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                משרות במלון ממילא, דוד סיטדל ועוד.
              </span>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[var(--color-border)] bg-gradient-to-br from-[#1F2A44] via-[#2C2A7A] to-[#4F63A6] flex items-end">
              <div className="w-full p-6 md:p-7 flex flex-col gap-2 bg-gradient-to-t from-black/35 via-black/15 to-transparent text-white">
                <p className="text-xs tracking-[0.18em] uppercase">
                  ALROV HOTELS CAREERS
                </p>
                <p className="text-sm md:text-base font-medium">
                  מסעות קריירה בבתי המלון המובילים בירושלים.
                </p>
                <p className="text-[0.72rem] md:text-xs opacity-80">
                  תצוגת אווירה בלבד – תמונה להמחשה, ללא קשר לנכס ספציפי.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* “Why Alrov” Section */}
      <section className="py-18 md:py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr,1.1fr] gap-12 md:gap-16 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[var(--color-text-primary)]">
              בית לקריירה במלונאות יוקרה.
            </h2>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
              בקבוצת מלונות אלרוב תמצאו שילוב בין סטנדרט בינלאומי, אווירה
              ירושלמית ייחודית ופיתוח אישי ומקצועי. אנו מחפשים אנשים עם תשוקה
              לאירוח, שירות ודיוק בפרטים הקטנים.
            </p>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              הדגש הוא על חוויית אורח, עבודת צוות מוקפדת וסביבת עבודה יציבה
              ומקשיבה. לכל משרה מוגדר מסלול קליטה מסודר, ליווי מנהלים והזדמנויות
              צמיחה בין המלונות והמחלקות.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] px-5 py-6 flex flex-col gap-2">
              <p className="text-xs tracking-[0.22em] text-[var(--color-text-tertiary)]">
                מצוינות
              </p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                סטנדרט שירות בינלאומי, עם הכשרה וליווי צמוד.
              </p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] px-5 py-6 flex flex-col gap-2">
              <p className="text-xs tracking-[0.22em] text-[var(--color-text-tertiary)]">
                אנשים
              </p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                צוותים אינטימיים, מנהלים נגישים, תרבות של שיתוף ואמון.
              </p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] px-5 py-6 flex flex-col gap-2">
              <p className="text-xs tracking-[0.22em] text-[var(--color-text-tertiary)]">
                תגמול
              </p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                שכר מתגמל, תנאים מועדפים ואיזון חכם בין עבודה לחיים.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">
                  משרות נבחרות
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  טעימה משלל התפקידים הפתוחים כעת במלונות הקבוצה.
                </p>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" className="text-[var(--color-accent)]">
                  לצפייה בכל המשרות
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-18 md:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            לא מצאתם משרה מדויקת?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 text-sm md:text-base">
            שלחו לנו קורות חיים ונשמח לחזור אליכם כאשר תיפתח משרה מתאימה
            בפרופיל שלכם.
          </p>
          <a href="mailto:hr@alrov.co.il">
            <Button variant="secondary" size="lg">
              שלחו קורות חיים למאגר
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
