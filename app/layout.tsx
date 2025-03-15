import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js App with Authentication',
  description: 'A Next.js application with Prisma and authentication',
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize app and seed database on startup

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
