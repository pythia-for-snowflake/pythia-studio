const TITLE_FONTS=[
  {v:"'Syne',sans-serif",         label:'Syne',         url:'https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap'},
  {v:"'Space Grotesk',sans-serif", label:'Space Grotesk', url:'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'},
  {v:"'Fredoka',sans-serif",       label:'Fredoka',       url:'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap'},
  {v:"'Nunito',sans-serif",        label:'Nunito',        url:'https://fonts.googleapis.com/css2?family=Nunito:wght@400..900&display=swap'},
  {v:"'Inter',sans-serif",         label:'Inter',         url:'https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap'},
  {v:"'JetBrains Mono',monospace", label:'JetBrains Mono',url:'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..800&display=swap'},
  {v:"'Bebas Neue',cursive",       label:'Bebas Neue',    url:'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'},
  {v:"'Righteous',cursive",        label:'Righteous',     url:'https://fonts.googleapis.com/css2?family=Righteous&display=swap'},
  {v:"'Lilita One',cursive",       label:'Lilita One',    url:'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap'},
  {v:"'Pacifico',cursive",         label:'Pacifico',      url:'https://fonts.googleapis.com/css2?family=Pacifico&display=swap'},
  {v:"'Permanent Marker',cursive", label:'Permanent Marker',url:'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'},
  {v:"'Press Start 2P',cursive",   label:'Press Start 2P',url:'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'},
  {v:"'Bungee',sans-serif",        label:'Bungee',        url:'https://fonts.googleapis.com/css2?family=Bungee&display=swap'},
  {v:"'Monoton',cursive",          label:'Monoton',       url:'https://fonts.googleapis.com/css2?family=Monoton&display=swap'},
];
const BODY_FONTS=[
  {v:"'DM Sans',sans-serif",              label:'DM Sans',             url:'https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&display=swap'},
  {v:"'Inter',sans-serif",                label:'Inter',               url:'https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap'},
  {v:"'Source Sans 3',sans-serif",        label:'Source Sans 3',       url:'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400..700&display=swap'},
  {v:"'IBM Plex Sans',sans-serif",        label:'IBM Plex Sans',       url:'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap'},
  {v:"'Space Grotesk',sans-serif",        label:'Space Grotesk',       url:'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'},
  {v:"'Atkinson Hyperlegible',sans-serif",label:'Atkinson Hyperlegible',url:'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap'},
  {v:"'Nunito',sans-serif",               label:'Nunito',              url:'https://fonts.googleapis.com/css2?family=Nunito:wght@400..900&display=swap'},
  {v:"'Fredoka',sans-serif",              label:'Fredoka',             url:'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap'},
  {v:"'JetBrains Mono',monospace",        label:'JetBrains Mono',      url:'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..800&display=swap'},
  {v:"'IBM Plex Mono',monospace",         label:'IBM Plex Mono',       url:'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap'},
];
const FONT_PAIRINGS={
  'Syne':['DM Sans','Inter','Space Grotesk'],
  'Space Grotesk':['Space Grotesk','Inter','DM Sans'],
  'Fredoka':['Fredoka','Nunito','DM Sans'],
  'Nunito':['Nunito','DM Sans'],
  'Bebas Neue':['Inter','DM Sans','Source Sans 3'],
  'Pacifico':['Nunito','Fredoka','DM Sans'],
  'Lilita One':['Nunito','Fredoka','DM Sans'],
  'Permanent Marker':['Nunito','DM Sans'],
  'Press Start 2P':['JetBrains Mono','IBM Plex Mono'],
  'Bungee':['DM Sans','Inter'],
  'Monoton':['JetBrains Mono','DM Sans'],
};
// Loaded from Gist at init — see initData()
let PRESETS=[], EMOJIS={}, EMOJI_KW={}, MATERIAL_ICONS={};

