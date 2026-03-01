import { db } from '@/lib/db';
import { type EmailAdapter, type EmailPayload } from './types';

export class MockEmailAdapter implements EmailAdapter {
  async send(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
    console.log('──────────────────────────────────────');
    console.log(`📧 Mock Email Sent`);
    console.log(`   To: ${payload.to}`);
    console.log(`   Subject: ${payload.subject}`);
    console.log(`   Type: ${payload.type}`);
    console.log(`   Body preview: ${payload.body.substring(0, 100)}...`);
    console.log('──────────────────────────────────────');

    try {
      const record = await db.emailDelivery.create({
        data: {
          to: payload.to,
          subject: payload.subject,
          body: payload.body,
          type: payload.type,
          status: 'SENT',
          applicationId: payload.metadata?.applicationId || null,
          jobId: payload.metadata?.jobId || null,
          sentAt: new Date(),
        },
      });
      return { success: true, id: record.id };
    } catch (error) {
      console.error('Failed to store email delivery record:', error);
      return { success: true };
    }
  }
}
