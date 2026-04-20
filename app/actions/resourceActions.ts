'use server';

import { prisma } from '../../lib/prisma';
import { formatDate } from '../../lib/utils';
import type { SiteStatus } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function createSite(formData: FormData) {
  'use server';
  const name = formData.get('name')?.toString().trim();
  const location = formData.get('location')?.toString().trim();
  const startDate = formData.get('startDate')?.toString();
  const status = (formData.get('status')?.toString() || 'PLANNED') as SiteStatus;
  const supervisorId = formData.get('supervisorId')?.toString() || undefined;

  if (!name || !location || !startDate) return;

  await prisma.site.create({
    data: {
      name,
      location,
      startDate: new Date(startDate),
      status,
      supervisorId: supervisorId || null
    }
  });
  redirect('/dashboard/sites');
}

export async function deleteSite(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.site.delete({ where: { id } });
  redirect('/dashboard/sites');
}

export async function createWorkLog(formData: FormData) {
  'use server';
  const siteId = formData.get('siteId')?.toString();
  const date = formData.get('date')?.toString();
  const workType = formData.get('workType')?.toString().trim();
  const unit = formData.get('unit')?.toString().trim();
  const quantity = Number(formData.get('quantity') || 0);
  const description = formData.get('description')?.toString().trim() || '';
  const progress = Number(formData.get('progress') || 0);
  const imageFile = formData.get('image');

  let image: string | undefined;
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await imageFile.arrayBuffer().then((buffer) => {
      const base64 = Buffer.from(buffer).toString('base64');
      return `data:${imageFile.type};base64,${base64}`;
    });
  }

  if (!siteId || !date || !workType || !unit || quantity <= 0) return;

  await prisma.workLog.create({
    data: {
      siteId,
      date: new Date(date),
      workType,
      unit,
      quantity,
      description,
      progress,
      image
    }
  });
  redirect('/dashboard/work-logs');
}

export async function createMaterial(formData: FormData) {
  'use server';
  const name = formData.get('name')?.toString().trim();
  const unit = formData.get('unit')?.toString().trim();
  if (!name || !unit) return;
  await prisma.material.create({ data: { name, unit } });
  redirect('/dashboard/materials');
}

export async function createMaterialLog(formData: FormData) {
  'use server';
  const siteId = formData.get('siteId')?.toString();
  const materialId = formData.get('materialId')?.toString();
  const date = formData.get('date')?.toString();
  const purchasedQuantity = Number(formData.get('purchasedQuantity') || 0);
  const usedQuantity = Number(formData.get('usedQuantity') || 0);
  const notes = formData.get('notes')?.toString().trim() || '';

  if (!siteId || !materialId || !date) return;
  await prisma.materialLog.create({
    data: {
      siteId,
      materialId,
      date: new Date(date),
      purchasedQuantity,
      usedQuantity,
      notes
    }
  });
  redirect('/dashboard/materials');
}

export async function createIdealRule(formData: FormData) {
  'use server';
  const workType = formData.get('workType')?.toString().trim();
  const unit = formData.get('unit')?.toString().trim();
  const materialId = formData.get('materialId')?.toString();
  const unitQuantity = Number(formData.get('unitQuantity') || 0);
  const idealQuantity = Number(formData.get('idealQuantity') || 0);

  if (!workType || !unit || !materialId || unitQuantity <= 0 || idealQuantity <= 0) return;

  await prisma.idealRule.create({
    data: {
      workType,
      unit,
      materialId,
      unitQuantity,
      idealQuantity
    }
  });
  redirect('/dashboard/ideal-rules');
}

export async function deleteIdealRule(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.idealRule.delete({ where: { id } });
  redirect('/dashboard/ideal-rules');
}

export async function createLabour(formData: FormData) {
  'use server';
  const name = formData.get('name')?.toString().trim();
  const role = formData.get('role')?.toString().trim();
  const dailyWage = Number(formData.get('dailyWage') || 0);
  const siteId = formData.get('siteId')?.toString() || undefined;

  if (!name || !role || dailyWage <= 0) return;

  await prisma.labour.create({
    data: {
      name,
      role,
      dailyWage,
      siteId: siteId || null
    }
  });
  redirect('/dashboard/labours');
}

export async function createAttendance(formData: FormData) {
  'use server';
  const labourId = formData.get('labourId')?.toString();
  const siteId = formData.get('siteId')?.toString();
  const date = formData.get('date')?.toString();
  const present = formData.get('present')?.toString() === 'on';

  if (!labourId || !siteId || !date) return;
  await prisma.attendance.create({
    data: {
      labourId,
      siteId,
      date: new Date(date),
      present
    }
  });
  redirect('/dashboard/attendance');
}

export async function createPayroll(formData: FormData) {
  'use server';
  const labourId = formData.get('labourId')?.toString();
  const amount = Number(formData.get('amount') || 0);
  const date = formData.get('date')?.toString();
  const notes = formData.get('notes')?.toString().trim() || '';

  if (!labourId || amount <= 0 || !date) return;
  await prisma.payroll.create({
    data: {
      labourId,
      amount,
      date: new Date(date),
      notes
    }
  });
  redirect('/dashboard/payroll');
}

export async function updateSite(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const location = formData.get('location')?.toString().trim();
  const startDate = formData.get('startDate')?.toString();
  const status = (formData.get('status')?.toString() || 'PLANNED') as SiteStatus;
  const supervisorId = formData.get('supervisorId')?.toString() || null;

  if (!id || !name || !location || !startDate) return;
  await prisma.site.update({
    where: { id },
    data: {
      name,
      location,
      startDate: new Date(startDate),
      status,
      supervisorId: supervisorId || null
    }
  });
  redirect('/dashboard/sites');
}

export async function deleteMaterial(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.material.delete({ where: { id } });
  redirect('/dashboard/materials');
}

export async function deleteLabour(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.labour.delete({ where: { id } });
  redirect('/dashboard/labours');
}

export async function deletePayroll(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.payroll.delete({ where: { id } });
  redirect('/dashboard/payroll');
}

export async function deleteAttendance(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.attendance.delete({ where: { id } });
  redirect('/dashboard/attendance');
}

export async function deleteWorkLog(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.workLog.delete({ where: { id } });
  redirect('/dashboard/work-logs');
}
