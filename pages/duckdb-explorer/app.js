const SERVER = 'http://localhost:8000';
const PLACEHOLDER = '-- Add a source above to auto-generate the query';

let mode = 'detecting'; // 'backend' | 'wasm'
let wasmDB = null, wasmConn = null;

let lastRows = [];
let lastCols = [];
let nextId = 1;
let sources = [{id: nextId++, alias: 't1', source: ''}];
let previews = {};
let activeTab = null;
let resultTab = null;
let currentUploadRow = 0;
let previewTimers = {};

/* ── mode ── */

function updateModeIndicator() {
  const badge = document.getElementById('mode-badge');
  if (!badge) return;
  if (mode === 'backend') {
    badge.className = 'mode-badge backend';
    badge.textContent = 'backend · :8000';
    const hdr = document.getElementById('src-col-header');
    if (hdr) hdr.textContent = 'Source — local path, S3, or HTTP URL';
  } else if (mode === 'wasm') {
    badge.className = 'mode-badge wasm';
    badge.textContent = 'wasm · browser';
  } else {
    badge.className = 'mode-badge detecting';
    badge.textContent = '…';
  }
}

async function initWasm() {
  try {
    const ddb = await import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.33.1-dev45.0/dist/duckdb-browser-eh.mjs');
    const bundles = ddb.getJsDelivrBundles();
    const bundle = await ddb.selectBundle(bundles);
    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {type: 'text/javascript'})
    );
    const worker = new Worker(workerUrl);
    wasmDB = new ddb.AsyncDuckDB(new ddb.VoidLogger(), worker);
    await wasmDB.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);
    wasmConn = await wasmDB.connect();
  } catch (e) {
    const banner = document.getElementById('banner');
    banner.style.display = 'block';
    document.getElementById('banner-msg').textContent =
      'WASM init failed — ' + e.message + '. Reload to retry, or use the local backend.';
  }
}

async function initMode() {
  try {
    const r = await fetch(`${SERVER}/health`, {signal: AbortSignal.timeout(1500)});
    if (r.ok) { mode = 'backend'; updateModeIndicator(); return; }
  } catch {}
  mode = 'wasm';
  updateModeIndicator();
  await initWasm();
}

function arrowToData(table) {
  const columns = table.schema.fields.map(f => f.name);
  const rows = [];
  for (let r = 0; r < table.numRows; r++) {
    const row = [];
    for (let c = 0; c < columns.length; c++) {
      const col = table.getChildAt(c);
      const v = col ? col.get(r) : null;
      if (v === null || v === undefined) row.push(null);
      else if (typeof v === 'bigint') row.push(Number(v));
      else row.push(v);
    }
    rows.push(row);
  }
  return {columns, rows};
}

/* ── setup ── */

function toggleSetup() {
  const body = document.getElementById('setup-body');
  const chev = document.getElementById('setup-chevron');
  const open = body.classList.toggle('open');
  chev.classList.toggle('open', open);
}

function copy(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓';
    btn.classList.add('ok');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('ok'); }, 1500);
  });
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function jsq(s) {
  return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/</g,'\\x3c').replace(/>/g,'\\x3e');
}

/* ── sources table ── */

function renderSources() {
  document.getElementById('sources-tbody').innerHTML = sources.map((s, i) => `
    <tr>
      <td class="src-td">
        <input class="inp" type="text" placeholder="t${i + 1}" value="${esc(s.alias)}"
          oninput="onAliasChange(${i}, this.value)"
          style="font-size:11px;padding:6px 8px">
      </td>
      <td class="src-td">
        <input class="inp" type="text"
          placeholder="${mode === 'backend' ? '/Users/me/data.xlsx  ·  s3://bucket/key.parquet  ·  https://…' : 'upload ↑  or  https://…'}"
          value="${esc(s.source)}"
          oninput="onSourceChange(${i}, this.value)"
          style="font-size:11px;padding:6px 8px">
      </td>
      <td class="src-td" style="width:36px;text-align:center">
        <button class="src-upload" onclick="pickFile(${i})" title="Pick local file">+</button>
      </td>
      <td class="src-td" style="width:32px;text-align:center">
        ${sources.length > 1
          ? `<button class="src-del" onclick="removeSource(${i})" title="Remove">&times;</button>`
          : ''}
      </td>
    </tr>
  `).join('');
}

