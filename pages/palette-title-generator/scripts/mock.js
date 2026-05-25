function handleLogoFile(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{S.logoImageData=e.target.result;render();};
  reader.readAsDataURL(file);
}

function logoContent(sizeH,titleColor,tf){
  const imgSz=Math.round(sizeH*0.85),fontSz=Math.round(sizeH*0.5);
  const stroke=S.outlineOn?`-webkit-text-stroke:${S.outlineSize}px ${titleColor};color:transparent`:`color:${titleColor}`;
  let iconHtml='';
  if(S.logoMode==='text'){
    /* text-only: iconHtml stays empty, no gap */
  } else if(S.logoMode==='emoji'){
    iconHtml=emojiHtml(S.selectedEmoji,S.emojiVendor,imgSz);
  } else if(S.logoMode==='image'){
    const imgSrcVal=S.logoImageSrc==='disk'?S.logoImageData:S.logoImageUrl;
    if(imgSrcVal)iconHtml=`<img src="${imgSrcVal}" style="max-height:${imgSz}px;width:auto;object-fit:contain" onerror="this.style.opacity='.25'">`;
  } else if(S.logoMode==='material'){
    iconHtml=`<span style="font-family:'Material Symbols Rounded';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-size:${imgSz}px;color:${titleColor};line-height:1;display:inline-block">${S.materialIcon||'auto_awesome'}</span>`;
  }
  const titleSpan=`<span style="font-family:${tf.v};font-size:${fontSz}px;font-weight:${S.titleWeight};${stroke};letter-spacing:${S.letterSpacing}em;white-space:nowrap;line-height:1">${S.titleText||'MY APP'}</span>`;
  const gap=iconHtml?S.emojiGap:0;
  return`<div style="display:inline-flex;align-items:center;gap:${gap}px">
    ${S.emojiPos==='before'&&iconHtml?iconHtml:''}${titleSpan}${S.emojiPos==='after'&&iconHtml?iconHtml:''}
  </div>`;
}

function buildSidebar(s,primary,titleColor,tf,bf){
  const e=S.selectedEmoji,g=S.emojiGap;
  if(!S.sidebarOpen)return`<div style="width:56px;background:${s.sidebarBg};padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:12px;border-right:1px solid ${s.divider};flex-shrink:0">
    ${emojiHtml(e,S.emojiVendor,36)}
    <div style="flex:1"></div>
    <button onclick="S.sidebarOpen=true;render()" style="background:transparent;border:1px solid ${s.border};color:${s.appTextDim};padding:3px 6px;border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit">›</button>
  </div>`;

  const navLinks=[['Dashboard','dashboard'],['Reports','analytics'],['Data sources','storage'],['Settings','settings']];
  const navHtml=navLinks.map(([l,icon],i)=>`<div onclick="" style="padding:7px 10px;border-radius:6px;font-size:13px;display:flex;align-items:center;gap:10px;color:${i===0?primary:s.appText};background:${i===0?primary+'1f':'transparent'};font-weight:${i===0?600:400};cursor:pointer;font-family:${bf.v};transition:background .12s">
    <span class="msr" style="font-size:18px">${icon}</span>${l}</div>`).join('');

  const logoSizeH={small:20,medium:24,large:32}[S.logoSize]||24;
  const logoHtml=`<div style="height:${logoSizeH+4}px;display:flex;align-items:center;overflow:clip">${logoContent(logoSizeH,titleColor,tf)}</div>`;

  return`<div style="width:260px;background:${s.sidebarBg};padding:18px 14px;display:flex;flex-direction:column;gap:12px;border-right:1px solid ${s.divider};flex-shrink:0">
    ${logoHtml}
    <div style="height:1px;background:${s.divider}"></div>
    <div style="font-size:11px;color:${s.appTextDim};letter-spacing:.08em;text-transform:uppercase;padding:0 6px;font-family:${bf.v}">Pages</div>
    <div style="display:flex;flex-direction:column;gap:2px">${navHtml}</div>
    <div style="flex:1"></div>
    <button onclick="S.sidebarOpen=false;render()" style="background:transparent;border:1px solid ${s.border};color:${s.appTextDim};padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit;align-self:flex-start">‹ collapse</button>
  </div>`;
}

