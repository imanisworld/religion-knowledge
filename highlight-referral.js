/* highlight-referral.js — loaded by every reader page.
   Reads ?hl=TERM from the URL (set by search.html), highlights all
   text matches in <main>, shows a dismissible count toast. */
(function () {
  const q = new URLSearchParams(location.search).get('hl');
  if (!q) return;

  /* Clean the ?hl= out of the URL bar immediately */
  history.replaceState(null, '', location.pathname + (location.hash || ''));

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return;

  const re = new RegExp(
    '(' + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')',
    'gi'
  );

  let count = 0;

  function walk(node) {
    if (node.nodeType === 3) {
      const t = node.textContent;
      if (!re.test(t)) return;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      t.split(re).forEach((s, i) => {
        if (i % 2 === 1) {
          const m = document.createElement('mark');
          m.textContent = s;
          m.className = 'hl-ref';
          frag.appendChild(m);
          count++;
        } else if (s) {
          frag.appendChild(document.createTextNode(s));
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (
      node.nodeType === 1 &&
      !['MARK', 'SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'NAV'].includes(node.tagName)
    ) {
      [...node.childNodes].forEach(walk);
    }
  }

  function doHighlight() {
    const main = document.querySelector('main') || document.body;
    walk(main);
    if (count === 0) return;

    const style = document.createElement('style');
    style.textContent =
      'mark.hl-ref{background:#FEF9C3;color:inherit;border-radius:2px;padding:0 1px}' +
      '#hl-toast{position:fixed;bottom:5.5rem;right:1.5rem;z-index:100;' +
        'background:#FEF9C3;border:1px solid #D4A017;border-radius:6px;' +
        'padding:.6rem 1rem .6rem .85rem;font-family:monospace;font-size:.78rem;' +
        'box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;align-items:center;' +
        'gap:.75rem;max-width:300px;color:#5a4005}' +
      '#hl-toast strong{color:#3d2c02}' +
      '#hl-toast button{background:none;border:none;cursor:pointer;font-size:1rem;' +
        'padding:0;color:#7A5510;line-height:1;flex-shrink:0;opacity:.7}' +
      '#hl-toast button:hover{opacity:1}';
    document.head.appendChild(style);

    const label = count + ' match' + (count === 1 ? '' : 'es') + ' for “' + q.trim() + '”';
    const toast = document.createElement('div');
    toast.id = 'hl-toast';
    toast.innerHTML =
      '<span>🔍 <strong>' + count + '</strong> match' +
      (count === 1 ? '' : 'es') + ' for “' + escQ(q.trim()) + '”</span>' +
      '<button aria-label="Clear highlights" title="Clear highlights" onclick="' +
        "document.querySelectorAll('mark.hl-ref').forEach(function(m){m.replaceWith(document.createTextNode(m.textContent))});" +
        "this.closest('#hl-toast').remove()" +
      '">×</button>';
    document.body.appendChild(toast);

    /* Scroll first mark into view after layout settles */
    requestAnimationFrame(function () {
      const first = document.querySelector('mark.hl-ref');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function escQ(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doHighlight);
  } else {
    doHighlight();
  }
})();
