// app/api/admin/site-settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' },
      select: {
        id: true,
        logoText: true,
        createdAt: true,
        updatedAt: true,
        logoMimeType: true,
        // Don't include logoImage to avoid sending large binary data
      },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'site-settings',
          logoText: 'MyApp',
        },
      });
    }

    // Check if there's a logo image
    const hasLogo = settings.logoMimeType !== null;

    return NextResponse.json({
      ...settings,
      hasLogo,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// UPDATE site settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // If we're removing the logo image
    if (data.removeLogoImage) {
      const settings = await prisma.siteSettings.upsert({
        where: { id: 'site-settings' },
        update: {
          logoText: data.logoText,
          logoImage: null,
          logoMimeType: null,
        },
        create: {
          id: 'site-settings',
          logoText: data.logoText,
        },
      });

      // Return settings without the binary data
      return NextResponse.json({
        id: settings.id,
        logoText: settings.logoText,
        hasLogo: false,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      });
    }

    // For text-only updates (no image changes)
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'site-settings' },
      update: {
        logoText: data.logoText,
      },
      create: {
        id: 'site-settings',
        logoText: data.logoText,
      },
    });

    // Return settings without the binary data
    return NextResponse.json({
      id: settings.id,
      logoText: settings.logoText,
      hasLogo: settings.logoImage !== null,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
