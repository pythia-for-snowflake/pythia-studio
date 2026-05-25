// ═══ COLOR MATH ═══════════════════════════════════════════════════════
function hexToOklch(hex){
  let r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
  const lin=x=>x>0.04045?((x+0.055)/1.055)**2.4:x/12.92;r=lin(r);g=lin(g);b=lin(b);
  const X=r*0.4122214708+g*0.5363325363+b*0.0514459929,Y=r*0.2119034982+g*0.6806995451+b*0.1073969566,Z=r*0.0883024619+g*0.2817188376+b*0.6299787005;
  const A=Math.cbrt(X)*1.9779984951+Math.cbrt(Y)*(-2.4285922050)+Math.cbrt(Z)*0.4505937099;
  const B=Math.cbrt(X)*0.0259040371+Math.cbrt(Y)*0.7827717662-Math.cbrt(Z)*0.8086757660;
  const L=Math.cbrt(X)*0.2104542553+Math.cbrt(Y)*0.7936177850-Math.cbrt(Z)*0.0040720468;
  return[L,Math.sqrt(A*A+B*B),((Math.atan2(B,A)*180/Math.PI)%360+360)%360];
}
function oklchToHex(L,C,H){
  const h=H*Math.PI/180,a=C*Math.cos(h),b=C*Math.sin(h);
  const lp=L+0.3963377774*a+0.2158037573*b,mp=L-0.1055613458*a-0.0638541728*b,sp=L-0.0894841775*a-1.2914855480*b;
  const lc=lp**3,mc=mp**3,sc=sp**3;
  let R=4.0767416621*lc-3.3077115913*mc+0.2309699292*sc,G=-1.2684380046*lc+2.6097574011*mc-0.3413193965*sc,B2=-0.0041960863*lc-0.7034186147*mc+1.7076147010*sc;
  const gam=x=>x>0.0031308?1.055*x**(1/2.4)-0.055:12.92*x,cl=x=>Math.max(0,Math.min(1,x)),h2=x=>Math.round(cl(gam(x))*255).toString(16).padStart(2,'0');
  return'#'+h2(R)+h2(G)+h2(B2);
}
function shiftHue(hex,deg){const[L,C,H]=hexToOklch(hex);return oklchToHex(L,C,(H+deg+360)%360);}
function autoDark(hex){
  const raw=hex.replace('#','');
  const r=parseInt(raw.slice(0,2),16)/255,g=parseInt(raw.slice(2,4),16)/255,b=parseInt(raw.slice(4,6),16)/255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),lum=(max+min)/2;
  let h=0,s=0;
  if(max!==min){const d=max-min;s=lum>0.5?d/(2-max-min):d/(max+min);
    if(max===r)h=(g-b)/d+(g<b?6:0);else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h/=6;}
  const newLum=Math.max(0.35,Math.min(0.75,0.60+(lum-0.60)*0.30)),newS=Math.min(1.0,s*0.90);
  let r2,g2,b2;
  if(newS===0){r2=g2=b2=newLum;}else{
    const q=newLum<0.5?newLum*(1+newS):newLum+newS-newLum*newS,p=2*newLum-q;
    const f=t=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    r2=f(h+1/3);g2=f(h);b2=f(h-1/3);}
  const h2=x=>Math.round(x*255).toString(16).padStart(2,'0');
  return'#'+h2(r2)+h2(g2)+h2(b2);
}
function relLum(hex){
  const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
  const lin=x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4;
  return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
}
function contrast(a,b){const l1=relLum(a),l2=relLum(b);return(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);}
function toReadable(hex,bgHex,threshold=4.5){
  if(contrast(hex,bgHex)>=threshold)return hex;
  const[L,C,H]=hexToOklch(hex);const bgLum=relLum(bgHex);
  if(bgLum>0.18){for(let t=L;t>0.01;t-=0.03){const c=oklchToHex(t,Math.min(C*0.92,0.2),H);if(contrast(c,bgHex)>=threshold)return c;}return oklchToHex(0.2,Math.min(C*0.85,0.18),H);}
  else{for(let t=L;t<0.99;t+=0.03){const c=oklchToHex(t,Math.min(C*0.92,0.2),H);if(contrast(c,bgHex)>=threshold)return c;}return oklchToHex(0.9,Math.min(C*0.7,0.15),H);}
}

// ═══ CONSTANTS ════════════════════════════════════════════════════════
const PINK='#e07baa',PINK_T='#fdf0f7';
const HARMONIES={complementary:{s:180,t:210},triadic:{s:120,t:240},analogous:{s:30,t:-30},split:{s:150,t:210}};
const SEM_DEF={success:'#09ab3b',warning:'#ffa421',error:'#ff4b4b',grey:'#535353'};

