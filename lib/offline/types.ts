import type {BudgetData} from '@/types';
export type Operation={id:string;userId:string;path:string;method:'POST'|'PATCH'|'DELETE';body:Record<string,unknown>;occurredAt:string;before?:Record<string,unknown>};
export type OfflineRecord={version:1;userId:string;base:BudgetData;queue:Operation[];updatedAt:string;conflict?:string;draft?:BudgetData};
export type OfflineStatus={online:boolean;pending:number;syncing:boolean;message:string;ready:boolean;needsLogin:boolean};
