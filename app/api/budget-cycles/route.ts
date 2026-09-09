import { api } from '@/lib/auth/api';
import { getBudget, receiveAllowance } from '@/services/budget-service';
export const GET = api(async (_r, u) => getBudget(u.userId));
export const POST = api(async (_r, u) => receiveAllowance(u.userId));
