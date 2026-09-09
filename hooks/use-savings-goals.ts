import {useBudget} from './use-budget';export function useSavingsGoals(){return useBudget().data?.goals??[];}
