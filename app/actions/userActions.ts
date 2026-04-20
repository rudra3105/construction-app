import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../lib/auth';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  'use server';
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString() || '';
  const role = formData.get('role')?.toString() === 'ADMIN' ? 'ADMIN' : 'SUPERVISOR';

  if (!name || !email || !password) return;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const hashedPassword = await hashPassword(password);
  await prisma.user.create({ data: { name, email, password: hashedPassword, role } });
  redirect('/dashboard/users');
}

export async function updateUser(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString() || '';
  const role = formData.get('role')?.toString() === 'ADMIN' ? 'ADMIN' : 'SUPERVISOR';

  if (!id || !name || !email) return;

  const data: any = { name, email, role };
  if (password) {
    data.password = await hashPassword(password);
  }

  await prisma.user.update({ where: { id }, data });
  redirect('/dashboard/users');
}

export async function deleteUser(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.user.delete({ where: { id } });
  redirect('/dashboard/users');
}
