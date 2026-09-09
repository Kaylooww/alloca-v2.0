import {AsyncLocalStorage} from 'node:async_hooks';
import {createClient,type Client,type InValue,type Transaction as SqlTransaction} from '@libsql/client';
let client:Client|undefined;const active=new AsyncLocalStorage<SqlTransaction>();
export function databaseClient(){if(!client){const url=process.env.TURSO_DATABASE_URL;if(!url)throw new Error('Set TURSO_DATABASE_URL before opening your budget.');client=createClient({url,authToken:process.env.TURSO_AUTH_TOKEN||undefined});}return client;}
export async function withDatabaseTransaction<T>(fn:()=>Promise<T>):Promise<T>{if(active.getStore())return fn();const tx=await databaseClient().transaction('write');try{const value=await active.run(tx,fn);await tx.commit();return value}catch(e){await tx.rollback();throw e}finally{tx.close()}}
class Statement{private args:InValue[]=[];constructor(private sql:string){}bind(...args:unknown[]){this.args=args as InValue[];return this}async execute(){return (active.getStore()||databaseClient()).execute({sql:this.sql,args:this.args})}async all<T>(){return {results:(await this.execute()).rows as unknown as T[]}}async run(){return {meta:{changes:(await this.execute()).rowsAffected}}}}
export function db(){return {prepare(sql:string){return new Statement(sql)},async batch(statements:Statement[]){return withDatabaseTransaction(async()=>{const results=[];for(const statement of statements)results.push(await statement.run());return results})}}}
export async function rows<T>(query:string,...args:unknown[]):Promise<T[]>{return (await db().prepare(query).bind(...args).all<T>()).results;}
