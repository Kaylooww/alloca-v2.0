import { api, HttpError } from '@/lib/auth/api';
import { getBudget } from '@/services/budget-service';
import { weeklyReports, categoryReport } from '@/services/report-service';
export const GET = api(async (_r, u) => { const d = await getBudget(u.userId); if ('needsSetup' in d)
    throw new HttpError(409, 'Set up your profile first.'); return { weeks: weeklyReports(d), categories: categoryReport(d) }; });
