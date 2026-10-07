import {db,rows} from '@/lib/database/client';
import {HttpError} from '@/lib/auth/api';
import {withOperation,operationDate} from '@/lib/offline/operation-context';
import {operationSchema} from '@/lib/offline/schema';
import {profileSchema,categorySchema,goalSchema} from '@/lib/validation/schemas';
import {addTransaction,editExpense,deleteExpense} from './transaction-service';
import {getBudget,receiveAllowance,currentCycle} from './budget-service';
import {totals} from '@/lib/calculations/budget';
import type {Cycle,Transaction} from '@/types';
import type {Operation} from '@/lib/offline/types';
export async function reflowCycles(userId:string){await db().prepare("UPDATE cycles SET carry=COALESCE((SELECT SUM(CASE WHEN t.kind IN ('income','allowance','withdrawal') THEN t.amount ELSE -t.amount END) FROM transactions t JOIN cycles earlier ON earlier.id=t.cycle_id WHERE t.user_id=? AND earlier.start<cycles.start),0) WHERE user_id=?").bind(userId,userId).run();}
async function checkBefore(op:Operation,table:string,id:string,keys:string[]){const actual=(await rows<Record<string,unknown>>(`SELECT * FROM ${table} WHERE id=? AND ${table==='profiles'?'id':'user_id'}=?`,id,op.userId))[0];if(!actual)throw new HttpError(409,'This record was removed on another device.');if(!op.before||keys.some(key=>op.before?.[key]!==actual[key]))throw new HttpError(409,'This record changed on another device. Review your pending changes before syncing.');}
/** Called within api()'s atomic write transaction. The receipt commits with the money change. */
export async function syncOperation(input:unknown,userId:string){const op=operationSchema.parse(input);if(op.userId!==userId)throw new HttpError(403,'Sign in with the account that created these offline changes.');const payload=JSON.stringify(op);const receipt=(await rows<{payload:string}>('SELECT payload FROM sync_operations WHERE user_id=? AND id=?',userId,op.id))[0];if(receipt){if(receipt.payload!==payload)throw new HttpError(409,'This change ID has already been used.');return {ack:op.id,data:await getBudget(userId)}}
if(new Date(op.occurredAt).getTime()>Date.now()+5*60000)throw new HttpError(400,'Your device clock is ahead. Correct its time before syncing.');
const profile=(await rows<{created:string}>('SELECT created FROM profiles WHERE id=?',userId))[0];if(!profile)throw new HttpError(409,'Finish online account setup first.');if(new Date(op.occurredAt).getTime()<new Date(profile.created).getTime()-60000)throw new HttpError(400,'This change predates your account.');
const url=new URL(op.path,'https://alloca.invalid/');const path=url.pathname.replace(/^\//,'');const id=url.searchParams.get('id')||'';
await withOperation(op,async()=>{
 if(path==='transactions'){
  if(op.method==='POST')await addTransaction(userId,op.body);
  else if(op.method==='PATCH'){await checkBefore(op,'transactions',id,['amount','category','note']);await editExpense(userId,id,op.body)}
  else{await checkBefore(op,'transactions',id,['amount','category','note']);await deleteExpense(userId,id)}
 }else if(path==='budget-cycles'&&op.method==='POST')await receiveAllowance(userId);
 else if(path==='savings-goals'&&op.method==='POST'){const goal=goalSchema.parse(op.body);await db().prepare('INSERT INTO goals(id,user_id,name,target,due,created) VALUES(?,?,?,?,?,?)').bind(op.id,userId,goal.name,goal.target,goal.due||null,operationDate().toISOString()).run()}
 else if(path==='categories'&&op.method==='POST'){const c=categorySchema.parse(op.body);if((await rows('SELECT id FROM categories WHERE user_id=? AND lower(name)=lower(?)',userId,c.name)).length)throw new HttpError(409,'A category with this name already exists on another device.');await db().prepare('INSERT INTO categories(id,user_id,name,color) VALUES(?,?,?,?)').bind(op.id,userId,c.name,c.color).run()}
 else if(path==='categories'&&op.method==='PATCH'){await checkBefore(op,'categories',id,['archived']);if(op.body.archived!==0&&op.body.archived!==1)throw new HttpError(400,'Invalid category state.');await db().prepare('UPDATE categories SET archived=? WHERE id=? AND user_id=?').bind(op.body.archived,id,userId).run()}
 else if(path==='profile'&&op.method==='POST'){const active=await currentCycle(userId);await checkBefore(op,'profiles',userId,op.before?.frequency===undefined?['name','allowance']:['name','allowance','frequency']);const p=profileSchema.parse(op.body);await db().prepare('UPDATE profiles SET name=?,allowance=?,frequency=COALESCE(?,frequency) WHERE id=?').bind(p.name,p.allowance,op.body.frequency===undefined?null:p.frequency,userId).run();if(op.body.frequency!==undefined)await db().prepare('DELETE FROM cycles WHERE user_id=? AND start>=? AND NOT EXISTS(SELECT 1 FROM transactions WHERE cycle_id=cycles.id)').bind(userId,active.end).run()}
 else throw new HttpError(400,'Unsupported offline change.');
});
await reflowCycles(userId);
await db().prepare('INSERT INTO sync_operations(id,user_id,payload,applied_at) VALUES(?,?,?,?)').bind(op.id,userId,payload,new Date().toISOString()).run();
return {ack:op.id,data:await getBudget(userId)};
}
