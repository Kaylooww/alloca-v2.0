import {authEndpoint} from '@/lib/auth/endpoint';import {verifySchema} from '@/lib/validation/auth';
export const POST=authEndpoint(async(r,c)=>{const value=verifySchema.parse(await r.json());const {error}=await c.auth.verifyOtp(value);if(error)return {error:'This code is invalid or expired. Request a new code and try again.'};return {ok:true};});
