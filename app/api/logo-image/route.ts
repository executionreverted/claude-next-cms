// app/api/logo-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' },
      select: { logoImage: true, logoMimeType: true },
    });

    if (!settings?.logoImage || !settings?.logoMimeType) {
      return new NextResponse(null, { status: 404 });
    }

    // Return the image with the correct content type
    return new NextResponse(settings.logoImage, {
      headers: {
        'Content-Type': settings.logoMimeType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching logo image:', error);
    return new NextResponse(null, { status: 500 });
  }
}
