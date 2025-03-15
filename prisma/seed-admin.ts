import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function seedAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword) {
      console.log('Admin credentials not found in environment variables, skipping admin seed');
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists, skipping seed');
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName || 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
        profile: {
          create: {
            bio: 'System administrator'
          }
        }
      }
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}
