from pathlib import Path
import re

app = Path('timeline-app/app.js')
s = app.read_text(encoding='utf-8')


def replace_once(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'{label} target not found')
    s = s.replace(old, new, 1)


replace_once(
"""    if (year <= -10_000) {
      const years = Math.abs(year);
      if (years >= 1_000_000) return `≈${trimNumber(years / 1_000_000)} million years ago`;
      const rounded = Math.round(years / 1000) * 1000;
      return `≈${rounded.toLocaleString()} years ago`;
    }""",
"""    if (year <= -10_000) {
      // Timeline dates are signed astronomical years (schema: negative = BCE).
      // Keep the display faithful to the stored coordinate instead of silently
      // reinterpreting a BCE year as a years-before-present measurement.
      const magnitude = Math.abs(year);
      if (magnitude >= 1_000_000) return `≈${trimNumber(magnitude / 1_000_000)} million BCE`;
      const rounded = Math.round(magnitude / 1000) * 1000;
      return `≈${rounded.toLocaleString()} BCE`;
    }""",
'deep-time formatter',
)

replace_once(
"""  function claimLane(claim) {
    return (claim.region || []).find((lane) => state.lanes.has(lane)) || null;
  }

  function visibleClaims() {
    return claims.filter((claim) => {
      if (!state.layers.has(claim.subject_type)) return false;
      if (!claimLane(claim)) return false;
      if (!overlaps(claimDate(claim))) return false;
      return matchesQuery(claim);
    });
  }""",
"""  function claimLane(claim) {
    return (claim.region || []).find((lane) => state.lanes.has(lane)) || null;
  }

  function zoomLevel(value) {
    const match = /^Z([0-7])$/.exec(String(value || ''));
    return match ? Number(match[1]) : null;
  }

  function visibleAtZoom(claim) {
    const min = zoomLevel(claim.zoom_min);
    const max = zoomLevel(claim.zoom_max);
    if (min === null || max === null) return true;
    return state.zoom >= Math.min(min, max) && state.zoom <= Math.max(min, max);
  }

  function laneWindowClaims(lane) {
    return claims.filter((claim) => claimLane(claim) === lane && visibleAtZoom(claim) && overlaps(claimDate(claim)));
  }

  function visibleClaims() {
    return claims.filter((claim) => {
      if (!visibleAtZoom(claim)) return false;
      if (!state.layers.has(claim.subject_type)) return false;
      if (!claimLane(claim)) return false;
      if (!overlaps(claimDate(claim))) return false;
      return matchesQuery(claim);
    });
  }""",
'zoom visibility',
)

replace_once(
"""      const absence = laneItems.length ? '' : '<div class="lane-absence">Not represented in the current filtered dataset. Coverage status is unknown; no historical absence is inferred.</div>';""",
"""      const baseItems = laneWindowClaims(lane);
      const filteredOut = !laneItems.length && baseItems.length > 0;
      const absence = laneItems.length ? '' : filteredOut
        ? '<div class="lane-absence filtered">Items in this lane and time window are hidden by the current search or layer filters. <button class="inline-reset" type="button" data-clear-display-filters>Show hidden items</button></div>'
        : '<div class="lane-absence">Not represented in the current dataset at this zoom and time window. Coverage status is unknown; no historical absence is inferred.</div>';""",
'timeline empty state',
)

replace_once(
"""      const content = laneItems.length ? `<div class="list-claims">${laneItems.map((claim) => `<button class="list-claim" type="button" data-claim-id="${escapeHtml(claim.id)}"><strong>${escapeHtml(entityLabel(claim.subject_id))}</strong><span>${escapeHtml(claim.statement)}</span><small>${escapeHtml(formatRange(claimDate(claim)))} · ${escapeHtml(claim.confidence || 'UNKNOWN')} · ${escapeHtml(claim.subject_type || 'Unknown')}</small></button>`).join('')}</div>` : '<p class="muted">Not represented in the current filtered dataset. Coverage status is unknown.</p>';""",
"""      const baseItems = laneWindowClaims(lane);
      const content = laneItems.length
        ? `<div class="list-claims">${laneItems.map((claim) => `<button class="list-claim" type="button" data-claim-id="${escapeHtml(claim.id)}"><strong>${escapeHtml(entityLabel(claim.subject_id))}</strong><span>${escapeHtml(claim.statement)}</span><small>${escapeHtml(formatRange(claimDate(claim)))} · ${escapeHtml(claim.confidence || 'UNKNOWN')} · ${escapeHtml(claim.subject_type || 'Unknown')}</small></button>`).join('')}</div>`
        : baseItems.length
          ? '<p class="muted">Items are hidden by the current search or layer filters. <button class="inline-reset" type="button" data-clear-display-filters>Show hidden items</button></p>'
          : '<p class="muted">Not represented in the current dataset at this zoom and time window. Coverage status is unknown; no historical absence is inferred.</p>';""",
'list empty state',
)

replace_once(
"""    $('visible-summary').textContent = `${items.length} visible claim${items.length === 1 ? '' : 's'} · ${state.lanes.size} lane${state.lanes.size === 1 ? '' : 's'}`;""",
"""    $('visible-summary').textContent = `${items.length} visible claim${items.length === 1 ? '' : 's'} · ${state.lanes.size} lane${state.lanes.size === 1 ? '' : 's'} · Z${state.zoom}`;""",
'zoom summary',
)

replace_once(
"""  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-claim-id]');
    if (trigger) openInspector(trigger.dataset.claimId, { origin: trigger });
  });""",
"""  document.addEventListener('click', (event) => {
    const clear = event.target.closest('[data-clear-display-filters]');
    if (clear) {
      state.query = '';
      state.layers = new Set(allLayers);
      render();
      syncUrl('replace');
      say('Search and layer filters cleared.');
      return;
    }
    const trigger = event.target.closest('[data-claim-id]');
    if (trigger) openInspector(trigger.dataset.claimId, { origin: trigger });
  });""",
'display filter reset',
)

app.write_text(s, encoding='utf-8')

css = Path('timeline-app/styles.css')
c = css.read_text(encoding='utf-8')
if '.lane-absence.filtered{' not in c:
    c += """
.lane-absence.filtered{background:var(--accent-soft);color:var(--text);border-style:solid;gap:.5rem;flex-wrap:wrap}
.inline-reset{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:.3rem .55rem;border:1px solid var(--accent);border-radius:8px;background:var(--panel);color:var(--accent);font-weight:700;font-size:.72rem}
"""
css.write_text(c, encoding='utf-8')

print('TIMELINE_METHOD_PATCH=APPLIED')
