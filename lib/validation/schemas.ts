import { z } from 'zod';
export const amount = z.coerce.number().finite().positive().max(1000000).refine(n => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001, 'Use at most two decimal places').transform(n => Math.round(n * 100));
export const profileSchema = z.object({ name: z.string().trim().min(1).max(60), allowance: amount });
export const transactionSchema = z.object({ kind: z.enum(['expense', 'income', 'saving', 'withdrawal']), amount, category: z.string().trim().min(1).max(50), note: z.string().trim().max(160).default(''), goalId: z.string().optional() });
export const categorySchema = z.object({ name: z.string().trim().min(1).max(40), color: z.enum(['#087f72', '#f4a65b', '#6d81d5', '#cb78a0', '#55a9b8', '#8e9a58']) });
export const goalSchema = z.object({ name: z.string().trim().min(1).max(60), target: amount, due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')) });
