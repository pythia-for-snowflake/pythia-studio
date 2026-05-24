const DOCS = [
  {
    id:"sf-core", name:"core API", icon:"❄️", logo:"../../assets/images/snowflake-logo.png", tag:"latest · python",
    desc:"Snowflake Python API — manage Snowflake objects (databases, schemas, tables, warehouses, tasks…) programmatically via snowflake.core.",
    url:"https://docs.snowflake.com/en/developer-guide/snowflake-python-api/snowflake-python-overview",
    pages:[
      {label:"Guide",         url:"https://docs.snowflake.com/en/developer-guide/snowflake-python-api/snowflake-python-overview"},
      {label:"API Reference", url:"https://docs.snowflake.com/en/developer-guide/snowflake-python-api/reference/latest/index"},
    ]
  },
  {
    id:"snowpark", name:"Snowpark", icon:"🐍", logo:"../../assets/images/snowflake-logo.png", tag:"latest · python",
    desc:"Snowpark Python — DataFrame API, stored procedures, UDFs and ML pipelines running natively inside Snowflake.",
    url:"https://docs.snowflake.com/en/developer-guide/snowpark/python/index",
    pages:[
      {label:"Developer Guide",    url:"https://docs.snowflake.com/en/developer-guide/snowpark/python/index"},
      {label:"API Reference",      url:"https://docs.snowflake.com/en/developer-guide/snowpark/reference/python/latest/index"},
      {label:"DataFrame",          url:"https://docs.snowflake.com/en/developer-guide/snowpark/reference/python/latest/snowpark/dataframe"},
      {label:"Functions",          url:"https://docs.snowflake.com/en/developer-guide/snowpark/reference/python/latest/snowpark/functions"},
      {label:"Session",            url:"https://docs.snowflake.com/en/developer-guide/snowpark/reference/python/latest/snowpark/session"},
      {label:"Types",              url:"https://docs.snowflake.com/en/developer-guide/snowpark/reference/python/latest/snowpark/types"},
      {label:"Stored Procedures",  url:"https://docs.snowflake.com/en/developer-guide/stored-procedure/stored-procedures-python"},
    ]
  },
  {
    id:"streamlit", name:"Streamlit", icon:"🎈", logo:"../../assets/images/streamlit-logo.png", tag:"1.52 · SiS",
    desc:"Streamlit API reference and Streamlit in Snowflake (SiS) guide — components, layouts, session state, widgets.",
    url:"https://docs.streamlit.io/develop/api-reference",
    pages:[
      {label:"API Reference",            url:"https://docs.streamlit.io/develop/api-reference"},
      {label:"Streamlit in Snowflake",   url:"https://docs.snowflake.com/en/developer-guide/streamlit/about-streamlit"},
      {label:"Caching & state",           url:"https://docs.streamlit.io/develop/api-reference/caching-and-state"},
      {label:"Limitations SiS",          url:"https://docs.snowflake.com/en/developer-guide/streamlit/limitations"},
      {label:"Troubleshooting SiS",      url:"https://docs.snowflake.com/en/developer-guide/streamlit/troubleshooting"},
    ]
  },
  {
    id:"telemetry", name:"Telemetry", icon:"📡", logo:"../../assets/images/snowflake-logo.png", tag:"latest · python",
    desc:"Snowflake event tables, OpenTelemetry tracing and logging for Snowpark stored procedures and UDFs.",
    url:"https://docs.snowflake.com/en/developer-guide/logging-tracing/logging-tracing-overview",
    pages:[
      {label:"Overview",             url:"https://docs.snowflake.com/en/developer-guide/logging-tracing/logging-tracing-overview"},
      {label:"Event table overview", url:"https://docs.snowflake.com/en/developer-guide/logging-tracing/event-table-setting-up"},
      {label:"Tracing — Python",     url:"https://docs.snowflake.com/en/developer-guide/logging-tracing/tracing-python"},
      {label:"Logging — Python",     url:"https://docs.snowflake.com/en/developer-guide/logging-tracing/logging-python"},
    ]
  },
  {
    id:"python", name:"Python 3.11", icon:"🐍", logo:"../../assets/images/python-logo.png", tag:"3.11 · stdlib",
    desc:"Python 3.11 standard library — the version pinned across the pythia-for-snowflake suite.",
    url:"https://docs.python.org/3.11/library/index.html",
    pages:[
      {label:"stdlib index",    url:"https://docs.python.org/3.11/library/index.html"},
      {label:"dataclasses",     url:"https://docs.python.org/3.11/library/dataclasses.html"},
      {label:"typing",          url:"https://docs.python.org/3.11/library/typing.html"},
      {label:"functools",       url:"https://docs.python.org/3.11/library/functools.html"},
      {label:"pathlib",         url:"https://docs.python.org/3.11/library/pathlib.html"},
      {label:"datetime",        url:"https://docs.python.org/3.11/library/datetime.html"},
      {label:"logging",         url:"https://docs.python.org/3.11/library/logging.html"},
      {label:"math",            url:"https://docs.python.org/3.11/library/math.html"},
    ]
  },
  {
    id:"plotly", name:"Plotly", icon:"📊", tag:"5.24 · python",
    desc:"Plotly Python — interactive charts. Version 5.24.1 pinned (available in Snowflake package catalog).",
    url:"https://plotly.com/python/",
    pages:[
      {label:"Getting started",      url:"https://plotly.com/python/"},
      {label:"Graph Objects API",    url:"https://plotly.com/python-api-reference/plotly.graph_objects.html"},
      {label:"Express API",          url:"https://plotly.com/python-api-reference/plotly.express.html"},
      {label:"Bar charts",           url:"https://plotly.com/python/bar-charts/"},
      {label:"Line charts",          url:"https://plotly.com/python/line-charts/"},
      {label:"Pie / Donut",          url:"https://plotly.com/python/pie-charts/"},
      {label:"Layout & themes",      url:"https://plotly.com/python/figure-factories/"},
    ]
  },
  {
    id:"pandas", name:"Pandas", icon:"🐼", tag:"latest · python",
    desc:"Pandas — the data manipulation library used by Snowpark .to_pandas() and data loaders.",
    url:"https://pandas.pydata.org/docs/user_guide/index.html",
    pages:[
      {label:"User Guide",        url:"https://pandas.pydata.org/docs/user_guide/index.html"},
      {label:"API Reference",     url:"https://pandas.pydata.org/docs/reference/index.html"},
      {label:"DataFrame",         url:"https://pandas.pydata.org/docs/reference/frame.html"},
      {label:"Series",            url:"https://pandas.pydata.org/docs/reference/series.html"},
      {label:"GroupBy",           url:"https://pandas.pydata.org/docs/reference/groupby.html"},
      {label:"IO (read/write)",   url:"https://pandas.pydata.org/docs/reference/io.html"},
    ]
  },
  {
    id:"duckdb", name:"DuckDB", icon:"🐤", tag:"latest · python · sql",
    desc:"DuckDB — in-process analytical SQL engine. Local backend for Pythia QueryFile and snowflake-kit-streamlit local mode. Reads CSV, Parquet, XLSX, S3, HTTP natively.",
    url:"https://duckdb.org/docs/stable/sql/introduction",
    pages:[
      {label:"SQL introduction",       url:"https://duckdb.org/docs/stable/sql/introduction"},
      {label:"SQL reference",          url:"https://duckdb.org/docs/stable/sql/query_syntax/select"},
      {label:"Data import overview",   url:"https://duckdb.org/docs/stable/data/overview"},
      {label:"CSV import",             url:"https://duckdb.org/docs/stable/data/csv/overview"},
      {label:"Parquet import",         url:"https://duckdb.org/docs/stable/data/parquet/overview"},
      {label:"Excel extension",        url:"https://duckdb.org/docs/stable/extensions/excel"},
      {label:"HTTPFS extension",       url:"https://duckdb.org/docs/stable/extensions/httpfs/overview"},
      {label:"Python API",             url:"https://duckdb.org/docs/stable/clients/python/overview"},
      {label:"Metadata — DESCRIBE",    url:"https://duckdb.org/docs/stable/guides/meta/describe"},
    ]
  },
  {
    id:"anthropic", name:"Anthropic", icon:"🤖", logo:"../../assets/images/anthropic-logo-orange.png", tag:"latest · API",
    desc:"Anthropic Claude API — models, tool use, Claude Code CLI and SDK for building AI-powered workflows.",
    url:"https://docs.anthropic.com/en/api/getting-started",
    pages:[
      {label:"API getting started",  url:"https://docs.anthropic.com/en/api/getting-started"},
      {label:"Messages API",         url:"https://docs.anthropic.com/en/api/messages"},
      {label:"Tool use",             url:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"},
      {label:"Models",               url:"https://docs.anthropic.com/en/docs/about-claude/models/overview"},
      {label:"Claude Code — CLI",    url:"https://docs.anthropic.com/en/docs/claude-code/overview"},
      {label:"Agent SDK",            url:"https://docs.anthropic.com/en/docs/claude-code/sdk"},
      {label:"MCP",                  url:"https://docs.anthropic.com/en/docs/claude-code/mcp"},
    ]
  },
];

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

renderSidebar();
