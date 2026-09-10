import {z} from 'zod';
export const operationSchema=z.object({id:z.string().uuid(),userId:z.string().min(1).max(200),path:z.string().max(150),method:z.enum(['POST','PATCH','DELETE']),body:z.record(z.unknown()),occurredAt:z.string().datetime(),before:z.record(z.unknown()).optional()});
