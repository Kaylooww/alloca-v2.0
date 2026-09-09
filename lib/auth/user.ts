import {redirect} from 'next/navigation';import {authClient} from './server';import {authConfigured} from './config';
export type AppUser={userId:string;email:string;displayName:string;fullName:string|null};
export async function getUser():Promise<AppUser|null>{if(!authConfigured())return null;const client=await authClient();const {data:{user},error}=await client.auth.getUser();if(error||!user?.email||!user.email_confirmed_at)return null;const fullName=typeof user.user_metadata?.name==='string'?user.user_metadata.name:null;return {userId:user.id,email:user.email,fullName,displayName:fullName||user.email};}
export async function requireUser(){const user=await getUser();if(!user)redirect('/login');return user;}