function buildMain(s,primary,full,titleColor,tf,bf,stuckColor){
  const lighter=`color-mix(in oklch,${primary},${S.mode==='dark'?'black 80%':'white 90%'})`;
  const chkBg=W.checked?primary:'#fff',chkBd=W.checked?primary:'#ccc';
  const chkMark=W.checked?`<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`:'';
  const togBg=W.toggle?primary:'#ccc',togX=W.toggle?'calc(100% - 16px)':'2px';

  const radioHtml=['Daily','Weekly','Monthly'].map((l,i)=>{
    const v=String.fromCharCode(97+i),on=W.radio===v;
    return`<div onclick="W.radio='${v}';renderMock()" style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:${s.appText};font-family:${bf.v}">
      <div style="width:16px;height:16px;border-radius:50%;border:2px solid ${on?primary:'#ccc'};background:${on?primary:'#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${on?'<div style="width:6px;height:6px;border-radius:50%;background:#fff"></div>':''}
      </div>${l}</div>`;
  }).join('');

  const tabs=['Overview','Configure','Logs'];
  const tabHtml=tabs.map((t,i)=>`<div onclick="W.tab=${i};renderMock()" style="padding:8px 14px;font-size:13px;cursor:pointer;font-family:${bf.v};color:${W.tab===i?primary:s.appTextDim};border-bottom:2px solid ${W.tab===i?primary:'transparent'};font-weight:${W.tab===i?600:400}">${t}</div>`).join('');

  const fStyle=`width:100%;font-family:${bf.v};font-size:13px;padding:7px 11px;border:1px solid ${s.inputBorder};border-radius:6px;background:${s.inputBg};color:${s.appText};outline:none;box-sizing:border-box`;

  const colL=`<div style="display:flex;flex-direction:column;gap:22px">
    ${grp(s,"button[kind='primary'] · button[kind='tertiary']","",`
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button style="background:${primary};color:#fff;border:1px solid ${primary};border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;cursor:pointer;font-family:${bf.v}">Primary action</button>
        <button style="background:${s.inputBg};color:${s.appText};border:1px solid ${s.inputBorder};border-radius:8px;padding:6px 14px;font-size:13px;cursor:pointer;font-family:${bf.v}">Secondary</button>
        <button style="background:transparent;color:${primary};border:1px solid ${primary};border-radius:8px;padding:6px 14px;font-size:13px;cursor:pointer;font-family:${bf.v}">Tertiary</button>
      </div>`)}
    ${grp(s,"stCheckbox · stToggle · stRadio","",`
      <div style="display:flex;flex-direction:column;gap:9px">
        <div onclick="W.checked=!W.checked;renderMock()" style="display:flex;align-items:center;gap:9px;cursor:pointer">
          <div style="width:17px;height:17px;border-radius:4px;border:1.5px solid ${chkBd};background:${chkBg};display:flex;align-items:center;justify-content:center;flex-shrink:0">${chkMark}</div>
          <span style="font-size:13px;color:${s.appText};font-family:${bf.v}">I agree to the data policy</span>
        </div>
        <div onclick="W.toggle=!W.toggle;renderMock()" style="display:flex;align-items:center;gap:9px;cursor:pointer">
          <div style="width:32px;height:17px;border-radius:9px;background:${togBg};position:relative;flex-shrink:0">
            <div style="width:13px;height:13px;border-radius:50%;background:#fff;position:absolute;top:2px;left:${togX};transition:left .12s"></div>
          </div>
          <span style="font-size:13px;color:${s.appText};font-family:${bf.v}">Enable telemetry</span>
        </div>
        ${radioHtml}
      </div>`)}
    ${grp(s,"stDateInput","Selected-day circle stuck — CSS-in-JS-hashed ::after.",buildDatePickerHtml(s,bf,stuckColor))}
  </div>`;

  const colR=`<div style="display:flex;flex-direction:column;gap:22px">
    ${grp(s,"button[kind='pillsActive'] · button[kind='segmented_controlActive']","",`
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${['Daily','Weekly','Monthly','Yearly'].map((o,i)=>{const on=i===W.pill;return`<button onclick="W.pill=${i};renderMock()" style="background:${on?primary:s.inputBg};color:${on?'#fff':s.appText};border:1px solid ${on?primary:s.inputBorder};border-radius:999px;padding:4px 14px;font-size:12px;cursor:pointer;font-family:${bf.v}">${o}</button>`;}).join('')}
        </div>
        <div style="display:inline-flex;border:1px solid ${s.inputBorder};border-radius:8px;padding:2px;background:${s.inputBg};width:fit-content">
          ${['Code','Plot','Table'].map((o,i)=>{const on=i===W.seg;return`<button onclick="W.seg=${i};renderMock()" style="background:${on?lighter:'transparent'};color:${on?primary:s.appText};border:${on?'1px solid '+primary:'1px solid transparent'};border-radius:6px;padding:3px 12px;font-size:12px;cursor:pointer;font-family:${bf.v};font-weight:${on?600:400}">${o}</button>`;}).join('')}
        </div>
      </div>`)}
    ${grp(s,"stTabs","",`<div style="display:flex;border-bottom:1px solid ${s.border}">${tabHtml}</div>`)}
    ${grp(s,"stTextInput · stSelectbox · stMultiSelect","",`
      <div style="display:flex;flex-direction:column;gap:8px">
        <input placeholder="Focus me — primary border" style="${fStyle}" onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='${s.inputBorder}'">
        <select style="${fStyle};cursor:pointer;appearance:none;-webkit-appearance:none" onfocus="this.style.borderColor='${primary}'" onblur="this.style.borderColor='${s.inputBorder}'">
          <option>Pick a warehouse…</option><option>COMPUTE_WH (XS)</option><option>SERVERLESS</option>
        </select>
        <div style="display:flex;flex-wrap:wrap;gap:5px;padding:6px 8px;border:1px solid ${s.inputBorder};border-radius:6px;background:${s.inputBg};min-height:36px;align-items:center">
          <span style="background:${primary}22;color:${primary};border:1px solid ${primary}44;border-radius:4px;padding:2px 7px;font-size:12px;font-family:${bf.v}">alpha ✕</span>
          <span style="background:${primary}22;color:${primary};border:1px solid ${primary}44;border-radius:4px;padding:2px 7px;font-size:12px;font-family:${bf.v}">beta ✕</span>
          <input placeholder="add…" style="border:none;outline:none;background:transparent;font-size:12px;font-family:${bf.v};color:${s.appText};width:60px">
        </div>
      </div>`)}
    ${grp(s,"stProgress","",`
      <div>
        <div style="height:6px;border-radius:3px;background:${s.border};overflow:hidden">
          <div style="width:62%;height:100%;background:${primary};border-radius:3px"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:${s.appTextDim};margin-top:3px;font-family:${bf.v}"><span>Progress</span><span>62%</span></div>
      </div>`)}
    ${grp(s,"stSlider · stSliderThumbValue","Track fill + thumb stuck to "+(S.env==='sis'?'Snowflake blue (#29b5e8)':'Streamlit red (#ff4b4b)')+" — value label uses --app-text (not --primary).",`
      <div style="padding-top:24px;padding-bottom:4px;position:relative">
        <div style="height:4px;background:${s.inputBorder};border-radius:2px;position:relative">
          <div style="height:4px;width:${W.slider}%;background:${stuckColor};border-radius:2px"></div>
          <div style="position:absolute;top:-8px;left:calc(${W.slider}% - 10px);width:20px;height:20px;border-radius:50%;background:${stuckColor};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:pointer"></div>
          <div style="position:absolute;top:-22px;left:calc(${W.slider}% - 14px);color:${s.appText};font-weight:700;font-size:12px;font-family:${bf.v}">${W.slider}</div>
        </div>
        <input type="range" min="0" max="100" value="${W.slider}" oninput="W.slider=+this.value;renderMock()" style="position:absolute;top:18px;left:0;width:100%;opacity:0;cursor:pointer;margin:0">
      </div>`)}
  </div>`;

  return`<div style="flex:1;padding:40px 48px;overflow-y:auto;color:${s.appText};font-family:${bf.v}">
    <h1 style="font-family:${bf.v};font-size:32px;font-weight:700;color:${titleColor};margin-bottom:8px">${S.titleText||'My Snowflake App'}</h1>
    <p style="color:${s.appTextDim};font-size:14px;margin-bottom:28px;line-height:1.6;max-width:640px">Run your pipelines, HTTP calls, IaC, and monitoring inside the platform — no ETL layer, no external orchestrator.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">${colL}${colR}</div>
  </div>`;
}

