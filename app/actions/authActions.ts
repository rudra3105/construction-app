import { prisma } from '../../lib/prisma';
import { hashPassword, verifyPassword, setLoginCookie } from '../../lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  'use server';
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString() || '';

  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const valid = await verifyPassword(password, user.password);
  if (!valid) return;

  setLoginCookie(user.id, user.role);
  redirect('/dashboard');
}

export async function registerAction(formData: FormData) {
  'use server';
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString() || '';
  const role = formData.get('role')?.toString() === 'ADMIN' ? 'ADMIN' : 'SUPERVISOR';

  if (!name || !email) return;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role } });
  setLoginCookie(user.id, user.role);
  redirect('/dashboard');
}

export async function logoutAction() {
  'use server';
  const { clearLoginCookie } = await import('../../lib/auth');
  clearLoginCookie();
  redirect('/login');
}
