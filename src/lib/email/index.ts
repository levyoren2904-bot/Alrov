import { type EmailAdapter } from './types';
import { MockEmailAdapter } from './mock';

let emailInstance: EmailAdapter | null = null;

export function getEmailAdapter(): EmailAdapter {
  if (!emailInstance) {
    const adapter = process.env.EMAIL_ADAPTER || 'mock';
    switch (adapter) {
      case 'mock':
        emailInstance = new MockEmailAdapter();
        break;
      // Future: case 'sendgrid': emailInstance = new SendGridAdapter(); break;
      default:
        emailInstance = new MockEmailAdapter();
    }
  }
  return emailInstance;
}

export type { EmailAdapter, EmailPayload } from './types';