function mkSlider(label,val,min,max,step,unit,onchange,width){
  const pct=Math.max(0,Math.min(100,((val-min)/(max-min))*100));
  const disp=unit==='em'?val.toFixed(2):val;
  return`<div style="display:flex;align-items:center;gap:8px">
    <span style="font-size:10px;color:#bbb;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap">${label}</span>
    <div style="position:relative;width:${width||80}px;height:20px">
      <div style="position:absolute;top:8px;left:0;right:0;height:4px;background:#e8e8e8;border-radius:2px">
        <div style="height:4px;width:${pct}%;background:${PINK};border-radius:2px"></div>
        <div style="position:absolute;top:-6px;left:calc(${pct}% - 8px);width:16px;height:16px;border-radius:50%;background:${PINK};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.18)"></div>
      </div>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" oninput="${onchange}" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;cursor:pointer;margin:0">
    </div>
    <span style="font-size:11px;color:#888;white-space:nowrap">${disp}${unit}</span>
  </div>`;
}

function grp(s,label,warn,content){
  return`<div>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
      <code style="background:${s.mutedBg};padding:1px 5px;border-radius:2px;font-size:9px;font-family:'Courier New',monospace;color:${s.appTextDim}">${label}</code>
      ${warn?`<span style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;padding:1px 6px;border-radius:3px;font-size:9px;font-family:'Courier New',monospace;font-weight:700">STUCK</span>`:''}
    </div>
    ${content}
    ${warn?`<div style="font-size:9.5px;color:${s.appTextDim};margin-top:5px;line-height:1.5;font-family:'Courier New',monospace">⚠ ${warn}</div>`:''}
  </div>`;
}

function buildDatePickerHtml(s,bf,stuckColor){
  const hdr=['S','M','T','W','T','F','S'].map(d=>`<div style="color:${s.appTextDim};text-align:center;font-size:10px;font-weight:600;padding:3px 0;font-family:${bf.v}">${d}</div>`).join('');
  const cells=Array.from({length:31},(_,i)=>{const d=i+1,sel=d===14;return`<div style="text-align:center;font-size:12px;padding:5px 2px;border-radius:50%;cursor:pointer;background:${sel?stuckColor:'transparent'};color:${sel?'#fff':s.appText};font-family:${bf.v}">${d}</div>`;}).join('');
  return`<div style="border:1px solid ${s.border};border-radius:8px;padding:12px;background:${s.inputBg};max-width:260px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
      <button style="background:none;border:none;cursor:pointer;color:${s.appTextDim};font-size:18px;line-height:1;padding:0 4px">‹</button>
      <span style="font-size:13px;font-weight:600;color:${s.appText};font-family:${bf.v}">March 2026</span>
      <button style="background:none;border:none;cursor:pointer;color:${s.appTextDim};font-size:18px;line-height:1;padding:0 4px">›</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px">${hdr}${cells}</div>
  </div>`;
}
