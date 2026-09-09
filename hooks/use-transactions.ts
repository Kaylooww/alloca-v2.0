import {useBudget} from './use-budget';export function useTransactions(){return useBudget().data?.transactions??[];}