function getSurface(mode){
  if(mode==='dark')return{appBg:'#0e1117',appText:'#fafafa',appTextDim:'#a3a8b5',sidebarBg:'#1a1a1a',border:'#3a3f4a',inputBg:'#262730',inputBorder:'#3a3f4a',placeholder:'#6b7280',mutedBg:'#1e1e1e',divider:'#2a2e3a'};
  return{appBg:'#ffffff',appText:'#3E4264',appTextDim:'#6b7280',sidebarBg:'#f7f7f7',border:'#e9ebed',inputBg:'#ffffff',inputBorder:'#d6d6d6',placeholder:'#aaa',mutedBg:'#fafafa',divider:'#eee'};
}
function getDerived(){
  const ho=HARMONIES[S.harmony];
  const derived=[S.sig,shiftHue(S.sig,ho.s),shiftHue(S.sig,ho.t)];
  const colors=S.customColors||derived;
  const assigned={};S.roles.forEach((r,i)=>assigned[r]=colors[i]);
  const lightFull={...assigned,...S.sem};
  const darkFull=Object.fromEntries(Object.entries(lightFull).map(([k,v])=>[k,autoDark(v)]));
  const full=S.mode==='dark'?darkFull:lightFull;
  return{colors,assigned,lightFull,darkFull,full,primary:full.primary};
}

function buildPalettePop(closeHtml){
  const d=getDerived();const{colors,assigned,lightFull,darkFull}=d;

  const presetHtml=PRESETS.map(p=>{
    const on=assigned.primary?.toLowerCase()===p.primary.toLowerCase()&&assigned.secondary?.toLowerCase()===p.secondary.toLowerCase()&&assigned.tertiary?.toLowerCase()===p.tertiary.toLowerCase();
    return`<button onclick="applyPreset('${p.id}')" style="background:${on?PINK_T:'#fff'};border:1.5px solid ${on?PINK:'#e0e0e0'};color:${on?PINK:'#555'};padding:3px 10px;border-radius:5px;cursor:pointer;font-size:11px;font-family:inherit;font-weight:${on?700:400};display:inline-flex;align-items:center;gap:5px">
      <span style="display:inline-flex;gap:2px"><span style="width:9px;height:9px;border-radius:2px;background:${p.primary}"></span><span style="width:9px;height:9px;border-radius:2px;background:${p.secondary}"></span><span style="width:9px;height:9px;border-radius:2px;background:${p.tertiary}"></span></span>${p.label}${on?' ✓':''}</button>`;
  }).join('');

  const roleHtml=S.roles.map((role,i)=>`
    <div style="border:1.5px solid #e0e0e0;border-radius:8px;background:#fff;padding:7px 9px;display:flex;align-items:center;gap:7px">
      <div style="width:26px;height:26px;border-radius:5px;background:${colors[i]};border:1px solid #e0e0e0;flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:#f2f2f2;color:#888;border:1px solid #e0e0e0;display:inline-block">${role}</div>
        <div style="font-size:10px;color:#bbb;font-family:'Courier New',monospace;margin-top:2px">${colors[i]}</div>
      </div>
      <input type="color" value="${colors[i]}" oninput="setRoleColor(${i},this.value)" style="width:28px;height:22px;padding:1px;border:1px solid #e0e0e0;border-radius:4px;cursor:pointer">
      <div style="display:flex;gap:2px">
        <button onclick="moveRole(${i},-1)" class="hbtn" style="padding:2px 6px">←</button>
        <button onclick="moveRole(${i},1)"  class="hbtn" style="padding:2px 6px">→</button>
      </div>
    </div>`).join('');

  const semHtml=Object.entries(S.sem).map(([k,v])=>`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f5f5f5">
      <div style="width:22px;height:22px;border-radius:4px;background:${v};border:1px solid #e0e0e0;flex-shrink:0"></div>
      <span style="font-size:12px;color:#888;width:60px;flex-shrink:0">${k}</span>
      <input type="color" value="${v}" oninput="setSem('${k}',this.value)" style="width:28px;height:22px;padding:1px;border:1px solid #e0e0e0;border-radius:4px;cursor:pointer">
      <input type="text" value="${v}" maxlength="7" oninput="setSemTxt('${k}',this.value)" style="width:72px;font-family:'Courier New',monospace;font-size:12px;padding:4px 7px;border:1.5px solid #e0e0e0;border-radius:5px;color:#1a1a1a;font-family:inherit">
    </div>`).join('');

  const shadeRow=(k,base,isDark)=>{
    const li=`color-mix(in oklch,${base},${isDark?'black 80%':'white 90%'})`;
    const dk=`color-mix(in oklch,${base},${isDark?'white 15%':'black 25%'})`;
    const dkst=`color-mix(in oklch,${base},${isDark?'white 30%':'black 50%'})`;
    const bd=isDark?'#333':'#e0e0e0';const bb=isDark?'#222':'#f5f5f5';const lc=isDark?'#aaa':'#555';const sc=isDark?'#666':'#bbb';
    return`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid ${bb}">
      <div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:600;color:${lc};font-family:'Courier New',monospace">--${k}</div><div style="font-size:10px;color:${sc};font-family:'Courier New',monospace">${base}</div></div>
      <div style="display:flex;gap:3px">
        <div style="width:20px;height:20px;border-radius:3px;background:${li};border:1px solid ${bd}" title="lighter"></div>
        <div style="width:20px;height:20px;border-radius:3px;background:${base};border:1px solid ${bd}" title="default"></div>
        <div style="width:20px;height:20px;border-radius:3px;background:${dk};border:1px solid ${bd}" title="darker"></div>
        <div style="width:20px;height:20px;border-radius:3px;background:${dkst};border:1px solid ${bd}" title="darkest"></div>
      </div>
    </div>`;
  };
  const tokenKeys=[['primary',lightFull.primary],['secondary',lightFull.secondary],['tertiary',lightFull.tertiary],['success',lightFull.success],['warning',lightFull.warning],['error',lightFull.error],['grey',lightFull.grey]];
  const darkKeys=[['primary',darkFull.primary],['secondary',darkFull.secondary],['tertiary',darkFull.tertiary],['success',darkFull.success],['warning',darkFull.warning],['error',darkFull.error],['grey',darkFull.grey]];
  const lightRows=tokenKeys.map(([k,v])=>v?shadeRow(k,v,false):'').join('');
  const darkRows=darkKeys.map(([k,v])=>v?shadeRow(k,v,true):'').join('');

  return`<div class="pop-hdr"><div><div class="pop-title">Palette</div><div class="pop-sub">signature · harmony · role colors · semantic tokens</div></div>${closeHtml}</div>
  <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:28px;padding-top:32px">
      <div style="display:flex;gap:24px;align-items:stretch">
        <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:20px 18px 16px;flex:1;margin-top:7px">
          <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Presets</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">${presetHtml}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px;justify-content:center;flex-shrink:0;margin-top:7px">
          <button onclick="randomPalette()" class="hbtn">🎲 random</button>
          <button onclick="resetPalette()" class="hbtn">↺ reset</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.8fr);gap:24px">
        <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:20px 18px 16px;margin-top:7px">
          <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Signature color</div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:26px;height:26px;border-radius:5px;background:${S.sig};border:1px solid #e0e0e0;flex-shrink:0"></div>
            <input type="color" value="${S.sig}" oninput="S.sig=this.value;S.customColors=null;render()" style="width:34px;height:26px;padding:1px;border:1.5px solid #e0e0e0;border-radius:5px;cursor:pointer;flex-shrink:0">
            <input type="text" value="${S.sig}" maxlength="7" oninput="setSigTxt(this.value)" style="width:0;min-width:0;flex:1;font-family:'Courier New',monospace;font-size:12px;padding:5px 9px;border:1.5px solid #e0e0e0;border-radius:5px;color:#1a1a1a">
          </div>
        </div>
        <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:20px 18px 16px;margin-top:7px">
          <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Harmony</div>
          <div style="display:flex;flex-wrap:nowrap;gap:5px">
            ${['complementary','triadic','analogous','split'].map(h=>`<button onclick="S.harmony='${h}';S.customColors=null;render()" class="hbtn${S.harmony===h?' on':''}">${h}</button>`).join('')}
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px">
        <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:20px 18px 16px;margin-top:7px">
          <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Role assignment <span style="font-weight:400;letter-spacing:.02em">← → to reorder</span></div>
          <div style="display:flex;flex-direction:column;gap:6px">${roleHtml}</div>
        </div>
        <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:20px 18px 16px;margin-top:7px">
          <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Semantic tokens</div>
          <div>${semHtml}</div>
        </div>
      </div>
    </div>
    <div>
      <div class="blk2">Light :root</div>
      <div style="margin-bottom:14px">${lightRows}</div>
      <div class="blk2">Dark @media — auto-computed</div>
      <div style="background:#0e1117;border-radius:6px;padding:8px">${darkRows}</div>
    </div>
  </div>`;
}

