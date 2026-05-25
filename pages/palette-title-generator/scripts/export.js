function buildExportPop(closeHtml){
  const d=getDerived();const{lightFull,assigned}=d;
  const tf=TITLE_FONTS[S.tfi],bf=BODY_FONTS[S.bfi];
  const matchedPreset=PRESETS.find(p=>assigned.primary?.toLowerCase()===p.primary.toLowerCase()&&assigned.secondary?.toLowerCase()===p.secondary.toLowerCase()&&assigned.tertiary?.toLowerCase()===p.tertiary.toLowerCase());
  const bodyIsDefault=S.bfi===0;

  const optRow=(id,label,sub)=>`<label style="display:flex;align-items:flex-start;gap:9px;padding:7px 0;cursor:pointer">
    <span onclick="exportOpts['${id}']=!exportOpts['${id}'];renderPops()" style="width:17px;height:17px;border-radius:4px;flex-shrink:0;margin-top:1px;border:1.5px solid ${exportOpts[id]?PINK:'#ccc'};background:${exportOpts[id]?PINK:'#fff'};display:flex;align-items:center;justify-content:center;transition:all .12s">
      ${exportOpts[id]?`<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`:''}
    </span>
    <span style="font-size:12px;color:#555;line-height:1.5"><strong>${label}</strong> — ${sub}</span>
  </label>`;

  const gfUrl=`https://fonts.google.com/specimen/${bf.label.replace(/ /g,'+')}`;
  const selectedCount=[
    exportOpts.palette,
    !bodyIsDefault&&exportOpts.appfont,
    exportOpts.wide,
    exportOpts.icon,
    !bodyIsDefault&&exportOpts.woff2,
  ].filter(Boolean).length;
  const py=generatePython();

  const actionBtns=[
    exportOpts.palette?{icon:'content_copy',label:'Copy Python snippet',fn:`copyPython(this)`}:null,
    exportOpts.wide?{icon:'download',label:`Wide logo PNG · ${S.emojiVendor}`,fn:`downloadPng('wide')`}:null,
    exportOpts.icon?{icon:'crop_square',label:`Icon PNG · ${S.emojiVendor}`,fn:`downloadPng('icon')`}:null,
    !bodyIsDefault&&exportOpts.woff2?{icon:'open_in_new',label:`Google Fonts — ${bf.label} (woff2)`,fn:`window.open('${gfUrl}','_blank')`}:null,
  ].filter(Boolean).map(b=>`<button onclick="${b.fn}" style="background:#fff;border:1.5px solid #e0e0e0;color:#1a1a1a;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;font-family:inherit;text-align:left;display:flex;align-items:center;gap:8px;transition:all .12s">
    <span style="font-family:'Material Symbols Rounded';font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20;font-size:17px;line-height:1;color:#888;flex-shrink:0">${b.icon}</span>${b.label}
  </button>`).join('');

  return`<div class="pop-hdr"><div><div class="pop-title">Export</div><div class="pop-sub">Python snippet · PNG assets · pick what you need</div></div>${closeHtml}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start">
    <div style="padding-top:32px">
      <div class="blk2">Pick deliverables</div>
      ${optRow('palette','Palette code',`Palette(light=PaletteColors(…))`)}
      ${bodyIsDefault
        ?`<label style="display:flex;align-items:flex-start;gap:9px;padding:7px 0;opacity:.38;pointer-events:none">
            <span style="width:17px;height:17px;border-radius:4px;flex-shrink:0;margin-top:1px;border:1.5px solid #ccc;background:#fff"></span>
            <span style="font-size:12px;color:#555;line-height:1.5"><strong>AppFont code</strong> — only emitted if body font ≠ DM Sans <em>(currently default — nothing to emit)</em></span>
          </label>`
        :optRow('appfont','AppFont code',`AppFont(family="${bf.label}", woff2_path=…)`)}
      ${optRow('wide','Wide logo PNG','emoji + title, for st.logo(image=…)')}
      ${optRow('icon','Icon PNG','square emoji-only, for st.logo(icon_image=…)')}
      ${bodyIsDefault
        ?`<label style="display:flex;align-items:flex-start;gap:9px;padding:7px 0;opacity:.38;pointer-events:none">
            <span style="width:17px;height:17px;border-radius:4px;flex-shrink:0;margin-top:1px;border:1.5px solid #ccc;background:#fff"></span>
            <span style="font-size:12px;color:#555;line-height:1.5"><strong>woff2 download link</strong> — body font self-host file <em>(no custom font selected)</em></span>
          </label>`
        :optRow('woff2','woff2 download link',`body font self-host file`)}
      <div style="margin-top:12px;padding:10px 12px;background:#fafafa;border:1px solid #eee;border-radius:6px;font-size:11px;line-height:1.7;color:#555">
        <strong>Summary:</strong> ${selectedCount} item${selectedCount!==1?'s':''} selected —
        emoji vendor: <strong>${S.emojiVendor}</strong>, title font: <strong>${tf.label}</strong>, body font: <strong>${bf.label}</strong>.
      </div>
    </div>
    <div>
      <div class="blk2">Actions</div>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:14px">${actionBtns}</div>
      <div class="blk2">Python preview</div>
      <pre style="font-size:10.5px;line-height:1.7;white-space:pre;overflow-x:auto;color:#555;padding:12px 14px;background:#fff;border:1px solid #eee;border-radius:6px;max-height:240px;font-family:'Courier New',monospace">${py}</pre>
    </div>
  </div>`;
}

