import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'הרגע';
  if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return formatDate(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const employmentTypeLabels: Record<string, string> = {
  FULL_TIME: 'משרה מלאה',
  PART_TIME: 'משרה חלקית',
  CONTRACT: 'חוזה',
  TEMPORARY: 'זמני',
  INTERNSHIP: 'התמחות',
};

export const applicationStatusLabels: Record<string, string> = {
  NEW: 'חדש',
  IN_REVIEW: 'בבדיקה',
  PHONE_SCREEN: 'שיחת סינון',
  INTERVIEW_SCHEDULED: 'ראיון נקבע',
  INTERVIEWED: 'רואיין',
  OFFER_SENT: 'הצעה נשלחה',
  HIRED: 'התקבל',
  REJECTED: 'נדחה',
  WITHDRAWN: 'נסוג',
  ARCHIVED: 'בארכיון',
};

export const jobStatusLabels: Record<string, string> = {
  DRAFT: 'טיוטה',
  PUBLISHED: 'פורסם',
  CLOSED: 'סגור',
};