// ═══ PALETTE EVENT HANDLERS ═══════════════════════════════════════════
function setSig(v){S.sig=v;S.customColors=null;render();}
function setSigTxt(v){if(/^#[0-9a-fA-F]{6}$/.test(v)){S.sig=v;S.customColors=null;render();}}
function setRoleColor(i,v){const c=S.customColors?[...S.customColors]:[...getDerived().colors];c[i]=v;S.customColors=c;render();}
function moveRole(i,dir){const j=i+dir;if(j<0||j>2)return;const c=S.customColors?[...S.customColors]:[...getDerived().colors];[c[i],c[j]]=[c[j],c[i]];S.customColors=c;render();}
function setSem(k,v){S.sem={...S.sem,[k]:v};render();}
function setSemTxt(k,v){if(/^#[0-9a-fA-F]{6}$/.test(v)){S.sem={...S.sem,[k]:v};render();}}
function randomPalette(){
  S.sig='#'+Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0');
  S.customColors=null;
  render();
}
function resetPalette(){applyPreset('pythia');}
function applyPreset(id){
  const p=PRESETS.find(x=>x.id===id);if(!p)return;
  S.roles=['primary','secondary','tertiary'];
  S.customColors=[p.primary,p.secondary,p.tertiary];
  S.sig=p.primary;
  S.sem={...SEM_DEF,...(p.success?{success:p.success}:{}),...(p.warning?{warning:p.warning}:{}),...(p.error?{error:p.error}:{})};
  render();
}
