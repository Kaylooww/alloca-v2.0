import {api} from '@/lib/auth/api';import {syncOperation} from '@/services/sync-service';export const POST=api(async(request,user)=>syncOperation(await request.json(),user.userId));
