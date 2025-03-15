import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function roleMiddleware(
  req: NextRequest,
  requiredRole: 'ADMIN' | 'USER' = 'USER'
) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token means not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check if user has required role
  if (requiredRole === 'ADMIN' && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
