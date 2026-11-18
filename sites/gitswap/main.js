// Replays a real session captured from the CLI (sandboxed HOME, sample identities).
/** @param {string} active @param {string} list */
const menu = (active, list) => `<span class="h">Git Profile Manager</span>
-------------------
Active Profile: <span class="ok">${active}</span>

Available Profiles:
${list}

Commands:
<span class="k">1)</span> Select profile
<span class="k">2)</span> Create new profile
<span class="k">3)</span> Delete profile
<span class="k">4)</span> Exit

Enter command (1-4): `;
const screens = [
  menu('work', '* 1) work\n  2) personal') + '1',
  menu('work', '* 1) work\n  2) personal') + '1\nEnter profile number: 2',
  menu('work', '* 1) work\n  2) personal') + '1\nEnter profile number: 2\n<span class="ok">Successfully activated profile: personal</span>',
  menu('personal', '  1) work\n* 2) personal'),
];
const t = /** @type {HTMLElement} */ (document.getElementById('t'));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let i = 0;
const show = () => { t.innerHTML = screens[i] + '<span class="cur"> </span>'; i = (i + 1) % screens.length; };
show(); if (!reduce) setInterval(show, 1600); else { i = 3; show(); }
