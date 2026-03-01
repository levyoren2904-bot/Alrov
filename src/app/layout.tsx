import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import { Toaster } from '@/components/ui/Toast';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'דרושים | קבוצת מלונות אלרוב',
    template: '%s | קבוצת מלונות אלרוב',
  },
  description: 'הצטרפו לצוות של קבוצת מלונות אלרוב – משרות פנויות במלונות היוקרה המובילים בישראל.',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'קבוצת מלונות אלרוב – דרושים',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} antialiased bg-[var(--color-bg)] text-[var(--color-text-primary)]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
