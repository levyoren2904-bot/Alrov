import { z } from 'zod';

export const applicationSchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().min(2, 'נא להזין שם מלא'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  phone: z.string().min(9, 'נא להזין מספר טלפון תקין'),
  city: z.string().default(''),
  linkedinUrl: z.string().url('קישור לא תקין').or(z.literal('')).default(''),
  screeningAnswers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),
  privacyConsent: z.literal(true, {
    error: 'נא לאשר את מדיניות הפרטיות',
  }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'גודל הקובץ חורג מ-10MB';
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'סוג קובץ לא נתמך. נא להעלות PDF, DOC או DOCX';
  }
  return null;
}
