'use server';

import { ExpenseCategory, LPOStatus, PaymentMethod } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';

export async function createIncome(formData: FormData) {
  'use server';
  const amount = Number(formData.get('amount') || 0);
  const date = formData.get('date')?.toString();
  const siteId = formData.get('siteId')?.toString() || null;
  const source = formData.get('source')?.toString().trim() || '';
  const paymentMethod = (formData.get('paymentMethod')?.toString() || 'CASH') as PaymentMethod;
  const reference = formData.get('reference')?.toString().trim() || '';
  const notes = formData.get('notes')?.toString().trim() || '';

  if (amount <= 0 || !date) return;

  await prisma.income.create({
    data: {
      amount,
      date: new Date(date),
      siteId: siteId || null,
      source,
      paymentMethod,
      reference,
      notes
    }
  });
  redirect('/dashboard/accounting/income');
}

export async function createExpense(formData: FormData) {
  'use server';
  const amount = Number(formData.get('amount') || 0);
  const date = formData.get('date')?.toString();
  const category = (formData.get('category')?.toString() || 'MATERIAL') as ExpenseCategory;
  const siteId = formData.get('siteId')?.toString() || null;
  const paymentMethod = (formData.get('paymentMethod')?.toString() || 'CASH') as PaymentMethod;
  const notes = formData.get('notes')?.toString().trim() || '';

  if (amount <= 0 || !date) return;

  await prisma.expense.create({
    data: {
      amount,
      date: new Date(date),
      category,
      siteId: siteId || null,
      paymentMethod,
      notes
    }
  });
  redirect('/dashboard/accounting/expense');
}

export async function createLpo(formData: FormData) {
  'use server';
  const vendorName = formData.get('vendorName')?.toString().trim() || '';
  const siteId = formData.get('siteId')?.toString() || null;
  const date = formData.get('date')?.toString();
  const status = (formData.get('status')?.toString() || 'PENDING') as LPOStatus;
  const notes = formData.get('notes')?.toString().trim() || '';

  const itemNames = formData.getAll('itemName') as string[];
  const itemQuantities = formData.getAll('itemQuantity') as string[];
  const itemRates = formData.getAll('itemRate') as string[];

  if (!vendorName || !date) return;

  const lpoNumber = `LPO-${Date.now()}`;

  const lpo = await prisma.lPO.create({
    data: {
      number: lpoNumber,
      vendorName,
      siteId: siteId || null,
      date: new Date(date),
      status,
      notes,
      items: {
        create: itemNames
          .map((name, index) => {
            const quantity = Number(itemQuantities[index] || 0);
            const rate = Number(itemRates[index] || 0);
            if (!name || quantity <= 0 || rate <= 0) return null;
            return {
              materialName: name,
              quantity,
              rate,
              total: quantity * rate
            };
          })
          .filter(Boolean) as Array<{ materialName: string; quantity: number; rate: number; total: number }>
      }
    }
  });

  redirect(`/dashboard/accounting/lpo`);
}

export async function updateLpoStatus(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  const status = (formData.get('status')?.toString() || 'PENDING') as LPOStatus;
  if (!id) return;

  await prisma.lPO.update({
    where: { id },
    data: { status }
  });
  redirect('/dashboard/accounting/lpo');
}

export async function deleteLpo(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.lPO.delete({ where: { id } });
  redirect('/dashboard/accounting/lpo');
}
