import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'construction_session';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function setLoginCookie(userId: string, role: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: `${userId}|${role}`,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
}

export function clearLoginCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0
  });
}

export function getCurrentUser() {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  const [id, role] = cookie.split('|');
  if (!id || !role) return null;
  return { id, role };
}

export function requireUser() {
  const user = getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');
  return user;
}
