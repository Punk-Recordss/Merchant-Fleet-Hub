'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import { redirect } from 'next/navigation';

export async function createSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();

    const isDev = process.env.NODE_ENV === 'development';
    const domain = isDev ? 'localhost' : '.punkrecords.dev';

    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: !isDev,
      path: '/',
      domain,
      sameSite: 'lax',
    });
  } catch (error) {
    console.error('Session creation failed:', error);
    return { error: 'Authentication failed' };
  }

  redirect('/');
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