function onAliasChange(i, val) {
  sources[i].alias = val.trim();
  const id = sources[i].id;
  if (previews[id]) previews[id].alias = val.trim() || `t${i + 1}`;
  updateSQL();
  renderTabContainer();
}

function onSourceChange(i, val) {
  sources[i].source = val.trim();
  updateSQL();
  if (val.trim()) {
    schedulePreview(i);
  } else {
    clearTimeout(previewTimers[sources[i].id]);
    delete previews[sources[i].id];
    renderTabContainer();
  }
}

function addSource() {
  const id = nextId++;
  sources.push({id, alias: `t${sources.length + 1}`, source: ''});
  renderSources();
}

function removeSource(i) {
  const removed = sources.splice(i, 1)[0];
  clearTimeout(previewTimers[removed.id]);
  delete previews[removed.id];
  if (activeTab === String(removed.id)) activeTab = null;
  renderSources();
  updateSQL();
  renderTabContainer();
}

window.pickFile = function (i) {
  currentUploadRow = i;
  document.getElementById('file-picker').click();
};

/* ── format detection ── */

function detectFormat(src) {
  const s = src.split('?')[0].toLowerCase();
  if (s.endsWith('.xlsx') || s.endsWith('.xls')) return 'xlsx';
  if (s.endsWith('.csv') || s.endsWith('.tsv')) return 'csv';
  if (s.endsWith('.parquet')) return 'parquet';
  if (s.endsWith('.json') || s.endsWith('.ndjson') || s.endsWith('.jsonl')) return 'json';
  return 'auto';
}

function srcToFn(src) {
  const fmt = detectFormat(src);
  const q = `'${src.replace(/'/g, "''")}'`;
  return ({
    xlsx:    `read_xlsx(${q})`,
    csv:     `read_csv(${q}, auto_detect=true)`,
    parquet: `read_parquet(${q})`,
    json:    `read_json(${q})`,
    auto:    q,
  })[fmt];
}

/* ── type helpers ── */

function typeIcon(colType) {
  const t = String(colType).toUpperCase();
  if (/INT|BIGINT|HUGEINT|TINYINT|SMALLINT|FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL/.test(t)) return 'tag';
  if (/VARCHAR|TEXT|STRING|CHAR|CLOB/.test(t)) return 'text_fields';
  if (/TIMESTAMP|DATETIME/.test(t)) return 'schedule';
  if (/DATE/.test(t)) return 'calendar_today';
  if (/BOOL/.test(t)) return 'toggle_on';
  if (/JSON|STRUCT|MAP|LIST|ARRAY|OBJECT/.test(t)) return 'data_object';
  return 'tag';
}

function shortType(colType) {
  return String(colType).replace(/\(.*\)/, '').toUpperCase();
}

/* ── SQL generation ── */

function updateSQL() {
  const active = sources.filter(s => s.source);
  if (!active.length) {
    document.getElementById('sql').value = PLACEHOLDER;
    return;
  }
  if (active.length === 1) {
    const s = active[0];
    document.getElementById('sql').value =
      `SELECT *\nFROM ${srcToFn(s.source)} AS ${s.alias || 't1'}\nLIMIT 100`;
    return;
  }
  const ctes = active.map(s =>
    `  ${s.alias || 't'} AS (\n    SELECT * FROM ${srcToFn(s.source)}\n  )`
  ).join(',\n');
  const a = active[0].alias || 't1';
  const b = active[1].alias || 't2';
  document.getElementById('sql').value =
    `WITH\n${ctes}\n\nSELECT *\nFROM ${a}\nJOIN ${b} ON ${a}.id = ${b}.id\nLIMIT 100`;
}

/* ── preview ── */

function schedulePreview(i) {
  const s = sources[i];
  if (!s) return;
  clearTimeout(previewTimers[s.id]);
  previewTimers[s.id] = setTimeout(() => fetchPreview(s.id), 700);
}

