import {useBudget} from './use-budget';import {weeklyReports} from '@/services/report-service';export function useReports(){const {data}=useBudget();return data?weeklyReports(data):[];}
