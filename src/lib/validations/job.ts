import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(2, 'נא להזין כותרת'),
  slug: z.string().min(2, 'נא להזין slug'),
  hotelId: z.string().min(1, 'נא לבחור מלון'),
  departmentId: z.string().min(1, 'נא לבחור מחלקה'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP']),
  city: z.string().min(1, 'נא להזין עיר'),
  description: z.string().min(10, 'נא להזין תיאור'),
  responsibilities: z.string().min(10, 'נא להזין תחומי אחריות'),
  requirements: z.string().min(10, 'נא להזין דרישות'),
  benefits: z.string().default(''),
  screeningQuestions: z.array(z.object({
    question: z.string(),
    required: z.boolean().default(false),
    type: z.enum(['text', 'textarea', 'select']).default('text'),
    options: z.array(z.string()).optional(),
  })).default([]),
  recipientEmails: z.array(z.string().email()).default([]),
  recruiterId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('DRAFT'),
});

export type JobInput = z.infer<typeof jobSchema>;