async function fetchPreview(id) {
  const s = sources.find(x => x.id === id);
  if (!s || !s.source) { delete previews[id]; renderTabContainer(); return; }

  if (mode === 'wasm' && s.source.startsWith('s3://')) {
    previews[id] = {
      loading: false, alias: s.alias || 't',
      err_desc: 'S3 requires the local backend — see Local setup above.',
      cols_data: null, rows_data: null, rows_desc: null, colStats: {},
    };
    if (!activeTab) setActiveTab(String(id));
    renderTabContainer();
    return;
  }

  previews[id] = {loading: true, alias: s.alias || 't'};
  if (!activeTab) setActiveTab(String(id));
  renderTabContainer();

  const fn = srcToFn(s.source);
  let cols_desc = null, rows_desc = null, err_desc = null;
  let cols_data = null, rows_data = null, err_data = null;

  try {
    const desc = await postQuery(`DESCRIBE SELECT * FROM ${fn} LIMIT 1`);
    cols_desc = desc.columns;
    rows_desc = desc.rows;
    const ncols = rows_desc.length;
    const orderBy = ncols > 0
      ? ' ORDER BY ' + Array.from({length: Math.min(3, ncols)}, (_, i) => i + 1).join(', ')
      : '';
    try {
      const data = await postQuery(`SELECT * FROM ${fn}${orderBy} LIMIT 10`);
      cols_data = data.columns;
      rows_data = data.rows;
    } catch (e) { err_data = e.message; }
  } catch (e) { err_desc = e.message; }

  previews[id] = {loading: false, alias: s.alias || 't', cols_desc, rows_desc, err_desc, cols_data, rows_data, err_data, colStats: {}};
  renderTabContainer();
}

