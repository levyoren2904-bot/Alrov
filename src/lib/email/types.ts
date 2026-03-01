export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  type: 'APPLICATION_CONFIRMATION' | 'RECRUITER_NOTIFICATION' | 'STATUS_UPDATE' | 'GENERAL';
  metadata?: {
    applicationId?: string;
    jobId?: string;
  };
}

export interface EmailAdapter {
  send(payload: EmailPayload): Promise<{ success: boolean; id?: string }>;
}
