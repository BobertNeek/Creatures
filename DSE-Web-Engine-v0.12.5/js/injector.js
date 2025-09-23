
import { PRAY } from './pray.js';
export const VFS=new Map();
function log(m){ const el=document.querySelector('#caosLog')||document.querySelector('#log'); if(el){ el.textContent+=m+'\n'; el.scrollTop=el.scrollHeight; } }
export async function injectAgentFile(file){
  const buf=await file.arrayBuffer(); const pray=new PRAY(buf); await pray.parse();
  for(const b of pray.blocks){ if(b.type==='FILE'){ VFS.set(b.name.toLowerCase(), b.data); } }
  log(`Mounted ${Array.from(VFS.keys()).length} FILEs from ${file.name}`);
  const tags=pray.blocks.filter(b=>b.type==='AGNT'||b.type==='DSAG');
  let ran=0;
  for(const tb of tags){
    const t=PRAY.readTagBlock(tb.data); const c=t.ints['Script Count']||0;
    for(let i=1;i<=c;i++){ const k='Script '+i; if(t.strs[k]){ await (window.caosRun?t=>window.caosRun(t):Promise.resolve())(t.strs[k]); ran++; } }
    if(t.strs['Remove script']) window.lastAgentRemoveScript=t.strs['Remove script'];
  }
  log(`Injected ${ran} script(s) from ${tags.length} AGNT/DSAG block(s).`);
}
export function vfsGet(name){ return VFS.get(String(name||'').toLowerCase())||null; }
