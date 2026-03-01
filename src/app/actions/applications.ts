'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getStorage } from '@/lib/storage';
import { getEmailAdapter } from '@/lib/email';
import { applicationConfirmationEmail, recruiterNotificationEmail } from '@/lib/email/templates';
import { requireRole, canAccessApplication } from '@/lib/auth/guards';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/validations/application';

export async function submitApplication(formData: FormData) {
  try {
    const jobId = formData.get('jobId') as string;
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const city = (formData.get('city') as string) || '';
    const linkedinUrl = (formData.get('linkedinUrl') as string) || '';
    const privacyConsent = formData.get('privacyConsent') === 'true';
    const screeningAnswersRaw = formData.get('screeningAnswers') as string;
    const cvFile = formData.get('cv') as File;

    if (!jobId || !fullName || !email || !phone || !privacyConsent) {
      return { error: 'נא למלא את כל השדות הנדרשים' };
    }

    if (!cvFile || cvFile.size === 0) {
      return { error: 'נא להעלות קובץ קורות חיים' };
    }

    if (cvFile.size > MAX_FILE_SIZE) {
      return { error: 'גודל הקובץ חורג מ-10MB' };
    }

    if (!ALLOWED_FILE_TYPES.includes(cvFile.type)) {
      return { error: 'סוג קובץ לא נתמך. נא להעלות PDF, DOC או DOCX' };
    }

    const job = await db.job.findUnique({
      where: { id: jobId, status: 'PUBLISHED' },
      include: { hotel: true },
    });

    if (!job) {
      return { error: 'המשרה לא נמצאה או שאינה פעילה' };
    }

    const storage = getStorage();
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const cvPath = await storage.upload(buffer, cvFile.name, cvFile.type);

    let screeningAnswers: { question: string; answer: string }[] = [];
    try {
      if (screeningAnswersRaw) {
        screeningAnswers = JSON.parse(screeningAnswersRaw);
      }
    } catch {
      // ignore parse errors
    }

    const application = await db.application.create({
      data: {
        jobId,
        fullName,
        email,
        phone,
        city,
        linkedinUrl,
        cvPath,
        cvOriginalName: cvFile.name,
        screeningAnswers,
        privacyConsent,
        status: 'NEW',
      },
    });

    await db.applicationEvent.create({
      data: {
        applicationId: application.id,
        type: 'APPLICATION_SUBMITTED',
        metadata: { source: 'web' },
      },
    });

    const emailAdapter = getEmailAdapter();

    const confirmation = applicationConfirmationEmail(fullName, job.title);
    await emailAdapter.send({
      to: email,
      subject: confirmation.subject,
      body: confirmation.body,
      type: 'APPLICATION_CONFIRMATION',
      metadata: { applicationId: application.id, jobId: job.id },
    });

    const recipientEmails = (job.recipientEmails as string[]) || [];
    for (const recipientEmail of recipientEmails) {
      const notification = recruiterNotificationEmail(fullName, email, job.title, job.hotel.name);
      await emailAdapter.send({
        to: recipientEmail,
        subject: notification.subject,
        body: notification.body,
        type: 'RECRUITER_NOTIFICATION',
        metadata: { applicationId: application.id, jobId: job.id },
      });
    }

    return { success: true, applicationId: application.id };
  } catch (error) {
    console.error('Application submission error:', error);
    return { error: 'אירעה שגיאה בשליחת הטופס. נא לנסות שנית.' };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  const session = await auth();
  requireRole(session, 'ADMIN', 'HR_MANAGER', 'RECRUITER');

  if (session && !(await canAccessApplication(session, applicationId))) {
    return { error: 'אין הרשאה' };
  }

  const application = await db.application.update({
    where: { id: applicationId },
    data: { status: status as never },
  });

  await db.applicationEvent.create({
    data: {
      applicationId,
      userId: session!.user.id,
      type: 'STATUS_CHANGED',
      metadata: { newStatus: status },
    },
  });

  return { success: true, application };
}

export async function addApplicationNote(
  applicationId: string,
  content: string
) {
  const session = await auth();
  requireRole(session, 'ADMIN', 'HR_MANAGER', 'RECRUITER');

  if (session && !(await canAccessApplication(session, applicationId))) {
    return { error: 'אין הרשאה' };
  }

  const note = await db.applicationNote.create({
    data: {
      applicationId,
      userId: session!.user.id,
      content,
    },
  });

  await db.applicationEvent.create({
    data: {
      applicationId,
      userId: session!.user.id,
      type: 'NOTE_ADDED',
      metadata: { noteId: note.id },
    },
  });

  return { success: true, note };
}
