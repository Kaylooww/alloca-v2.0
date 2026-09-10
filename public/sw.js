/* Only cache the public app shell and build assets. Never cache auth/API responses or private SSR HTML. */
const VERSION='alloca-shell-X5v5vp50duU4JcIhbieGl';
const PAGES=new Set(['/','/offline','/dashboard','/expenses','/savings','/reports','/categories','/profile']);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(VERSION);const response=await fetch('/offline',{cache:'reload'});if(!response.ok)throw new Error('Offline shell download failed');const html=await response.clone().text();await cache.put('/offline',response);
 const assets=new Set(['/logo/alloca-logo-mark.svg','/logo/favicon.svg','/logo/icon-192.png','/logo/icon-512.png','/logo/icon-maskable.png']);
 for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){const url=new URL(match[1].replaceAll('&amp;','&'),self.location.origin);if(url.origin===self.location.origin&&url.pathname.startsWith('/_next/static/'))assets.add(url.pathname+url.search)}
 if(![...assets].some(p=>p.endsWith('.js')))throw new Error('Offline shell scripts not found');await cache.addAll([...assets]);await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('alloca-shell-')&&key!==VERSION)await caches.delete(key);await self.clients.claim();for(const client of await self.clients.matchAll())client.postMessage({type:'ALLOCA_OFFLINE_READY'})})()));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(url.origin!==self.location.origin||event.request.method!=='GET')return;if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/auth/'))return;
 if(event.request.mode==='navigate'&&PAGES.has(url.pathname)){event.respondWith((async()=>{const shell=await (await caches.open(VERSION)).match('/offline');return shell||fetch(event.request)})());return;}
 if(url.pathname.startsWith('/_next/static/')||url.pathname.startsWith('/logo/'))event.respondWith((async()=>{const cache=await caches.open(VERSION);const hit=await cache.match(event.request);if(hit)return hit;const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response})());
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
