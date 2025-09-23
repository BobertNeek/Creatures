console.log('bootstrap');
// Agent Injection
const agentBtn=document.querySelector('#injectAgent');
const agentPick=document.querySelector('#agentFile');
if(agentBtn && agentPick){ agentBtn.onclick=()=>agentPick.click(); agentPick.addEventListener('change', async ev=>{ const f=ev.target.files&&ev.target.files[0]; if(!f) return; try{ await injectAgentFile(f); }catch(e){ const el=document.querySelector('#log'); if(el){ el.textContent+='Inject error: '+e.message+'\n'; } } }); }
