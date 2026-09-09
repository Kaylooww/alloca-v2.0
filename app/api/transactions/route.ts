import { api } from '@/lib/auth/api';
import { addTransaction, deleteExpense, editExpense } from '@/services/transaction-service';
export const POST = api(async (r, u) => addTransaction(u.userId, await r.json()));
export const DELETE = api(async (r, u) => deleteExpense(u.userId, new URL(r.url).searchParams.get('id') ?? ''));
export const PATCH = api(async (r, u) => editExpense(u.userId, new URL(r.url).searchParams.get('id') ?? '', await r.json()));
