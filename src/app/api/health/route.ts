import { NextResponse } from 'next/server';

/**
 * GET /api/health – quick check without DB.
 * Use: https://alrov.vercel.app/api/health
 * If this returns 200, the app is running. If DB fails, homepage still loads with empty jobs.
 */
export async function GET() {
  const hasDb = !!process.env.DATABASE_URL;
  const hasAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const hasAuthUrl = !!process.env.NEXTAUTH_URL;

  return NextResponse.json({
    ok: true,
    env: {
      DATABASE_URL: hasDb ? 'set' : 'missing',
      NEXTAUTH_SECRET: hasAuthSecret ? 'set' : 'missing',
      NEXTAUTH_URL: hasAuthUrl ? process.env.NEXTAUTH_URL : 'missing',
    },
  });
}
