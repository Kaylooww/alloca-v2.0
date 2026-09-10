import {AsyncLocalStorage} from 'node:async_hooks';
const context=new AsyncLocalStorage<{id:string;occurredAt:string}>();
export function withOperation<T>(value:{id:string;occurredAt:string},fn:()=>Promise<T>){return context.run(value,fn)}
export const operationDate=()=>new Date(context.getStore()?.occurredAt||Date.now());
export const operationId=()=>context.getStore()?.id||crypto.randomUUID();
