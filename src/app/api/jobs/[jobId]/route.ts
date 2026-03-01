import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  const job = await db.job.findUnique({
    where: { id: jobId, status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      screeningQuestions: true,
      hotel: { select: { name: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}
