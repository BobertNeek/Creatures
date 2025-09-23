

// --- Agent Injection wiring ---
const _agentBtn=document.querySelector('#injectAgent');
const _agentPick=document.querySelector('#agentFile');
if(_agentBtn && _agentPick){
  _agentBtn.onclick=()=>_agentPick.click();
  _agentPick.addEventListener('change', async ev=>{
    const f=ev.target.files && ev.target.files[0];
    if(!f) return;
    try{ await injectAgentFile(f); }catch(e){ const el=document.querySelector('#log'); if(el){ el.textContent += 'Inject error: '+e.message+'\n'; } }
  });
}
