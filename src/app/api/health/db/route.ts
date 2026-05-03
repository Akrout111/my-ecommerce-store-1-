import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const start = Date.now();

  try {
    // Simple query to test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - start;

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      responseTime,
    });
  } catch (error: unknown) {
    const responseTime = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Database connection failed';

    console.error('[Health Check] Database unavailable:', { message, responseTime });

    return NextResponse.json(
      {
        status: 'error',
        database: 'unavailable',
        error: message,
        responseTime,
      },
      { status: 503 },
    );
  }
}