async function postQuery(sql) {
  if (mode === 'backend') {
    const resp = await fetch(`${SERVER}/query`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({sql}),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Server error');
    return data;
  } else {
    if (!wasmConn) throw new Error('DuckDB WASM not ready — reload the page');
    const table = await wasmConn.query(sql);
    return arrowToData(table);
  }
}

/* ── column stats ── */

window.fetchColStats = async function (sourceId, colName) {
  const id = Number(sourceId);
  const p = previews[id];
  if (!p) return;
  if (!p.colStats) p.colStats = {};
  if (p.colStats[colName] && !p.colStats[colName].loading) {
    delete p.colStats[colName];
    renderTabContainer();
    return;
  }
  const s = sources.find(x => x.id === id);
  if (!s) return;
  p.colStats[colName] = {loading: true};
  renderTabContainer();
  const fn = srcToFn(s.source);
  const qc = `"${colName.replace(/"/g, '""')}"`;
  try {
    const data = await postQuery(
      `SELECT COUNT(${qc}) AS cnt, COUNT(DISTINCT ${qc}) AS uniq, ` +
      `MIN(${qc}) AS mn, MAX(${qc}) AS mx FROM ${fn}`
    );
    const r = data.rows[0] || [];
    p.colStats[colName] = {loading: false, cnt: r[0], uniq: r[1], mn: r[2], mx: r[3]};
  } catch (e) {
    p.colStats[colName] = {loading: false, error: e.message};
  }
  renderTabContainer();
};

/* ── table rendering ── */

function fmtStat(v) {
  if (v === null || v === undefined) return '<span style="color:#ccc">—</span>';
  return esc(String(v));
}

function enhancedTable(cols, rows, rows_desc, id) {
  if (!cols || !cols.length) return '<div style="color:#bbb;font-size:11px;padding:16px">No data</div>';
  const p = previews[id];
  const typeMap = {};
  if (rows_desc) rows_desc.forEach(r => { typeMap[r[0]] = r[1]; });
  const hasStats = p && p.colStats && Object.keys(p.colStats).length > 0;
  let html = '<div class="tbl-wrap"><table><thead><tr class="hdr-col">';
  cols.forEach(c => {
    const t = typeMap[c] || '';
    const stats = p && p.colStats && p.colStats[c];
    const active = stats && !stats.loading;
    html += `<th><div class="col-hdr">`;
    html += `<span class="c-name">${esc(String(c))}</span>`;
    html += `<span class="c-type" title="${esc(shortType(t))}"><span class="ms">${typeIcon(t)}</span></span>`;
    html += `<button class="stats-btn${active ? ' active' : ''}" onclick="fetchColStats(${id},'${jsq(c)}')" title="${active ? 'Hide stats' : 'Column stats'}"><span class="ms">query_stats</span></button>`;
    html += `</div></th>`;
  });
  html += '</tr>';
  if (hasStats) {
    html += '<tr class="hdr-sv">';
    cols.forEach(c => {
      const stats = p.colStats[c];
      if (!stats) { html += '<th class="empty"></th>'; return; }
      if (stats.loading) { html += '<th style="color:#bbb;font-size:10px">…</th>'; return; }
      if (stats.error) { html += `<th style="color:#b91c1c;font-size:10px">${esc(stats.error)}</th>`; return; }
      html += `<th><div class="sv-grid">`;
      html += `<div class="sv-item"><span class="sv-lbl">count</span><span class="sv-val">${fmtStat(stats.cnt)}</span></div>`;
      html += `<div class="sv-item"><span class="sv-lbl">distinct</span><span class="sv-val">${fmtStat(stats.uniq)}</span></div>`;
      html += `<div class="sv-item"><span class="sv-lbl">min</span><span class="sv-val">${fmtStat(stats.mn)}</span></div>`;
      html += `<div class="sv-item"><span class="sv-lbl">max</span><span class="sv-val">${fmtStat(stats.mx)}</span></div>`;
      html += `</div></th>`;
    });
    html += '</tr>';
  }
  html += '</thead><tbody>';
  (rows || []).forEach(row => {
    html += '<tr>';
    row.forEach(v => { const s = v === null ? '' : String(v); html += `<td title="${esc(s)}">${esc(s)}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function miniTable(cols, rows) {
  if (!cols || !cols.length) return '<div style="color:#bbb;font-size:11px;padding:16px">No data</div>';
  let html = '<div class="tbl-wrap"><table><thead><tr>';
  cols.forEach(c => { html += `<th>${esc(String(c))}</th>`; });
  html += '</tr></thead><tbody>';
  rows.forEach(row => {
    html += '<tr>';
    row.forEach(v => { const s = v === null ? '' : String(v); html += `<td title="${esc(s)}">${esc(s)}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

/* ── tabs ── */

window.setActiveTab = function (tab) { activeTab = tab; renderTabContainer(); };

function renderTabContainer() {
  const container  = document.getElementById('tab-container');
  const tabBar     = document.getElementById('tab-bar');
  const tabContent = document.getElementById('tab-content');
  const previewSources = sources.filter(s => s.source && previews[s.id] !== undefined);
  const hasResult = resultTab !== null;
  if (!previewSources.length && !hasResult) { container.style.display = 'none'; return; }
  container.style.display = 'block';
  const validTabs = [...previewSources.map(s => String(s.id)), hasResult ? 'result' : null].filter(Boolean);
  if (!activeTab || !validTabs.includes(activeTab)) activeTab = validTabs[0] || null;
  let tabHtml = '';
  previewSources.forEach(s => {
    const p = previews[s.id];
    const isActive = activeTab === String(s.id);
    tabHtml += `<button class="tab-btn${isActive ? ' active' : ''}${p.loading ? ' loading' : ''}" onclick="setActiveTab('${s.id}')">${esc(p.alias || 't')}${p.loading ? ' …' : ''}</button>`;
  });
  if (hasResult) tabHtml += `<button class="tab-btn tab-result${activeTab === 'result' ? ' active' : ''}" onclick="setActiveTab('result')">result</button>`;
  tabBar.innerHTML = tabHtml;
  let paneHtml = '';
  previewSources.forEach(s => {
    const p = previews[s.id];
    const isActive = activeTab === String(s.id);
    paneHtml += `<div class="tab-pane${isActive ? ' active' : ''}">`;
    if (p.loading) { paneHtml += `<div style="color:#bbb;font-size:11px;padding:16px">Loading preview…</div>`; }
    else if (p.err_desc) { paneHtml += `<div style="color:#b91c1c;font-size:11px;padding:16px">${esc(p.err_desc)}</div>`; }
    else {
      const cols = p.cols_data || (p.rows_desc ? p.rows_desc.map(r => r[0]) : []);
      paneHtml += enhancedTable(cols, p.err_data ? [] : (p.rows_data || []), p.rows_desc, s.id);
      if (p.err_data) paneHtml += `<div style="color:#b91c1c;font-size:11px;padding:8px 16px 14px">${esc(p.err_data)}</div>`;
    }
    paneHtml += '</div>';
  });
  if (hasResult) {
    const isActive = activeTab === 'result';
    paneHtml += `<div class="tab-pane${isActive ? ' active' : ''}">`;
    if (resultTab.error) { paneHtml += `<div style="color:#b91c1c;font-size:11px;white-space:pre-wrap;padding:16px">${esc(resultTab.error)}</div>`; }
    else {
      const n = resultTab.rows.length;
      paneHtml += miniTable(resultTab.cols, resultTab.rows);
      paneHtml += `<div class="meta"><span><span class="dot"></span>${n} row${n !== 1 ? 's' : ''}</span><span>${resultTab.cols.length} col${resultTab.cols.length !== 1 ? 's' : ''}</span></div>`;
    }
    paneHtml += '</div>';
  }
  tabContent.innerHTML = paneHtml;
}

/* ── status ── */

function setStatus(type, msg) {
  const el = document.getElementById('status');
  if (!type) { el.style.display = 'none'; el.innerHTML = ''; return; }
  el.className = 'status ' + type;
  if (type === 'loading') { el.innerHTML = `<div class="spinner"></div><span>${msg}</span>`; el.style.display = 'flex'; }
  else { el.textContent = msg; el.style.display = 'block'; }
}

/* ── run / clear / export ── */

async function runQuery() {
  const sql = document.getElementById('sql').value.trim();
  if (!sql || sql === PLACEHOLDER) { setStatus('error', 'SQL is empty'); return; }
  setStatus('loading', 'Running…');
  document.getElementById('export-btn').style.display = 'none';
  try {
    const data = await postQuery(sql);
    lastCols = data.columns; lastRows = data.rows;
    resultTab = {cols: data.columns, rows: data.rows};
    const n = data.rows.length;
    setStatus('ok', `${n} row${n !== 1 ? 's' : ''}`);
    if (n > 0) document.getElementById('export-btn').style.display = 'inline-flex';
    activeTab = 'result';
    renderTabContainer();
  } catch (e) {
    const msg = (mode === 'backend' && e.message.includes('Failed to fetch'))
      ? 'Cannot reach server — is uvicorn running on port 8000?' : e.message;
    setStatus('error', msg);
    resultTab = {cols: [], rows: [], error: msg};
    activeTab = 'result';
    renderTabContainer();
  }
}
window.runQuery = runQuery;

window.clearAll = function () {
  Object.values(previewTimers).forEach(clearTimeout);
  sources = [{id: nextId++, alias: 't1', source: ''}];
  previews = {}; activeTab = null; resultTab = null;
  lastRows = []; lastCols = []; previewTimers = {};
  renderSources(); renderTabContainer();
  document.getElementById('sql').value = PLACEHOLDER;
  document.getElementById('export-btn').style.display = 'none';
  setStatus('', '');
};

window.exportCsv = function () {
  if (!lastRows.length) return;
  const lines = [lastCols.map(csvCell).join(',')];
  lastRows.forEach(row => lines.push(row.map(v => csvCell(v === null ? '' : String(v))).join(',')));
  const blob = new Blob([lines.join('\n')], {type: 'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `duckdb-export-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

function csvCell(v) {
  const s = String(v ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n')) ? `"${s.replace(/"/g, '""')}"` : s;
}

/* ── init ── */

document.addEventListener('DOMContentLoaded', function () {
  renderSources();

  document.getElementById('file-picker').addEventListener('change', async function () {
    const file = this.files[0];
    if (!file) return;
    const i = currentUploadRow;
    const btn = document.getElementById('sources-tbody').querySelectorAll('.src-upload')[i];
    if (btn) { btn.textContent = '…'; btn.disabled = true; }
    try {
      if (mode === 'backend') {
        const fd = new FormData();
        fd.append('file', file);
        const resp = await fetch(`${SERVER}/upload`, {method: 'POST', body: fd});
        const data = await resp.json();
        if (!resp.ok) { setStatus('error', data.error || 'Upload failed'); return; }
        sources[i].source = data.path;
      } else {
        const ab = await file.arrayBuffer();
        let buf = new Uint8Array(ab);
        const ext = file.name.split('.').pop().toLowerCase();
        let vname = `src_${Date.now()}.${ext}`;
        if (ext === 'xlsx' || ext === 'xls') {
          const wb = XLSX.read(buf, {type: 'array'});
          const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
          buf = new TextEncoder().encode(csv);
          vname = `src_${Date.now()}.csv`;
        }
        await wasmDB.registerFileBuffer(vname, buf);
        sources[i].source = vname;
      }
      renderSources(); updateSQL(); fetchPreview(sources[i].id);
    } catch (e) {
      setStatus('error', mode === 'backend'
        ? 'Upload failed — is the server running?' : `File load failed: ${e.message}`);
    } finally {
      if (btn) { btn.textContent = '+'; btn.disabled = false; }
      this.value = '';
    }
  });
});

initMode();
