
export class PRAY {
  constructor(buf){ this.view=new DataView(buf); this.buf=buf; this.blocks=[]; }
  static textDecoder=new TextDecoder('utf-8');
  bytes(off,len){ return new Uint8Array(this.buf,off,len); }
  strz(bytes){ let end=bytes.indexOf(0); if(end<0) end=bytes.length; return PRAY.textDecoder.decode(bytes.slice(0,end)); }
  async inflate(u8){
    if('DecompressionStream' in self){
      try{ const ds=new DecompressionStream('deflate'); const r=new Response(new Blob([u8]).stream().pipeThrough(ds)); return new Uint8Array(await r.arrayBuffer()); }catch(_){}
    }
    return u8;
  }
  async parse(){
    let p=0; const magic=PRAY.textDecoder.decode(new Uint8Array(this.buf,0,4)); if(magic!=='PRAY') throw new Error('Not a PRAY file'); p+=4;
    while(p<this.buf.byteLength){
      const type=PRAY.textDecoder.decode(new Uint8Array(this.buf,p,4)); p+=4;
      const name=this.strz(new Uint8Array(this.buf,p,128)); p+=128;
      const len=this.view.getUint32(p,true); p+=4;
      const ulen=this.view.getUint32(p,true); p+=4;
      const flags=this.view.getUint32(p,true); p+=4;
      let data=new Uint8Array(this.buf,p,len); p+=len;
      if(flags&1){ data=await this.inflate(data); }
      this.blocks.push({type,name,flags,len:data.length,data});
    }
    return this.blocks;
  }
  static readTagBlock(u8){
    const v=new DataView(u8.buffer,u8.byteOffset,u8.byteLength); let p=0;
    const u32=()=>{ const x=v.getUint32(p,true); p+=4; return x; };
    const str=(n)=> new TextDecoder().decode(u8.slice(p,p+n));
    const ints={}, strs={};
    const ni=u32(); for(let i=0;i<ni;i++){ const nlen=u32(); const name=str(nlen); p+=nlen; const val=u32(); ints[name]=val; }
    const ns=u32(); for(let i=0;i<ns;i++){ const nlen=u32(); const name=str(nlen); p+=nlen; const vlen=u32(); const val=str(vlen); p+=vlen; strs[name]=val; }
    return {ints,strs};
  }
}
