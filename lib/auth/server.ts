import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authConfig } from './config';
export async function authClient(){const {url,key}=authConfig();const jar=await cookies();return createServerClient(url,key,{cookies:{getAll(){return jar.getAll()},setAll(values){try{values.forEach(({name,value,options})=>jar.set(name,value,options))}catch{/* Server Components cannot write cookies; proxy refreshes sessions. */}}}});}
