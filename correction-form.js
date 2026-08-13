/* correction-form.js — loaded by every reader page.
   Adds a floating "Correct this" button that opens a slide-up form.
   Submissions are routed to a pre-filled GitHub issue. */
(function () {
  const REPO = 'imanisworld/religion-knowledge';
  const EMAIL = 'imanicrumble@yahoo.com';

  const pageTitle = document.title.replace(' — Bible Deep Dive', '').trim();
  const pageUrl = location.href;

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent =
    '#cf-btn{position:fixed;bottom:1.5rem;left:1.5rem;z-index:99;' +
      'background:#1F5E5B;color:#fff;border:none;border-radius:6px;' +
      'padding:.45rem .75rem;font-size:.78rem;font-family:monospace;' +
      'cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.22);' +
      'display:flex;align-items:center;gap:.35rem;white-space:nowrap;' +
      'transition:background .15s}' +
    '#cf-btn:hover{background:#17504D}' +
    '#cf-overlay{display:none;position:fixed;inset:0;z-index:100;' +
      'background:rgba(0,0,0,.35)}' +
    '#cf-overlay.cf-open{display:block}' +
    '#cf-panel{position:fixed;bottom:0;left:0;right:0;z-index:101;' +
      'background:#fff;border-top:2px solid #1F5E5B;border-radius:12px 12px 0 0;' +
      'padding:1.25rem 1.5rem 1.5rem;max-height:85vh;overflow-y:auto;' +
      'transform:translateY(100%);transition:transform .25s ease;' +
      'font-family:system-ui,sans-serif}' +
    '#cf-panel.cf-open{transform:translateY(0)}' +
    '@media(min-width:640px){' +
      '#cf-panel{left:auto;right:1.5rem;bottom:1.5rem;width:420px;' +
        'border:2px solid #1F5E5B;border-radius:10px;max-height:90vh;' +
        'box-shadow:0 8px 32px rgba(0,0,0,.18);transform:translateY(calc(100% + 2rem))}}' +
    '#cf-panel h3{margin:0 0 .9rem;font-size:1rem;color:#17201D;' +
      'display:flex;align-items:center;justify-content:space-between}' +
    '#cf-panel h3 button{background:none;border:none;font-size:1.2rem;' +
      'cursor:pointer;color:#7A8582;padding:0;line-height:1}' +
    '#cf-panel label{display:block;font-size:.8rem;font-weight:600;' +
      'color:#4A5551;margin:.7rem 0 .25rem}' +
    '#cf-panel input,#cf-panel textarea,#cf-panel select{' +
      'width:100%;box-sizing:border-box;border:1px solid #D3D8D4;' +
      'border-radius:5px;padding:.45rem .6rem;font-size:.87rem;' +
      'font-family:inherit;color:#17201D;background:#fff;resize:vertical}' +
    '#cf-panel input:focus,#cf-panel textarea:focus{' +
      'outline:2px solid #1F5E5B;outline-offset:1px;border-color:#1F5E5B}' +
    '#cf-panel .cf-row{display:flex;gap:.6rem;margin-top:1rem}' +
    '#cf-panel .cf-row button{flex:1;padding:.5rem .6rem;border-radius:5px;' +
      'font-size:.85rem;font-weight:600;cursor:pointer;border:none;' +
      'transition:background .15s}' +
    '#cf-submit{background:#1F5E5B;color:#fff}' +
    '#cf-submit:hover{background:#17504D}' +
    '#cf-cancel{background:#F0F3F1;color:#4A5551;border:1px solid #D3D8D4!important}' +
    '#cf-cancel:hover{background:#E3EDEC}' +
    '#cf-alt{margin-top:.75rem;font-size:.75rem;color:#7A8582;text-align:center}' +
    '#cf-alt a{color:#1F5E5B}';
  document.head.appendChild(style);

  /* ── Button ── */
  const btn = document.createElement('button');
  btn.id = 'cf-btn';
  btn.innerHTML = '&#9998; Correct this';
  btn.title = 'Submit a correction or flag something that needs editing';

  /* ── Overlay ── */
  const overlay = document.createElement('div');
  overlay.id = 'cf-overlay';

  /* ── Panel ── */
  const panel = document.createElement('div');
  panel.id = 'cf-panel';
  panel.innerHTML =
    '<h3>Submit a correction' +
      '<button id="cf-close" title="Close">×</button>' +
    '</h3>' +
    '<label for="cf-name">Your name (optional)</label>' +
    '<input id="cf-name" type="text" placeholder="Anonymous">' +
    '<label for="cf-section">Section or passage</label>' +
    '<input id="cf-section" type="text" placeholder="e.g. §6.3, Isaiah 7:14, &ldquo;Markan priority&rdquo;">' +
    '<label for="cf-problem">What&rsquo;s wrong or needs editing</label>' +
    '<textarea id="cf-problem" rows="3" placeholder="Describe the error or the part that seems off&hellip;"></textarea>' +
    '<label for="cf-fix">Suggested correction (optional)</label>' +
    '<textarea id="cf-fix" rows="2" placeholder="If you have a source or better wording&hellip;"></textarea>' +
    '<div class="cf-row">' +
      '<button id="cf-cancel">Cancel</button>' +
      '<button id="cf-submit">Open as GitHub issue &#8594;</button>' +
    '</div>' +
    '<p id="cf-alt">No GitHub? <a id="cf-email-link" href="#">Email it instead</a></p>';

  document.body.appendChild(btn);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  function open() {
    overlay.classList.add('cf-open');
    panel.classList.add('cf-open');
    panel.querySelector('#cf-section').focus();
  }

  function close() {
    overlay.classList.remove('cf-open');
    panel.classList.remove('cf-open');
  }

  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  panel.querySelector('#cf-close').addEventListener('click', close);
  panel.querySelector('#cf-cancel').addEventListener('click', close);

  panel.querySelector('#cf-submit').addEventListener('click', function () {
    const name    = panel.querySelector('#cf-name').value.trim();
    const section = panel.querySelector('#cf-section').value.trim();
    const problem = panel.querySelector('#cf-problem').value.trim();
    const fix     = panel.querySelector('#cf-fix').value.trim();

    if (!problem) {
      panel.querySelector('#cf-problem').focus();
      return;
    }

    const titleParts = ['[Correction]', pageTitle];
    if (section) titleParts.push('— ' + section);
    const issueTitle = titleParts.join(' ');

    const bodyLines = [
      '**Page:** ' + pageTitle,
      '**URL:** ' + pageUrl,
      section ? '**Section:** ' + section : null,
      '',
      '**What’s wrong:**',
      problem,
      fix ? '\n**Suggested correction:**\n' + fix : null,
      name ? '\n*Submitted by: ' + name + '*' : null,
    ].filter(l => l !== null);

    const url = 'https://github.com/' + REPO + '/issues/new' +
      '?title=' + encodeURIComponent(issueTitle) +
      '&body=' + encodeURIComponent(bodyLines.join('\n'));

    window.open(url, '_blank', 'noopener');
    close();
  });

  /* Update email fallback link dynamically based on form state */
  panel.querySelector('#cf-email-link').addEventListener('click', function (e) {
    e.preventDefault();
    const section = panel.querySelector('#cf-section').value.trim();
    const problem = panel.querySelector('#cf-problem').value.trim();
    const fix     = panel.querySelector('#cf-fix').value.trim();

    const subject = 'Correction: ' + pageTitle + (section ? ' — ' + section : '');
    const body = [
      'Page: ' + pageUrl,
      section ? 'Section: ' + section : null,
      '',
      problem || '(describe the issue here)',
      fix ? '\nSuggested correction:\n' + fix : null,
    ].filter(l => l !== null).join('\n');

    location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });

  /* Keyboard: Esc closes the panel */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('cf-open')) close();
  });
})();
