const C='esma-v13';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k.replace(/\d+$/,'')===C.replace(/\d+$/,'')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function sayfaMi(r){const u=new URL(r.url);return r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');}
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  if(sayfaMi(r)){
    // sayfa: önce internet (yeni sürüm hemen gelsin), yoksa önbellek
    e.respondWith(caches.open(C).then(c=>{
      const net=fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res;});
      const zaman=new Promise(ok=>setTimeout(ok,5000)).then(()=>c.match(r,{ignoreSearch:true}));
      return Promise.race([net.catch(()=>c.match(r,{ignoreSearch:true})),zaman.then(h=>h||net)]);
    }));
    return;
  }
  e.respondWith(caches.open(C).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;}).catch(()=>hit);
    return hit||net;
  })));
});
