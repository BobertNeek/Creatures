
// js/pray.js — PRAY container reader (agents/creatures)
// Header 'PRAY'; per-block: [type:4][name:128][len:u32][ulen:u32][flags:u32][data:len]
// flags&1 => zlib-compressed; inflate via DecompressionStream('deflate') when available.
export class PRAY{
  constructor(buf){ this.view=new DataView(buf); this.buf=buf; this.blocks=[]; }
  static td=new TextDecoder('utf-8');
  nz(bytes){ let i=bytes.indexOf(0); if(i<0) i=bytes.length; return PRAY.td.decode(bytes.slice(0,i)); }
  async inflate(u8){
    if('DecompressionStream'in self){
      try{
        const ds=new DecompressionStream('deflate');
        const r=new Response(new Blob([u8]).stream().pipeThrough(ds));
        const ab=await r.arrayBuffer(); return new Uint8Array(ab);
      }catch(_){}
    }
    return u8;
  }
  async parse(){
    let p=0;
    if(PRAY.td.decode(new Uint8Array(this.buf,0,4))!=='PRAY') throw new Error('Not a PRAY file');
    p+=4;
    while(p<this.buf.byteLength){
      const type=PRAY.td.decode(new Uint8Array(this.buf,p,4)); p+=4;
      const name=this.nz(new Uint8Array(this.buf,p,128)); p+=128;
      const len=this.view.getUint32(p,true); p+=4;
      const ulen=this.view.getUint32(p,true); p+=4;
      const flags=this.view.getUint32(p,true); p+=4;
      let data=new Uint8Array(this.buf,p,len); p+=len;
      if(flags&1){ data=await this.inflate(data); }
      this.blocks.push({type,name,flags,ulen, len:data.length, data});
    }
    return this.blocks;
  }
  static readTagBlock(u8){
    const v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength); let p=0;
    const u32=()=>{ const x=v.getUint32(p,true); p+=4; return x; };
    const rd=(n)=> new TextDecoder().decode(u8.slice(p,p+n));
    const ints={}, strs={};
    const nI=u32(); for(let i=0;i<nI;i++){ const nlen=u32(); const key=rd(nlen); p+=nlen; const val=u32(); ints[key]=val; }
    const nS=u32(); for(let i=0;i<nS;i++){ const nlen=u32(); const key=rd(nlen); p+=nlen; const vlen=u32(); const val=rd(vlen); p+=vlen; strs[key]=val; }
    return {ints,strs};
  }
}
