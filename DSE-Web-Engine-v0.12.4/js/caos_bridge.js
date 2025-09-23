
// js/caos_bridge.js — dynamic adapter to the packaged CAOS engine
// Attempts to load engine_core.js and a frontend exec() from ./caos_engine/*
// Falls back gracefully to the base app if not present.

const logbox = (()=>{
  const el = document.querySelector('#caosLog') || document.createElement('pre');
  if(!el.parentNode){ el.id='caosLog'; document.body.appendChild(el); }
  return (m)=>{ el.textContent += (m+'\n'); el.scrollTop = el.scrollHeight; }
})();

function addBadge(txt){
  const head=document.querySelector('header')||document.body;
  const tag=document.createElement('span'); tag.className='tag'; tag.textContent=txt;
  head.appendChild(tag);
}

export async function loadCaosRuntime(){
  try{
    // locate possible entry modules inside caos_engine
    const base = './caos_engine/';
    const tryPaths = [
      'engine_core.js', 'engine_core.mjs', 'core/engine_core.js',
      'index.js', 'main.js'
    ];
    let mod=null, chosen=null;
    for(const p of tryPaths){
      try { mod = await import(base+p); chosen=p; break; } catch(_) {}
    }
    if(!mod){
      addBadge('CAOS: not found'); 
      logbox('CAOS bridge: no engine module found under ./caos_engine');
      return null;
    }
    addBadge('CAOS: '+chosen);

    // try to find an exec surface: mod.exec(text) or mod.backend.exec(text)
    let exec=null;
    if(typeof mod.exec==='function'){ exec = mod.exec.bind(mod); }
    else if(mod.backend && typeof mod.backend.exec==='function'){ exec = mod.backend.exec.bind(mod.backend); }
    else if(mod.JsBackend){ const vm=new mod.JsBackend(mod.opmap||{}, (m)=>logbox('[pkg] '+m)); exec=(t)=>vm.exec(t); }

    // opcodes: prefer top-level ./caos_opcodes.json
    let opmap={};
    try {
      const r = await fetch('./caos_opcodes.json',{cache:'no-store'});
      opmap = await r.json();
      logbox(`Loaded opcode map: ${Object.keys(opmap).length} ops`);
    } catch(e){ logbox('Opcode map load failed: '+e.message); }

    return { mod, exec, opmap };
  }catch(e){
    logbox('CAOS bridge error: '+e.message);
    return null;
  }
}

// Optional: attach to window for simple HTML buttons that call window.caosRun
window.caosReady = loadCaosRuntime();
window.caosRun = async function(text){
  const rt = await window.caosReady;
  if(rt && rt.exec){ return rt.exec(text); }
  console.warn('CAOS runtime not ready');
};
