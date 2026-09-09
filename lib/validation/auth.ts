import {z} from 'zod';
export const email=z.string().trim().toLowerCase().email().max(254);
export const password=z.string().min(12,'Use at least 12 characters.').max(128);
export const registerSchema=z.object({email,password,name:z.string().trim().min(1).max(60)});
export const loginSchema=z.object({email,password:z.string().min(1).max(128)});
export const emailSchema=z.object({email});
export const verifySchema=z.object({email,token:z.string().trim().regex(/^\d{6,10}$/,'Enter the verification code from your email.'),type:z.enum(['signup','recovery']).default('signup')});
