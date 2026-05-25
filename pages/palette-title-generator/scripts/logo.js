// ═══ UTILS ════════════════════════════════════════════════════════════
function loadFont(url){if(!url||document.querySelector(`link[href="${url}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=url;document.head.appendChild(l);}
function emojiCPs(e){return[...e].map(c=>c.codePointAt(0)).filter(n=>n!==0xFE0F).map(n=>n.toString(16).padStart(4,'0'));}
function serenityURL(e){return`https://raw.githubusercontent.com/SerenityOS/serenity/master/Base/res/emoji/${emojiCPs(e).map(c=>'U+'+c.toUpperCase()).join('_')}.png`;}
function notoURL(e){return`https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/128/emoji_u${emojiCPs(e).join('_')}.png`;}
function omURL(e){return`https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/${emojiCPs(e).map(c=>c.toUpperCase()).join('-')}.svg`;}
function vendorURL(e,v){return v==='serenity'?serenityURL(e):v==='noto'?notoURL(e):omURL(e);}
function emojiHtml(e,v,sz){
  if(!e)return'';
  if(v==='native')return`<span style="font-size:${sz}px;line-height:1">${e}</span>`;
  const url=vendorURL(e,v);
  const fb=`this.outerHTML='<span style=&quot;font-size:${sz}px;line-height:1&quot;>${e}</span>'`;
  return`<img src="${url}" style="width:${sz}px;height:${sz}px;object-fit:contain" onerror="${fb}">`;
}

function filterEmoji(q){
  if(!q)return EMOJIS;
  const lq=q.toLowerCase().trim();const out={};
  for(const[cat,ems]of Object.entries(EMOJIS)){
    if(cat.toLowerCase().includes(lq)){out[cat]=ems;continue;}
    const m=ems.filter(e=>(EMOJI_KW[e]||'').includes(lq)||e===lq);
    if(m.length)out[cat]=m;
  }
  return out;
}

function buildLogoPop(closeHtml){
  const tf=TITLE_FONTS[S.tfi];
  const d=getDerived();const primary=d.primary;
  const titleColor=toReadable(primary||S.sig,'#ffffff');
  const logoSizeH={small:20,medium:24,large:32}[S.logoSize]||24;
  const surf=getSurface(S.mode);
  const MSR=`font-family:'Material Symbols Rounded';font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20;font-size:16px;line-height:1;display:inline-block`;

  const modePills=[{id:'text',icon:'title',label:'Text'},{id:'emoji',icon:'emoji_language',label:'Emoji'},{id:'material',icon:'interests',label:'Material'},{id:'image',icon:'image',label:'Image'}]
    .map(m=>{const on=S.logoMode===m.id;
      return`<button onclick="S.logoMode='${m.id}';render()" style="display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:6px;border:1.5px solid ${on?PINK:'#e0e0e0'};background:${on?PINK_T:'#fff'};color:${on?PINK:'#888'};cursor:pointer;font-size:11px;font-weight:${on?700:400};font-family:inherit;white-space:nowrap;transition:all .12s">
        <span style="${MSR}">${m.icon}</span>${m.label}</button>`;
    }).join('');
  const hasImage=S.logoMode==='image'&&(S.logoImageSrc==='disk'?S.logoImageData:S.logoImageUrl);
  const removeBtn=hasImage?`<button onclick="S.logoImageSrc==='disk'?(S.logoImageData=null):(S.logoImageUrl='');render()" style="padding:5px 10px;border:1.5px solid #e0e0e0;border-radius:6px;cursor:pointer;font-size:11px;color:#888;background:#fff;font-family:inherit;white-space:nowrap;flex-shrink:0">✕ remove</button>`:'';

  const posBlock=S.logoMode!=='text'?`
    <span style="width:1px;height:14px;background:#e8e8e8;display:inline-block;margin:0 2px"></span>
    <span style="font-size:11px;color:#bbb">position</span>
    <button onclick="S.emojiPos='before';render()" class="hbtn${S.emojiPos==='before'?' on':''}">before</button>
    <button onclick="S.emojiPos='after';render()" class="hbtn${S.emojiPos==='after'?' on':''}">after</button>
    ${mkSlider('gap',S.emojiGap,0,32,2,'px','S.emojiGap=+this.value;render()',70)}`:'';
  const controlsRow=`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <span style="font-size:11px;color:#bbb">size</span>
    ${['small','medium','large'].map(sz=>`<button onclick="S.logoSize='${sz}';render()" class="hbtn${S.logoSize===sz?' on':''}">${sz}<span style="font-size:9px;margin-left:3px;color:${S.logoSize===sz?PINK:'#bbb'}">${{small:20,medium:24,large:32}[sz]}px</span></button>`).join('')}
    ${posBlock}
    <span style="width:1px;height:14px;background:#e8e8e8;display:inline-block;margin:0 2px"></span>
    <span style="font-size:11px;color:#bbb">sidebar</span>
    <input type="number" value="${S.sidebarWidth}" oninput="S.sidebarWidth=Math.max(200,+this.value||336);render()" min="200" max="800"
      style="width:56px;font-size:11px;padding:3px 6px;border:1.5px solid #e0e0e0;border-radius:5px;outline:none;font-family:inherit;color:#1a1a1a">
    <span style="font-size:11px;color:#bbb">px</span>
  </div>`;

  const previewCol=`<div class="blk2">Preview · st.logo(size='${S.logoSize}')</div>
    <div style="background:${surf.sidebar};border-radius:8px;padding:10px 16px;display:flex;align-items:center;min-height:${logoSizeH+20}px;overflow:hidden">
      <div style="height:${logoSizeH+4}px;overflow:clip;display:flex;align-items:center">${logoContent(logoSizeH,titleColor,tf)}</div>
    </div>`;

  let pickerSection='';
  if(S.logoMode==='text'){
    pickerSection=`<div style="font-size:11px;color:#bbb;line-height:1.7">Text only — no icon. The app title above is rendered directly with the selected title font and weight from <strong>Font ▾</strong>.</div>`;
  } else if(S.logoMode==='emoji'){
    const filteredGroups=filterEmoji(emojiSearch);
    const emojiGridHtml=Object.keys(filteredGroups).length===0
      ?`<div style="width:100%;padding:14px 4px;text-align:center;font-size:11px;color:#bbb">No matches for "<strong>${emojiSearch}</strong>".</div>`
      :Object.entries(filteredGroups).map(([cat,ems])=>`
        <div style="width:100%;font-size:10px;color:#bbb;padding:4px 2px 2px;letter-spacing:.08em;text-transform:uppercase">${cat}</div>
        ${ems.map(e=>`<span onclick="S.selectedEmoji='${e}';render()" style="font-size:22px;cursor:pointer;padding:3px;border-radius:5px;line-height:1;border:1.5px solid ${S.selectedEmoji===e?PINK:'transparent'};background:${S.selectedEmoji===e?PINK_T:'transparent'}">${e}</span>`).join('')}`).join('');
    const vendorCards=['native','serenity','noto','openmoji'].map(v=>{
      const labels={native:'Native',serenity:'SerenityOS',noto:'Noto',openmoji:'OpenMoji'};
      const subs={native:'your OS',serenity:'serenityos.org',noto:'Google',openmoji:'Open-source'};
      const on=S.emojiVendor===v;
      const imgHtml=v==='native'?`<span style="font-size:30px;line-height:1">${S.selectedEmoji}</span>`
        :`<img src="${vendorURL(S.selectedEmoji,v)}" style="width:38px;height:38px;object-fit:contain" onerror="this.style.display='none'">`;
      return`<div onclick="S.emojiVendor='${v}';render()" style="background:${on?PINK_T:'#fff'};border:1.5px solid ${on?PINK:'#e0e0e0'};border-radius:8px;padding:8px 10px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .12s">
        <div style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${imgHtml}</div>
        <div><div style="font-size:11px;font-weight:700;color:${on?PINK:'#1a1a1a'}">${labels[v]}</div>
          <div style="font-size:10px;color:#bbb">${subs[v]}</div>
          ${on?`<div style="font-size:9px;color:${PINK};font-weight:700;margin-top:1px">✓ selected</div>`:''}
        </div></div>`;
    }).join('');
    pickerSection=`<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;align-items:start">
      <div>
        <div class="blk2">Pick an emoji</div>
        <input value="${emojiSearch}" oninput="emojiSearch=this.value;renderPops()" placeholder="search — try 'snake', 'data', 'space'…"
          style="width:100%;font-family:inherit;font-size:12px;padding:5px 10px;border:1.5px solid #e0e0e0;border-radius:6px;outline:none;color:#1a1a1a;margin-bottom:6px">
        <div style="display:flex;flex-wrap:wrap;gap:3px;max-height:180px;overflow-y:auto;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:8px">${emojiGridHtml}</div>
      </div>
      <div>
        <div class="blk2">Vendor</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">${vendorCards}</div>
        <div style="padding:8px 10px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:6px;font-size:11px;line-height:1.5">
          💡 For shared apps pick <strong>SerenityOS</strong> or <strong>Noto</strong>.
        </div>
      </div>
    </div>`;
  } else if(S.logoMode==='material'){
    const q=materialIconSearch.toLowerCase();
    const matGridHtml=Object.entries(MATERIAL_ICONS).map(([cat,icons])=>{
      const filtered=q?icons.filter(ic=>ic.includes(q)):icons;
      if(!filtered.length)return'';
      return`<div style="width:100%;font-size:10px;color:#bbb;padding:4px 2px 2px;letter-spacing:.08em;text-transform:uppercase">${cat}</div>
        ${filtered.map(ic=>{const on=S.materialIcon===ic;return`<span title="${ic}" onclick="S.materialIcon='${ic}';render()" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;cursor:pointer;border-radius:6px;border:1.5px solid ${on?PINK:'transparent'};background:${on?PINK_T:'transparent'};transition:all .1s"><span style="font-family:'Material Symbols Rounded';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-size:22px;color:${on?PINK:'#555'};line-height:1">${ic}</span></span>`;}).join('')}`;
    }).join('');
    pickerSection=`<div class="blk2">Pick a Material icon</div>
      <input value="${materialIconSearch}" oninput="materialIconSearch=this.value;renderPops()" placeholder="search — try 'chart', 'data', 'cloud'…"
        style="width:100%;font-family:inherit;font-size:12px;padding:5px 10px;border:1.5px solid #e0e0e0;border-radius:6px;outline:none;color:#1a1a1a;margin-bottom:6px">
      <div style="display:flex;flex-wrap:wrap;gap:2px;max-height:200px;overflow-y:auto;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:8px">${matGridHtml}</div>
      <div style="font-size:10px;color:#bbb;margin-top:6px">Hover to see icon name</div>`;
  } else {
    const isDisk=S.logoImageSrc==='disk';
    const srcToggle=`<div style="display:flex;gap:6px;margin-bottom:10px">
      <button onclick="S.logoImageSrc='disk';render()" class="hbtn${isDisk?' on':''}">from disk</button>
      <button onclick="S.logoImageSrc='url';render()" class="hbtn${!isDisk?' on':''}">from URL</button>
    </div>`;
    let srcInput='';
    if(isDisk){
      const thumbHtml=S.logoImageData
        ?`<div style="margin-top:10px;padding:8px;background:#fafafa;border:1px solid #eee;border-radius:6px;display:flex;align-items:center;justify-content:center;min-height:48px">
            <img src="${S.logoImageData}" style="max-height:64px;max-width:100%;object-fit:contain">
          </div>`:'';
      srcInput=`<label style="display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:${PINK_T};border:1.5px solid ${PINK};border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;color:${PINK}">
        📁 Choose file
        <input type="file" accept="image/*" oninput="handleLogoFile(this)" style="display:none">
      </label>${thumbHtml}`;
    } else {
      const thumbHtml=S.logoImageUrl
        ?`<div style="margin-top:10px;padding:8px;background:#fafafa;border:1px solid #eee;border-radius:6px;display:flex;align-items:center;justify-content:center;min-height:48px">
            <img src="${S.logoImageUrl}" style="max-height:64px;max-width:100%;object-fit:contain" onerror="this.style.opacity='.3'">
          </div>`:'';
      srcInput=`<input value="${S.logoImageUrl}" oninput="S.logoImageUrl=this.value;renderMock()" onchange="render()" placeholder="https://…/logo.png"
        style="width:100%;font-family:inherit;font-size:13px;padding:7px 11px;border:1.5px solid #e0e0e0;border-radius:6px;outline:none;color:#1a1a1a">${thumbHtml}`;
    }
    pickerSection=`${srcToggle}${srcInput}
      <div style="font-size:11px;color:#bbb;margin-top:10px;line-height:1.7">SVG or PNG with transparent background — aspect ratio preserved, constrained to size height.</div>`;
  }

  return`<div class="pop-hdr"><div><div class="pop-title">Logo</div><div class="pop-sub">source · position · size</div></div>${closeHtml}</div>
  <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:20px;margin-bottom:14px;padding-top:32px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:25px">
      <div style="display:flex;gap:6px;align-items:center">
        <div style="display:flex;gap:5px;flex-shrink:0">${modePills}</div>
        <input value="${S.titleText}" oninput="S.titleText=this.value;renderMock()" placeholder="My App"
          style="flex:1;min-width:0;font-family:inherit;font-size:13px;padding:6px 10px;border:1.5px solid #e0e0e0;border-radius:6px;outline:none;color:#1a1a1a">
        ${removeBtn}
      </div>
      ${controlsRow}
    </div>
    <div>${previewCol}</div>
  </div>
  <div style="border-top:1px solid #f0f0f0;padding-top:14px">${pickerSection}</div>`;
}
