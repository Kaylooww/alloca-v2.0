import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {reset} from './runtime.mjs';
import {POST as saveProfile} from '../app/api/profile/route.ts';
import {getBudget,currentCycle,receiveAllowance} from '../services/budget-service.ts';
import {syncOperation} from '../services/sync-service.ts';
import {cycleDates,totals} from '../lib/calculations/budget.ts';
import {makeOperation,applyLocal,rollCycle} from '../lib/offline/reducer.ts';
import {withOperation} from '../lib/offline/operation-context.ts';
import {db,withDatabaseTransaction} from '../lib/database/client.ts';
beforeEach(reset);
async function setup(frequency='weekly',allowance=100){
 const result=await saveProfile(new Request('https://alloca.test/api/profile',{method:'POST',headers:{origin:'https://alloca.test','content-type':'application/json'},body:JSON.stringify({name:'Alex',frequency,allowance})}));
 assert.equal(result.status,200);return getBudget('alice');
}
const at=async(date,fn)=>withOperation({id:crypto.randomUUID(),occurredAt:date.toISOString()},fn);
test('daily midnight and calendar-month boundaries follow Philippine time',()=>{
 assert.deepEqual(cycleDates(new Date('2026-10-07T16:00:00Z'),'daily'),{start:'2026-10-07T16:00:00.000Z',end:'2026-10-08T16:00:00.000Z'});
 assert.deepEqual(cycleDates(new Date('2028-02-15T00:00:00Z'),'monthly'),{start:'2028-01-31T16:00:00.000Z',end:'2028-02-29T16:00:00.000Z'});
 assert.equal(cycleDates(new Date('2026-12-31T16:00:00Z'),'monthly').end,'2027-01-31T16:00:00.000Z');
});
for(const frequency of ['daily','weekly','monthly'])test(`${frequency}: custom amount, duplicate protection, offline rollover and carryover`,async()=>{
 let d=await setup(frequency,123.45);assert.equal(d.cycle.frequency,frequency);assert.equal(d.profile.allowance,12345);
 await receiveAllowance('alice');await assert.rejects(()=>receiveAllowance('alice'),/already/);
 d=await getBudget('alice');const next=new Date(d.cycle.end);
 const local=rollCycle(structuredClone(d),next);
 const remote=await at(next,()=>currentCycle('alice'));
 assert.equal(local.cycle.start,remote.start);assert.equal(local.cycle.end,remote.end);assert.equal(remote.carry,12345);
 await at(next,()=>receiveAllowance('alice'));
 assert.equal(totals((await getBudget('alice')).transactions).income,24690);
});
test('changing schedule preserves the active cycle then adopts the new frequency',async()=>{
 let d=await setup();const old=d.cycle;
 const op=makeOperation(d,'profile','POST',{name:'Alex',allowance:50,frequency:'daily'});
 const local=applyLocal(d,op);await withDatabaseTransaction(()=>syncOperation(op,'alice'));
 const remote=await getBudget('alice');assert.equal(remote.profile.frequency,'daily');assert.equal(remote.cycle.id,old.id);assert.equal(local.cycle.end,old.end);
 const next=new Date(old.end);const rolled=rollCycle(local,next);const server=await at(next,()=>currentCycle('alice'));
 assert.equal(server.end,rolled.cycle.end);assert.equal(server.frequency,'daily');
});
test('daily-to-monthly transition never overlaps an existing cycle',async()=>{
 let d=await setup('daily');const op=makeOperation(d,'profile','POST',{name:'Alex',allowance:5000,frequency:'monthly'});
 const local=applyLocal(d,op);await withDatabaseTransaction(()=>syncOperation(op,'alice'));
 const next=new Date(d.cycle.end);const server=await at(next,()=>currentCycle('alice'));
 assert.equal(server.start,d.cycle.end);assert.equal(server.end,rollCycle(local,next).cycle.end);
});
test('concurrent schedule edits conflict and legacy offline requests preserve frequency',async()=>{
 const d=await setup('daily');const one=makeOperation(d,'profile','POST',{name:'Alex',allowance:100,frequency:'monthly'});const two=makeOperation(d,'profile','POST',{name:'Alex',allowance:100,frequency:'weekly'});
 await withDatabaseTransaction(()=>syncOperation(one,'alice'));
 await assert.rejects(()=>withDatabaseTransaction(()=>syncOperation(two,'alice')),/changed on another device/);
 const fresh=await getBudget('alice');const legacy=makeOperation(fresh,'profile','POST',{name:'Alex New',allowance:150});delete legacy.before.frequency;
 await withDatabaseTransaction(()=>syncOperation(legacy,'alice'));assert.equal((await getBudget('alice')).profile.frequency,'monthly');
});
test('invalid frequency is rejected by the API',async()=>{
 const result=await saveProfile(new Request('https://alloca.test/api/profile',{method:'POST',headers:{origin:'https://alloca.test','content-type':'application/json'},body:JSON.stringify({name:'Alex',allowance:100,frequency:'yearly'})}));assert.equal(result.status,400);
});
test('offline schedule change arriving after rollover replaces only empty provisional cycles',async()=>{
 let d=await setup('weekly');const current=d.cycle;
 const earlier=new Date(new Date(current.start).getTime()-86400000);
 const dates=cycleDates(earlier);
 await db().prepare('UPDATE profiles SET created=? WHERE id=?').bind(new Date(new Date(dates.start).getTime()-86400000).toISOString(),'alice').run();
 await db().prepare('INSERT INTO cycles(id,user_id,start,end,carry,frequency) VALUES(?,?,?,?,?,?)').bind('previous','alice',dates.start,dates.end,0,'weekly').run();
 d=await getBudget('alice');d.cycles=d.cycles.filter(c=>c.id==='previous');d.cycle=d.cycles[0];
 const op=makeOperation(d,'profile','POST',{name:'Alex',allowance:50,frequency:'daily'},earlier);
 const expected=rollCycle(applyLocal(d,op));
 const result=await withDatabaseTransaction(()=>syncOperation(op,'alice'));
 assert.equal(result.data.cycle.frequency,'daily');assert.equal(result.data.cycle.start,expected.cycle.start);assert.equal(result.data.cycle.end,expected.cycle.end);
});
