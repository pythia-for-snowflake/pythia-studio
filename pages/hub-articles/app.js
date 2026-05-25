const GIST_RAW_URL = 'https://gist.githubusercontent.com/gcwxfcchvz-source/f1b86f55e7ec008146c56417cc342815/raw/articles.json';

const SECTIONS = ['security','quality','cost','arch','distrib'];

async function fetchPreview(url) {
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&timeout=6000`);
    const json = await res.json();
    if (json.status === 'success') return json.data;
  } catch(e) {}
  return null;
}

function renderCard(a, data) {
  const title = data?.title || a.title;
  const desc  = data?.description || a.desc;
  const img   = data?.image?.url || null;
  return `
    <a class="preview-card" href="${a.url}" target="_blank">
      ${img
        ? `<img class="preview-img" src="${img}" alt="" loading="lazy" onerror="this.outerHTML='<div class=preview-img-placeholder>📝</div>'">`
        : `<div class="preview-img-placeholder">📝</div>`}
      <div class="preview-body">
        <span class="preview-tag">${a.tag}</span>
        <div class="preview-title">${title}</div>
        <div class="preview-desc">${desc}</div>
        <div class="preview-meta">${a.author}</div>
        <span class="preview-arrow">read →</span>
      </div>
    </a>`;
}

async function init() {
  const res = await fetch(GIST_RAW_URL);
  const articles = await res.json();

  for (const sectionId of SECTIONS) {
    const container = document.getElementById(sectionId);
    if (!container) continue;
    const items = articles.filter(a => a.section === sectionId);
    if (!items.length) { container.innerHTML = ''; continue; }
    container.innerHTML = '<span class="loading">loading previews…</span>';
    const cards = await Promise.all(items.map(async a => {
      const data = await fetchPreview(a.url);
      return renderCard(a, data);
    }));
    container.innerHTML = cards.join('');
  }
}

init();
