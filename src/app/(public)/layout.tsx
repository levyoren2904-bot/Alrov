import Link from 'next/link';
import { Hotel } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-20 px-6 md:px-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-white">
                <Hotel className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm tracking-[0.18em] text-[var(--color-text-tertiary)]">
                  ALROV HOTELS
                </span>
                <span className="text-base md:text-lg font-semibold text-[var(--color-text-primary)]">
                  קריירה במלונות אלרוב
                </span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-xs tracking-[0.22em] text-[var(--color-text-secondary)]">
            <Link
              href="/"
              className="hover:text-[var(--color-text-primary)] transition-colors"
            >
              דף הבית
            </Link>
            <Link
              href="/jobs"
              className="hover:text-[var(--color-text-primary)] transition-colors"
            >
              משרות פתוחות
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[var(--color-text-primary)] transition-colors"
            >
              מדיניות פרטיות
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="text-white mt-16" style={{ backgroundColor: '#2C2A7A' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hotel className="h-5 w-5 text-white" />
                <span className="font-semibold">אלרוב נכסים ומלונאות</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                מלונאות יוקרה בסטנדרט בינלאומי.
                <br />
                מחויבים למצוינות בכל פרט.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">קישורים</h4>
              <div className="flex flex-col gap-2">
                <Link href="/jobs" className="text-sm text-white/70 hover:text-white transition-colors">
                  משרות פתוחות
                </Link>
                <Link href="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">
                  מדיניות פרטיות
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">יצירת קשר</h4>
              <p className="text-sm text-white/70" dir="ltr">
                hr@alrov.co.il
              </p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/15">
            <p className="text-xs text-white/50 text-center">
              © {new Date().getFullYear()} אלרוב נכסים ומלונאות. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