// ═══ PNG EXPORT ════════════════════════════════════════════════════════
function generatePython(){
  const d=getDerived();const{lightFull,assigned}=d;
  const bf=BODY_FONTS[S.bfi];
  const bodyIsDefault=S.bfi===0;
  const hasFont=!bodyIsDefault&&exportOpts.appfont;
  const matchedPreset=PRESETS.find(p=>assigned.primary?.toLowerCase()===p.primary.toLowerCase()&&assigned.secondary?.toLowerCase()===p.secondary.toLowerCase()&&assigned.tertiary?.toLowerCase()===p.tertiary.toLowerCase());
  const customSem=Object.entries(SEM_DEF).filter(([k,v])=>lightFull[k]&&lightFull[k].toLowerCase()!==v.toLowerCase());
  const brandLines=['primary','secondary','tertiary'].filter(k=>lightFull[k]).map(k=>`        ${k}="${lightFull[k]}",`);
  const semLines=customSem.map(([k])=>`        ${k}="${lightFull[k]}",`);
  const fontBlock=hasFont?`MY_FONT = AppFont(\n    family="${bf.label}",\n    woff2_path="./assets/fonts/${bf.label.replace(/ /g,'')}.woff2",\n    weight="400 700",\n)\n\n`:'';
  const fontArg=hasFont?', font=MY_FONT':'';
  if(matchedPreset){
    const imp=`PALETTES, setup_page${hasFont?', AppFont':''}`;
    return`from snowflake_kit_streamlit import ${imp}\n\n${fontBlock}# Named preset — no inline declaration needed.\n# setup_page(session, palette=PALETTES.${matchedPreset.id.toUpperCase()}${fontArg})`;
  }
  const imp=`Palette, PaletteColors, setup_page${hasFont?', AppFont':''}`;
  return`from snowflake_kit_streamlit import ${imp}\n\n${fontBlock}MY_PALETTE = Palette(\n    light=PaletteColors(\n${[...brandLines,...semLines].join('\n')}\n    ),\n    # dark auto-computed by _auto_dark_color.\n)\n\n# setup_page(session, palette=MY_PALETTE${fontArg})`;
}
function copyPython(btn){
  navigator.clipboard?.writeText(generatePython());
  const orig=btn.innerHTML;btn.innerHTML=btn.innerHTML.replace(/>[^<]+</,'>✓ copied<');btn.style.borderColor=PINK;btn.style.color=PINK;
  setTimeout(()=>{btn.innerHTML=orig;btn.style.borderColor='#e0e0e0';btn.style.color='#1a1a1a';},1600);
}
async function downloadPng(kind){
  const d=getDerived();const sigColor=toReadable(d.assigned.primary||S.sig,'#ffffff');
  const tf=TITLE_FONTS[S.tfi];const SCALE=5;
  const sizeH={small:20,medium:24,large:32}[S.logoSize]||24;
  const canvasH=sizeH*SCALE;
  const fam=tf.v.split(',')[0].replace(/'/g,'').trim();

  // Load raster icon based on logo mode
  let emojiImg=null;
  if(S.logoMode==='emoji'&&S.emojiVendor!=='native'&&S.selectedEmoji){
    try{emojiImg=await new Promise((res,rej)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>res(img);img.onerror=rej;img.src=vendorURL(S.selectedEmoji,S.emojiVendor);});}catch(e){console.warn('emoji load fallback',e);}
  }
  let iconImg=null;
  if(S.logoMode==='image'){
    const src=S.logoImageSrc==='disk'?S.logoImageData:S.logoImageUrl;
    if(src){try{iconImg=await new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=src;});}catch(e){console.warn('image load fallback',e);}}
  }

  const hasI=S.logoMode!=='text'&&(iconImg||emojiImg||(S.logoMode==='emoji'&&S.selectedEmoji)||S.logoMode==='material');
  function drawIcon(ctx,x,y,sz){
    const img=iconImg||emojiImg;
    if(img){
      const ar=img.naturalWidth/img.naturalHeight;
      const dw=ar>=1?sz:sz*ar, dh=ar>=1?sz/ar:sz;
      ctx.drawImage(img,x+(sz-dw)/2,y+(sz-dh)/2,dw,dh);
    }
    else if(S.logoMode==='emoji'&&S.selectedEmoji){ctx.font=`${sz}px Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif`;ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle=sigColor;ctx.fillText(S.selectedEmoji,x,y+sz/2);}
    else if(S.logoMode==='material'){ctx.font=`${sz}px 'Material Symbols Rounded'`;ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle=sigColor;ctx.fillText(S.materialIcon,x,y+sz/2);}
  }

  const measC=document.createElement('canvas'),measCtx=measC.getContext('2d');

  if(kind==='icon'){
    const fs=Math.round(sizeH*0.5)*SCALE;
    measCtx.font=`${S.titleWeight} ${fs}px ${fam},sans-serif`;
    measCtx.letterSpacing=(S.letterSpacing*fs)+'px';
    const m=measCtx.measureText(S.titleText||'App');
    const asc=Math.ceil(m.actualBoundingBoxAscent),textH=asc+Math.ceil(m.actualBoundingBoxDescent);
    const canvas=document.createElement('canvas');canvas.width=textH;canvas.height=textH;
    const ctx=canvas.getContext('2d');
    if(hasI){drawIcon(ctx,0,0,textH);}
    else{ctx.font=`${S.titleWeight} ${fs}px ${fam},sans-serif`;ctx.fillStyle=sigColor;ctx.textBaseline='alphabetic';ctx.textAlign='center';ctx.fillText((S.titleText||'A')[0].toUpperCase(),textH/2,asc);}
    trigDl(canvas,`icon-${S.logoMode}.png`);return;
  }

  // Wide: auto-scale font so glyph height fills canvasH exactly
  let fs=canvasH;
  measCtx.font=`${S.titleWeight} ${fs}px ${fam},sans-serif`;
  measCtx.letterSpacing=(S.letterSpacing*fs)+'px';
  const m0=measCtx.measureText(S.titleText||'App');
  const h0=Math.ceil(m0.actualBoundingBoxAscent)+Math.ceil(m0.actualBoundingBoxDescent);
  fs=Math.floor(fs*canvasH/h0);
  measCtx.font=`${S.titleWeight} ${fs}px ${fam},sans-serif`;
  measCtx.letterSpacing=(S.letterSpacing*fs)+'px';
  const metrics=measCtx.measureText(S.titleText||'App');
  const tw=metrics.width;
  const asc=Math.ceil(metrics.actualBoundingBoxAscent);
  const textH=asc+Math.ceil(metrics.actualBoundingBoxDescent);

  const eW=hasI?textH:0,gapPx=hasI?S.emojiGap*SCALE:0;
  const padX=20*SCALE,canvas=document.createElement('canvas');
  canvas.width=S.sidebarWidth*SCALE;canvas.height=canvasH;
  const ctx=canvas.getContext('2d');
  const vOff=Math.round((canvasH-textH)/2);
  let ex=padX,tx=padX;
  if(hasI){if(S.emojiPos==='before'){ex=padX;tx=padX+eW+gapPx;}else{tx=padX;ex=padX+tw+gapPx;}}
  if(hasI){drawIcon(ctx,ex,vOff,textH);}
  ctx.font=`${S.titleWeight} ${fs}px ${fam},sans-serif`;ctx.letterSpacing=(S.letterSpacing*fs)+'px';
  ctx.fillStyle=sigColor;ctx.textBaseline='alphabetic';ctx.textAlign='left';
  ctx.fillText(S.titleText||'App',tx,vOff+asc);
  trigDl(canvas,`wide-${S.logoMode}.png`);
}
function trigDl(canvas,name){const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();document.body.removeChild(a);}
