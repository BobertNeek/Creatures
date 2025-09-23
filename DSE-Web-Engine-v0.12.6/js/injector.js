
import { PRAY } from './pray.js';
export const VFS=new Map(); // filename(lower)->Uint8Array
function clog(m){ const el=document.querySelector('#caosLog')||document.querySelector('#log'); if(el){ el.textContent+=m+'\n'; el.scrollTop=el.scrollHeight; } }

export async function injectAgentFile(file){
  const buf=await file.arrayBuffer();
  const pray=new PRAY(buf);
  await pray.parse();

  // Mount FILE blocks
  for(const b of pray.blocks){ if(b.type==='FILE'){ VFS.set(b.name.toLowerCase(), b.data); } }
  clog(`Mounted ${Array.from(VFS.keys()).length} FILE resources from ${file.name}`);

  // Execute AGNT/DSAG scripts
  const tagBlocks = pray.blocks.filter(b => b.type==='AGNT' || b.type==='DSAG');
  let ran=0;
  for(const tb of tagBlocks){
    const tag = PRAY.readTagBlock(tb.data);
    const count = (tag.ints && tag.ints['Script Count']) || 0;
    for(let i=1;i<=count;i++){
      const key='Script '+i;
      if(tag.strs && tag.strs[key]){
        if(window.caosRun) await window.caosRun(tag.strs[key]);
        ran++;
      }
    }
    if(tag.strs && tag.strs['Remove script']) window.lastAgentRemoveScript = tag.strs['Remove script'];
  }
  clog(`Injected ${ran} script(s) from ${tagBlocks.length} agent block(s).`);
}

export function vfsGet(name){ return VFS.get(String(name||'').toLowerCase())||null; }