function buildFontPop(closeHtml){
  const tf=TITLE_FONTS[S.tfi],bf=BODY_FONTS[S.bfi];
  const pairing=FONT_PAIRINGS[tf.label]||[];
  const d=getDerived();const primary=d.primary;
  const titleColor=toReadable(primary||S.sig,'#ffffff');
  const isDark=S.mode==='dark';
  const h2Color=`color-mix(in oklch,${primary},${isDark?'white 15%':'black 25%'})`;
  const h3Color=`color-mix(in oklch,${primary},${isDark?'white 30%':'black 50%'})`;

  const tfChips=TITLE_FONTS.map((f,i)=>{const on=S.tfi===i;
    return`<button onclick="S.tfi=${i};render()" style="background:${on?PINK_T:'#fff'};border:1.5px solid ${on?PINK:'#e0e0e0'};color:${on?PINK:'#555'};padding:4px 11px;border-radius:5px;cursor:pointer;font-size:12px;font-family:${f.v};font-weight:${on?700:500};transition:all .12s">${f.label}</button>`;
  }).join('');

  const bfChips=BODY_FONTS.map((f,i)=>{
    const on=S.bfi===i;const paired=pairing.includes(f.label)&&!on;
    const bg=on?PINK_T:paired?'#fdf0f7':'#fff';
    const bd=on?PINK:paired?'#f0c8e0':'#e0e0e0';
    return`<button onclick="S.bfi=${i};render()" style="background:${bg};border:1.5px solid ${bd};color:${on?PINK:'#555'};padding:4px 11px;border-radius:5px;cursor:pointer;font-size:12px;font-family:${f.v};font-weight:${on?700:400};transition:all .12s">${f.label}${paired?' ✦':''}</button>`;
  }).join('');

  const pairingLabel=pairing.length?`<div style="font-size:10px;color:#bbb;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Pairs well with ${tf.label} <span style="color:#f0c8e0">✦</span></div>`:'';

  const sliderRow=`<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:14px">
    ${mkSlider('weight',S.titleWeight,300,900,100,'','S.titleWeight=+this.value;render()',80)}
    ${mkSlider('tracking',S.letterSpacing,-0.05,0.2,0.01,'em','S.letterSpacing=+this.value;render()',70)}
  </div>`;

  const lpSizeH={small:20,medium:24,large:32}[S.logoSize]||24;
  const logoPreviewContent=`
    <div style="height:${lpSizeH+4}px;display:flex;align-items:center;overflow:clip;background:#f7f7f7;border:1px solid #eee;border-radius:6px;padding:0 10px">
      ${logoContent(lpSizeH,titleColor,tf)}
    </div>`;

  const typoRows=[
    {fn:'st.title()',    fam:bf.v, sz:28, fw:700,           sp:0,              color:titleColor, outline:false,      text:S.titleText||'Insights'},
    {fn:'st.header()',   fam:bf.v, sz:22, fw:700,           sp:0,              color:h2Color,    outline:false,      text:'Data pipeline overview'},
    {fn:'st.subheader()',fam:bf.v, sz:17, fw:600,           sp:0,              color:h3Color,    outline:false,      text:'Configuration'},
    {fn:'st.text()',     fam:bf.v, sz:14, fw:400,           sp:0,              color:d.full&&getSurface(S.mode).appText, outline:false, text:'Run your pipelines, HTTP calls, IaC, and monitoring inside the platform.'},
    {fn:'st.caption()',  fam:bf.v, sz:12, fw:400,           sp:0,              color:getSurface(S.mode).appTextDim, outline:false, text:'Last updated · March 2026 · pythia-for-snowflake'},
  ].map(r=>`<div style="padding:6px 0;border-bottom:1px solid #f5f5f5">
    <div style="font-size:9px;color:#bbb;font-family:'Courier New',monospace;letter-spacing:.06em;margin-bottom:3px">${r.fn}</div>
    <div style="font-family:${r.fam};font-size:${r.sz}px;font-weight:${r.fw};letter-spacing:${r.sp}em;line-height:1.3;${r.outline?`-webkit-text-stroke:${S.outlineSize}px ${r.color};color:transparent`:`color:${r.color}`}">${r.text}</div>
  </div>`).join('');

  return`<div class="pop-hdr"><div><div class="pop-title">Font</div><div class="pop-sub">Logo font (st.logo()) + body font (AppFont). Pairings highlighted when title changes.</div></div>${closeHtml}</div>
  <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:22px;padding-top:32px">
      <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:28px 24px 22px;margin-top:7px">
        <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Font logo</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">${tfChips}</div>
        ${sliderRow}
        <div style="display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
          <span style="font-size:10px;color:#bbb;letter-spacing:.08em;text-transform:uppercase">outline</span>
          <button onclick="S.outlineOn=!S.outlineOn;render()" class="hbtn${S.outlineOn?' on':''}" style="min-width:36px;padding:3px 10px">${S.outlineOn?'on':'off'}</button>
          ${S.outlineOn?mkSlider('',S.outlineSize,1,8,1,'px','S.outlineSize=+this.value;render()',60):''}
        </div>
      </div>
      <div style="position:relative;border:1.5px solid #e8e8e8;border-radius:10px;padding:28px 24px 22px;margin-top:7px">
        <div style="position:absolute;top:-7px;left:12px;background:#fff;padding:0 4px;font-size:10px;letter-spacing:.12em;color:#bbb;text-transform:uppercase;font-weight:700">Font body (AppFont)</div>
        ${pairingLabel}
        <div style="display:flex;flex-wrap:wrap;gap:5px">${bfChips}</div>
      </div>
    </div>
    <div style="padding-top:32px">
      <div class="blk2">Logo preview · st.logo(size='${S.logoSize}')</div>
      ${logoPreviewContent}
      <div class="blk2" style="margin-top:22px">Typography</div>
      ${typoRows}
    </div>
  </div>`;
}
