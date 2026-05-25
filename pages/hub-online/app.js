const GIST_BASE = 'https://gist.githubusercontent.com/gcwxfcchvz-source/f1b86f55e7ec008146c56417cc342815/raw';

let DOCS = [];
let currentId=null, sidebarCollapsed=false;

function iconHtml(doc, size=18){
  if(doc.logo) return `<img src="${doc.logo}" alt="${doc.name}" height="${size}" style="display:block;object-fit:contain">`;
  return `<span style="font-size:${size}px;line-height:1">${doc.icon}</span>`;
}

function showWelcome(){
  currentId=null;
  document.getElementById('welcome').style.display='';
  document.getElementById('doc-panel').style.display='none';
  document.getElementById('breadcrumb').innerHTML='<span>select a doc to get started</span>';
  renderSidebar(document.getElementById('search-inp').value);
}

function renderSidebar(filter=''){
  const nav=document.getElementById('sidebar-nav');
  nav.innerHTML='';
  const q=filter.toLowerCase();
  DOCS.filter(d=>!q||d.name.toLowerCase().includes(q)||d.desc.toLowerCase().includes(q)).forEach(doc=>{
    const group=document.createElement('div');
    group.className='api-group';
    const isActive=doc.id===currentId;
    const header=document.createElement('div');
    header.className='api-group-header'+(isActive?' active open':'');
    header.innerHTML=`
      <span class="api-icon">${iconHtml(doc,16)}</span>
      <div class="api-info">
        <div class="api-name">${doc.name}</div>
        <span class="api-tag">${doc.tag}</span>
      </div>
      <span class="api-chevron">▶</span>
    `;
    const pages=document.createElement('div');
    pages.className='api-pages'+(isActive?' open':'');
    doc.pages.forEach(p=>{
      const link=document.createElement('div');
      link.className='page-link';
      link.innerHTML=`<span class="page-dot"></span>${p.label}`;
      link.onclick=(e)=>{e.stopPropagation();window.open(p.url,'_blank');};
      pages.appendChild(link);
    });
    header.onclick=()=>{
      header.classList.toggle('open');
      pages.classList.toggle('open');
      showDoc(doc.id);
    };
    group.appendChild(header);
    group.appendChild(pages);
    nav.appendChild(group);
  });
  renderWelcomeGrid();
}

function renderWelcomeGrid(){
  const grid=document.getElementById('welcome-grid');
  grid.innerHTML='';
  DOCS.forEach(doc=>{
    const card=document.createElement('div');
    card.className='wcard';
    card.innerHTML=`<div class="wcard-icon">${iconHtml(doc,28)}</div><div class="wcard-name">${doc.name}</div><div class="wcard-desc">${doc.tag}</div>`;
    card.onclick=()=>showDoc(doc.id);
    grid.appendChild(card);
  });
}

function showDoc(id){
  currentId=id;
  const doc=DOCS.find(d=>d.id===id);
  if(!doc)return;
  document.getElementById('welcome').style.display='none';
  const panel=document.getElementById('doc-panel');
  panel.style.display='block';
  const pagesHtml=doc.pages.map(p=>`
    <div class="page-row">
      <div class="page-row-dot"></div>
      <div class="page-row-label">${p.label}</div>
      <a class="page-row-link" href="${p.url}" target="_blank" rel="noopener">open ↗</a>
    </div>`).join('');
  panel.innerHTML=`
    <div class="doc-card">
      <div class="doc-card-header">
        <div class="doc-card-icon">${iconHtml(doc,32)}</div>
        <div class="doc-card-meta">
          <div class="doc-card-name">${doc.name}</div>
          <div class="doc-card-tag">${doc.tag}</div>
          <div class="doc-card-desc">${doc.desc}</div>
        </div>
        <a class="open-btn" href="${doc.url}" target="_blank" rel="noopener">open ↗</a>
      </div>
      ${doc.pages.length?`<div class="divider"></div><div class="pages-title">Pages</div><div class="pages-grid">${pagesHtml}</div>`:''}
    </div>`;
  document.getElementById('breadcrumb').innerHTML=`<span>${doc.name}</span>`;
  renderSidebar(document.getElementById('search-inp').value);
}

function toggleSidebar(){
  sidebarCollapsed=!sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed',sidebarCollapsed);
  document.getElementById('collapse-btn').textContent=sidebarCollapsed?'▶':'◀';
}

async function init() {
  const res = await fetch(`${GIST_BASE}/docs.json`);
  DOCS = await res.json();
  renderSidebar();
}

init();
