// ═══ STATE ════════════════════════════════════════════════════════════
const S={
  sig:'#7056d7', harmony:'analogous',
  roles:['primary','secondary','tertiary'],
  sem:{...SEM_DEF},
  customColors:['#7056d7','#e07baa','#60defb'],
  tfi:0, bfi:0,
  titleText:'Insights',
  titleWeight:700, letterSpacing:-0.02, outlineOn:false, outlineSize:2,
  selectedEmoji:'🔮', emojiPos:'before', emojiGap:10, emojiVendor:'native',
  logoMode:'emoji', logoImageSrc:'disk', logoImageData:null, logoImageUrl:'', materialIcon:'auto_awesome',
  logoSize:'large', sidebarWidth:336,
  sidebarOpen:true, mode:'light', env:'sis',
  activePop:null,
};
// widget state — persists across mock re-renders
const W={checked:true,toggle:true,radio:'a',slider:40,tab:1,pill:1,seg:0};
let emojiSearch='';
let materialIconSearch='';
let exportOpts={palette:true,appfont:true,wide:true,icon:true,woff2:true};

// ═══ RENDER ═══════════════════════════════════════════════════════════
function render(){renderTopbar();renderMock();renderPops();}

function renderTopbar(){
  ['palette','font','logo','export'].forEach(n=>{
    document.getElementById('tbtn-'+n).className='tb-btn'+(S.activePop===n?' active':'');
  });
  document.getElementById('tog-sis').className='tb-tog'+(S.env==='sis'?' on':'');
  document.getElementById('tog-local').className='tb-tog'+(S.env==='local'?' on':'');
  document.getElementById('tog-light').className='tb-tog'+(S.mode==='light'?' on':'');
  document.getElementById('tog-dark').className='tb-tog'+(S.mode==='dark'?' on':'');
  const sb=document.getElementById('tog-sb');
  sb.className='tb-tog'+(S.sidebarOpen?' on':'');
  sb.textContent=S.sidebarOpen?'◧ sidebar open':'▢ sidebar closed';
}

function renderMock(){
  const d=getDerived();const s=getSurface(S.mode);
  const tf=TITLE_FONTS[S.tfi],bf=BODY_FONTS[S.bfi];
  loadFont(tf.url);loadFont(bf.url);
  const primary=d.primary;
  const titleColor=toReadable(d.assigned.primary||S.sig,s.appBg);
  const stuckColor=S.env==='sis'?'#29b5e8':'#ff4b4b';
  const mock=document.getElementById('mock');
  mock.style.background=s.appBg;
  mock.style.borderColor=S.mode==='dark'?'#1a1a1a':'#e0e0e0';
  mock.innerHTML=buildSidebar(s,primary,titleColor,tf,bf)+buildMain(s,primary,d.full,titleColor,tf,bf,stuckColor);
}

// ═══ POPOVERS ═════════════════════════════════════════════════════════
function togglePop(name){S.activePop=S.activePop===name?null:name;render();}
function closePop(){S.activePop=null;render();}

function renderPops(){
  ['palette','font','logo','export'].forEach(name=>{
    const el=document.getElementById('pop-'+name);
    if(S.activePop===name){
      el.style.display='block';
      el.innerHTML=buildPop(name);
      el.onclick=e=>e.stopPropagation();
    }
    else el.style.display='none';
  });
}

function buildPop(name){
  const closeHtml=`<button class="close-btn" onclick="closePop()">✕ close (esc)</button>`;
  if(name==='palette')return buildPalettePop(closeHtml);
  if(name==='font')return buildFontPop(closeHtml);
  if(name==='logo')return buildLogoPop(closeHtml);
  if(name==='export')return buildExportPop(closeHtml);
  return'';
}

// ═══ KEYBOARD ═════════════════════════════════════════════════════════
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePop();});
document.addEventListener('click',e=>{
  if(S.activePop&&!e.target.closest('.pop')&&!e.target.closest('.tb-btn'))closePop();
});

// ═══ INIT ═════════════════════════════════════════════════════════════
[...TITLE_FONTS,...BODY_FONTS].forEach(f=>loadFont(f.url));

const GIST_BASE='https://gist.githubusercontent.com/gcwxfcchvz-source/f1b86f55e7ec008146c56417cc342815/raw';

async function initData(){
  const [presets,emojis,emojiKw,matIcons]=await Promise.all([
    fetch(`${GIST_BASE}/presets.json`).then(r=>r.json()),
    fetch(`${GIST_BASE}/emojis.json`).then(r=>r.json()),
    fetch(`${GIST_BASE}/emoji-keywords.json`).then(r=>r.json()),
    fetch(`${GIST_BASE}/material-icons.json`).then(r=>r.json()),
  ]);
  PRESETS=presets;
  EMOJIS=emojis;
  EMOJI_KW=emojiKw;
  MATERIAL_ICONS=matIcons;
  render();
}

initData();
