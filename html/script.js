/* Universal Hallucination | Ra7 DEV | Dev by: Abudaqa | https://discord.gg/Zk5CrhHYe | MIT
   NUI: overlay effects, dialogue, resist mini-games, possession ribbon, cues, and the admin panel.
   No external libraries, no network requests except the local sound files and the resource callbacks. */
'use strict';

const RES = (typeof GetParentResourceName === 'function') ? GetParentResourceName() : 'universal_hallucination';
const $ = (s, r = document) => r.querySelector(s);
const root = document.documentElement;
let cfg = { texts: {}, brand: { colors: {} }, dialogue: {}, sounds: { enabled: true, master: 0.9 }, rtl: true, lang: 'ar' };

function post(name, data) {
  try {
    return fetch(`https://${RES}/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify(data || {}) }).catch(() => {});
  } catch (e) { /* preview without game */ }
}

/** Element builder: h('div', {class:'x', onclick:fn}, child, 'text') */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  return el;
}
const svg = (inner, cls) => h('span', { class: 'svgw', html: `<svg viewBox="0 0 24 24" ${cls ? `class="${cls}"` : ''}>${inner}</svg>` }).firstChild;
const T = (k, ...a) => fmt((cfg.texts && cfg.texts[k]) || k, ...a);
function fmt(s, ...a) { let i = 0; return String(s).replace(/%[sd]/g, () => (a[i] !== undefined ? a[i++] : '')); }
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- colors from the config ---------- */
function parseColor(c) {
  if (typeof c !== 'string') return null;
  const m = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let x = m[1]; if (x.length === 3) x = x.split('').map(d => d + d).join('');
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
}
const hex = ([r, g, b]) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

function applyConfig(c) {
  cfg = Object.assign(cfg, c);
  const col = (cfg.brand && cfg.brand.colors) || {};
  const set = (k, v) => root.style.setProperty(k, v);
  const P = parseColor(col.Primary), A = parseColor(col.Accent), D = parseColor(col.Danger), B = parseColor(col.Background),
    BR = parseColor(col.Border), TX = parseColor(col.Text), MU = parseColor(col.MutedText);
  if (P) { set('--primary', hex(P)); set('--primary-rgb', P.join(',')); set('--on-primary', (0.299 * P[0] + 0.587 * P[1] + 0.114 * P[2]) > 150 ? '#10121C' : '#FFFFFF'); }
  if (A) set('--accent', hex(A));
  if (D) { set('--danger', hex(D)); set('--danger-rgb', D.join(',')); }
  if (B) {
    set('--bg', hex(B)); set('--bg-rgb', B.join(','));
    set('--surface', hex(mix(B, [255, 255, 255], .05)));
    set('--surface2', hex(mix(B, [255, 255, 255], .09)));
    set('--surface3', hex(mix(B, [255, 255, 255], .15)));
  }
  if (BR) set('--border', hex(BR));
  if (TX) set('--text', hex(TX));
  if (MU) set('--muted', hex(MU));
  const fnt = /^[\w\s-]+$/.test(cfg.font || '') ? cfg.font : 'Cairo';
  set('--font', /^(cairo|uhcairo)$/i.test(fnt) ? '"UHCairo"' : `"${fnt}", "UHCairo"`);
  if (cfg.fontSize) set('--fs', clamp(+cfg.fontSize || 17, 10, 40) + 'px');
  if (cfg.bloodColor && parseColor(cfg.bloodColor)) set('--blood', cfg.bloodColor);
  root.dir = cfg.rtl ? 'rtl' : 'ltr';
  root.lang = cfg.lang || 'en';
  set('--dir', cfg.rtl ? -1 : 1);
  const J = cfg.jumpscare || {};
  JS.faces = Array.isArray(J.faces) ? J.faces.filter(x => typeof x === 'string') : [];
  JS.mode = J.mode === 'image' || J.mode === 'both' ? J.mode : 'ped';
  JS.images = Array.isArray(J.images) ? J.images.filter(x => typeof x === 'string') : [];
  JS.imageChance = clamp(+J.imageChance || 0, 0, 1);
  const d = cfg.dialogue || {};
  const dl = $('#dialogue');
  dl.dataset.pos = d.Position || 'bottom-center';
  set('--dw', (d.Width || 560) + 'px'); set('--doy', (d.OffsetY || 110) + 'px'); set('--dr', (d.Radius || 16) + 'px');
  if (panelOpen) renderPanel();
}

/* ============================ icons (monoline, 24px) ============================ */
const ICON = {
  ghost: '<path d="M6 21V10a6 6 0 0 1 12 0v11l-2.2-2-1.9 2-1.9-2-1.9 2-1.9-2z"/><circle cx="9.7" cy="10" r=".9"/><circle cx="14.3" cy="10" r=".9"/>',
  shadow: '<circle cx="12" cy="7.5" r="3.5" stroke-dasharray="2 2.2"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke-dasharray="2 2.2"/>',
  stalker: '<circle cx="15" cy="6.5" r="2.8"/><path d="M15 9.5v6l-2.5 5.5M15 12l3 2M15 15.5l3 5.5"/><path d="M3 9h5M2 13h7M4 17h4" stroke-dasharray="1.5 2.5"/>',
  crowd: '<circle cx="12" cy="7" r="2.6"/><circle cx="5.5" cy="9" r="2.1"/><circle cx="18.5" cy="9" r="2.1"/><path d="M7.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5M1.5 17.5c0-2.2 1.6-3.8 3.8-3.8M22.5 17.5c0-2.2-1.6-3.8-3.8-3.8"/>',
  zombie_horde: '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 9.2l2.4 2.4M10.6 9.2L8.2 11.6M13.4 9.2l2.4 2.4M15.8 9.2l-2.4 2.4M7.5 16l2-1.2 1.6 1.2 1.6-1.2 1.6 1.2 2-1.2"/>',
  animals: '<ellipse cx="12" cy="16" rx="4.2" ry="3.4"/><ellipse cx="6" cy="11" rx="1.7" ry="2.3"/><ellipse cx="18" cy="11" rx="1.7" ry="2.3"/><ellipse cx="9.5" cy="6.5" rx="1.7" ry="2.3"/><ellipse cx="14.5" cy="6.5" rx="1.7" ry="2.3"/>',
  gunman: '<path d="M3 9h14l2 2v3h-6l-1 4H8l1-4H3z"/><path d="M19 11h2"/>',
  double: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.6-6 6-6s6 2.5 6 6"/><circle cx="16" cy="8" r="3" stroke-dasharray="2 2"/><path d="M13.5 14.3c.8-.2 1.6-.3 2.5-.3 3 0 5.5 2.2 5.5 6" stroke-dasharray="2 2"/>',
  friend: '<circle cx="9" cy="9" r="3.2"/><path d="M3 21c0-3.8 2.6-6.2 6-6.2s6 2.4 6 6.2"/><path d="M15 4.5h6a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3l-2.2 2v-2H15A1.5 1.5 0 0 1 13.5 9V6A1.5 1.5 0 0 1 15 4.5z"/>',
  gunfight: '<path d="M3 11h11l2-3h5v5h-5l-1 3h-4l-1-3H3zM8 14v4"/>',
  scene: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5l-2 4M13 5l-2 4M18 5l-2 4"/>',
  death_feeling: '<path d="M12 3a8 8 0 0 0-8 8v3l2 1v3h3v-2h6v2h3v-3l2-1v-3a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.6"/><circle cx="15" cy="11" r="1.6"/>',
  self_zombie: '<circle cx="12" cy="7" r="3.2"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M4 12l5 1M20 12l-5 1"/>',
  collapse: '<circle cx="6" cy="14" r="2.2"/><path d="M8 16l5 1 4-3M13 17l1 4M3 21h18"/>',
  insects: '<ellipse cx="12" cy="14" rx="4" ry="5.5"/><circle cx="12" cy="7" r="2"/><path d="M8 11l-4-2M8 14H3M8 17l-4 2M16 11l4-2M16 14h5M16 17l4 2"/>',
  drunk: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8 21h8"/>',
  underwater: '<path d="M2 8c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0M2 14c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0M2 20c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0"/>',
  distortion: '<path d="M2 8c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0M2 14c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0M2 20c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0" transform="translate(0 -3)"/>',
  acid_trip: '<path d="M12 12m0 0c0-1.5 1.5-2.5 3-2 2.5.7 3 4 1 6-2.5 2.5-7 2-9-1-2.5-3.7-1-9 3-11 5-2.4 11 .5 12 6"/>',
  tunnel_vision: '<rect x="2.5" y="4.5" width="19" height="15" rx="3"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1.2"/>',
  double_vision: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  flicker: '<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z"/>',
  bugs: '<ellipse cx="12" cy="14" rx="4" ry="5.5"/><circle cx="12" cy="7" r="2"/><path d="M8 11l-4-2M8 14H3M8 17l-4 2M16 11l4-2M16 14h5M16 17l4 2M10.5 5.2L8.5 2.5M13.5 5.2l2-2.7"/>',
  blood: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  words: '<path d="M4 6h16M4 11h10M4 16h13M4 21h7"/>',
  eyes: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M5 6l1.5 2M19 6l-1.5 2M12 4v2"/>',
  tint: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" fill-opacity=".35"/>',
  camera_sway: '<g transform="rotate(-9 12 12)"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></g>',
  time_slow: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  fake_notify: '<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/><circle cx="17.5" cy="5.5" r="2.5" fill="currentColor"/>',
  heartbeat: '<path d="M2 12h4l2-6 4 12 3-9 2 3h5"/>',
  breathing: '<path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.5M3 12h16a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5"/>',
  whispers_audio: '<circle cx="7" cy="12" r="3"/><path d="M13 8.5a5 5 0 0 1 0 7M16.5 6a8.5 8.5 0 0 1 0 12M20 3.5a12 12 0 0 1 0 17"/>',
  footsteps_behind: '<path d="M7.5 3c2 0 3 2 3 4.5S9.5 12 8 12 5 10 5 7.5 5.5 3 7.5 3zM7 14.5h2.2v2A1.5 1.5 0 0 1 7.7 18H7a1 1 0 0 1-1-1v-1.5z"/><path d="M16.5 8c2 0 3 2 3 4.5S18.5 17 17 17s-3-2-3-4.5S14.5 8 16.5 8zM16 19.5h2.2v1A1.5 1.5 0 0 1 16.7 22H16a1 1 0 0 1-1-1v-.5z"/>',
  knocking: '<rect x="5" y="2.5" width="14" height="19" rx="1.5"/><circle cx="15.5" cy="12.5" r=".9"/><path d="M1.5 9.5l1.7.9M1 13.5h2M1.5 17.5l1.7-.9"/>',
  phone_ring: '<path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/><path d="M15 3.5a6 6 0 0 1 5.5 5.5M15 7a3 3 0 0 1 2 2"/>',
  static_noise: '<path d="M4 5h.01M9 4h.01M14 6h.01M19 4.5h.01M6.5 9h.01M12 10h.01M17 9h.01M4 14h.01M9 13h.01M14.5 15h.01M20 13h.01M6.5 19h.01M12 18.5h.01M17.5 19h.01" stroke-width="2.6"/>',
  drone: '<path d="M2 12c3.5-8 6.5 8 10 0s6.5 8 10 0"/>',
  music_box: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  tinnitus: '<path d="M7 15a5 5 0 1 1 9.5-2.2c-.8 1.7-2.5 2.2-2.5 4.2a3 3 0 0 1-6 0"/><path d="M19.5 5.5l1.5-1.5M20.5 9.5H22.5M18 2.5V4.5"/>',
  distant_gunshots: '<path d="M4 20l6-6M14 3l1.2 3.3L18.5 5.5l-1 3.3L21 10l-3 2 1.5 3.2-3.4-.4L14 18l-1.7-3-3.3 1 1-3.3L7 10l3.4-.6z" transform="translate(-1 -1) scale(.95)"/>',
  weapon_tremor: '<circle cx="12" cy="12" r="6"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/><path d="M1 5l2 1M1 19l2-1M23 5l-2 1M23 19l-2-1"/>',
  hand_tremor: '<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-3-5a1.5 1.5 0 0 1 2.5-1.5L8 15"/>',
  dizzy: '<circle cx="12" cy="12" r="9"/><path d="M12 12m-1.2 0a1.2 1.2 0 1 0 2.4 0c0-2.2-3.6-2.2-3.6 1.2 0 3.6 6 3.6 6-1.8"/>',
  hide_player: '<path d="M3 3l18 18M10.6 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.8A17 17 0 0 0 2 12s3.600 7 10 7a9.700 9.700 0 0 0 4.200-.9M9.900 9.900a3 3 0 0 0 4.200 4.200"/>',
  solo_visible: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.700 2.600-6 6-6"/><path d="M13 16s2-3.500 5-3.500S23 16 23 16s-2 3.500-5 3.500S13 16 13 16z"/><circle cx="18" cy="16" r="1.300"/>',
  possess: '<path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M12 1.500v2.500M12 20v2.500" />',
  ghost_vision: '<path d="M6 21V10a6 6 0 0 1 12 0v11l-2.200-2-1.900 2-1.900-2-1.900 2-1.900-2z" stroke-dasharray="2.500 2"/><circle cx="9.700" cy="10" r=".9"/><circle cx="14.300" cy="10" r=".9"/>',
};
const CAT_COLOR = { all: 'var(--muted)', entity: '#8CA2FF', visual: '#C58BFF', audio: '#4FC3C7', body: '#E8A15B', people: '#6FCF97', world: '#F2C94C', other: 'var(--muted)' };
const CAT_ICON = {
  all: '<rect x="3" y="3" width="7" height="7" rx="1.500"/><rect x="14" y="3" width="7" height="7" rx="1.500"/><rect x="3" y="14" width="7" height="7" rx="1.500"/><rect x="14" y="14" width="7" height="7" rx="1.500"/>',
  entity: ICON.ghost,
  visual: '<path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  audio: '<path d="M4 9v6h4l5 4V5L8 9zM16.500 8.500a5 5 0 0 1 0 7M19 6a8.500 8.500 0 0 1 0 12"/>',
  body: ICON.hand_tremor,
  people: ICON.crowd,
};
const CUE_ICON = {
  jumpscare: '<circle cx="12" cy="12" r="9"/><circle cx="8.500" cy="10" r="1.800"/><circle cx="15.500" cy="10" r="1.800"/><path d="M7.500 16.500l1.500-1.800 1.500 1.800 1.500-1.800 1.500 1.800 1.500-1.800 1.500 1.800"/>',
  blackout: '<path d="M9 21h6M12 3a6 6 0 0 0-3.500 10.900c.7.500 1 1.200 1 2.100h5c0-.9.300-1.600 1-2.100A6 6 0 0 0 12 3z"/><path d="M3 3l18 18"/>',
  heartbeat_rush: ICON.heartbeat,
  glitch: '<path d="M3 6h9M12 6h9M3 12h14M7 18h14M5 9h5M15 15h4"/>',
  quake: '<path d="M2 12l3-4 3 8 3-10 3 12 3-8 2 4 3-2"/>',
  whispers: ICON.whispers_audio,
  blood_rain: ICON.blood,
  freeze: '<path d="M12 2v20M3.300 7l17.400 10M3.300 17L20.700 7M9 3.500L12 6l3-2.500M9 20.500L12 18l3 2.500"/>',
};
const iconSvg = (inner, cls) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); if (cls) s.setAttribute('class', cls); s.innerHTML = inner; return s; };

/* ============================ sound engine (WebAudio) ============================ */
const missed = new Set();
function missingSound(name) { if (missed.has(name)) return; missed.add(name); try { post('soundMissing', { name }); } catch (e) { } }
const Snd = (() => {
  let ac = null, master = null; const buffers = new Map(), voices = new Map();
  function ctx() {
    if (!ac) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      ac = new C(); master = ac.createGain(); master.gain.value = clamp(+((cfg.sounds || {}).master) || .9, 0, 1); master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    return ac;
  }
  async function load(name) {
    if (buffers.has(name)) return buffers.get(name);
    const p = (async () => {
      try {
        const r = await fetch(`assets/sounds/${encodeURIComponent(name)}.ogg`); if (!r.ok) { missingSound(name); return null; }
        return await ac.decodeAudioData(await r.arrayBuffer());
      } catch (e) { missingSound(name); return null; }
    })();
    buffers.set(name, p); return p;
  }
  async function play(o) {
    if (!cfg.sounds || cfg.sounds.enabled === false || !o || !o.name) return;
    const a = ctx(); if (!a) return;
    stop(o.id, 0.05);
    const buf = await load(o.name); if (!buf) return;
    const src = a.createBufferSource(); src.buffer = buf; src.loop = !!o.loop; src.playbackRate.value = clamp(+o.rate || 1, .4, 2.5);
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.rear ? 1100 : 19000;
    const pan = a.createStereoPanner ? a.createStereoPanner() : null; if (pan) pan.pan.value = clamp(+o.pan || 0, -1, 1);
    const g = a.createGain(); const vol = clamp(+o.volume || 1, 0, 1.5);
    const fade = o.loop ? clamp(+o.fade || 1, .05, 6) : .01;
    g.gain.setValueAtTime(0, a.currentTime); g.gain.linearRampToValueAtTime(vol, a.currentTime + fade);
    src.connect(lp); lp.connect(g); if (pan) { g.connect(pan); pan.connect(master); } else g.connect(master);
    const v = { src, g, pan, lp, id: o.id };
    voices.set(o.id, v);
    src.onended = () => { if (voices.get(o.id) === v) voices.delete(o.id); };
    src.start();
  }
  function update(o) {
    const v = voices.get(o.id), a = ac; if (!v || !a) return;
    const t = a.currentTime;
    if (v.pan && o.pan != null) v.pan.pan.setTargetAtTime(clamp(+o.pan, -1, 1), t, .06);
    if (o.volume != null) v.g.gain.setTargetAtTime(clamp(+o.volume, 0, 1.5), t, .1);
    if (o.rear != null) v.lp.frequency.setTargetAtTime(o.rear ? 1100 : 19000, t, .12);
    if (o.rate != null) v.src.playbackRate.setTargetAtTime(clamp(+o.rate, .4, 2.5), t, .2);
  }
  function stop(id, fade) {
    const v = voices.get(id), a = ac; if (!v || !a) return;
    voices.delete(id); const t = a.currentTime, f = Math.max(.03, +fade || .25);
    try { v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(v.g.gain.value, t); v.g.gain.linearRampToValueAtTime(0, t + f); v.src.stop(t + f + .02); } catch (e) { /* already stopped */ }
  }
  const stopAll = f => { for (const id of [...voices.keys()]) stop(id, f); };
  const stopPrefix = p => { for (const id of [...voices.keys()]) if (id.startsWith(p)) stop(id, .2); };
  const setMaster = v => { if (master) master.gain.value = clamp(v, 0, 1); };
  return { play, update, stop, stopAll, stopPrefix, setMaster };
})();

/* ============================ overlays ============================ */
const overlays = new Map();   // id -> { el, kind, off }

function mkBugs(opts) {
  // three kinds: beetles/roaches (glossy shell, antennae, stop-and-go), flies (blurred wings, erratic) and a few big
  // ones crawling right on the "lens" (blurred, close to the camera) for the creepy feeling that they are on you
  const cv = h('canvas'); const c = cv.getContext('2d');
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; }; fit(); addEventListener('resize', fit);
  let bugs = [], raf = 0, last = performance.now(), base = opts.color || '#120C08';
  const edge = () => { const t = Math.random(); const w = cv.width, hh = cv.height, side = Math.floor(Math.random() * 4);
    return side === 0 ? [t * w, -14] : side === 1 ? [t * w, hh + 14] : side === 2 ? [-14, t * hh] : [w + 14, t * hh]; };
  const make = () => {
    const r = Math.random(), kind = r < .5 ? 'beetle' : r < .85 ? 'fly' : 'close';
    const near = kind === 'close';
    // more of them near the edges of the screen, fewer in the middle
    let x = Math.random() * cv.width, y = Math.random() * cv.height;
    if (Math.random() < .6) { const cx = cv.width / 2, cy = cv.height / 2; x = cx + (x - cx) * 1.0; if (Math.abs(x - cx) < cv.width * .2 && Math.abs(y - cy) < cv.height * .2) [x, y] = edge(); }
    return { kind, x, y, a: Math.random() * 6.28, v: kind === 'fly' ? 90 + Math.random() * 160 : 28 + Math.random() * 70, s: near ? 15 + Math.random() * 10 : kind === 'fly' ? 3 + Math.random() * 3 : 4 + Math.random() * 7,
      p: Math.random() * 9, pause: 0, hue: Math.random() };
  };
  const spawn = n => { while (bugs.length < n) bugs.push(make()); bugs.length = Math.min(bugs.length, n); };
  spawn(clamp(opts.count || 40, 1, 180));
  const drawBeetle = (b, col) => {
    const s = b.s;
    c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = Math.max(1, s * .13);
    for (let i = -1; i <= 1; i++) for (const side of [-1, 1]) {
      const w = Math.sin(b.p + i * 2.1 + (side > 0 ? 0 : 3.1)) * s * .28;
      c.beginPath(); c.moveTo(i * s * .45, side * s * .3); c.lineTo(i * s * .75 + w, side * s * .85); c.lineTo(i * s * .55 + w * 1.3, side * s * 1.25); c.stroke();
    }
    for (const side of [-1, 1]) { c.beginPath(); c.moveTo(s * 1.05, side * s * .15); c.quadraticCurveTo(s * 1.7, side * s * .5 + Math.sin(b.p * 1.3) * s * .2, s * 2.0, side * s * (.9 + Math.sin(b.p) * .25)); c.stroke(); }
    const g = c.createRadialGradient(-s * .25, -s * .25, s * .1, 0, 0, s * .9);
    g.addColorStop(0, 'rgba(120,95,70,.95)'); g.addColorStop(.35, col); g.addColorStop(1, '#030201');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, s, s * .62, 0, 0, 6.28); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = Math.max(.8, s * .06); c.beginPath(); c.moveTo(-s * .85, 0); c.lineTo(s * .55, 0); c.stroke();
    c.fillStyle = '#0b0705'; c.beginPath(); c.ellipse(s * .95, 0, s * .36, s * .3, 0, 0, 6.28); c.fill();
    c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(-s * .15, -s * .22, s * .32, s * .1, -.3, 0, 6.28); c.fill();
  };
  const drawFly = (b, col) => {
    const s = b.s, flap = Math.sin(b.p * 9) * .5 + .5;
    c.fillStyle = 'rgba(200,210,220,' + (.18 + .25 * flap) + ')';
    for (const side of [-1, 1]) { c.beginPath(); c.ellipse(-s * .1, side * s * (.9 + flap * .5), s * 1.1, s * .5, side * .5, 0, 6.28); c.fill(); }
    c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, s * .9, s * .55, 0, 0, 6.28); c.fill();
    c.fillStyle = '#1d0c0c'; c.beginPath(); c.arc(s * .85, 0, s * .42, 0, 6.28); c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.arc(s * .1, -s * .2, s * .18, 0, 6.28); c.fill();
  };
  const tick = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now; c.clearRect(0, 0, cv.width, cv.height);
    for (const b of bugs) {
      if (b.kind === 'fly') { b.a += (Math.random() - .5) * 14 * dt; b.p += dt * 3; }
      else {
        // crawl, stop, twitch, dart
        b.pause -= dt;
        if (b.pause <= 0 && Math.random() < dt * .6) b.pause = .3 + Math.random() * 1.2;
        if (b.pause <= 0) { b.a += (Math.random() - .5) * 3 * dt; b.p += dt * b.v * .2; }
        else b.a += (Math.random() - .5) * 2.2 * dt;
      }
      const mv = b.pause > 0 ? 0 : (b.kind === 'close' ? .55 : 1);
      b.x += Math.cos(b.a) * b.v * dt * mv; b.y += Math.sin(b.a) * b.v * dt * mv;
      if (b.x < -30 || b.x > cv.width + 30 || b.y < -30 || b.y > cv.height + 30) { const e = edge(); b.x = e[0]; b.y = e[1]; b.a = Math.atan2(cv.height / 2 - b.y, cv.width / 2 - b.x) + (Math.random() - .5) * 1.2; }
      c.save(); c.translate(b.x, b.y); c.rotate(b.a);
      c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = b.kind === 'close' ? 12 : 4; c.shadowOffsetY = 2;
      const col = b.hue < .5 ? base : '#2a1a10';
      if (b.kind === 'close') c.filter = 'blur(1.6px)';
      if (b.kind === 'fly') drawFly(b, col); else drawBeetle(b, col);
      c.restore();
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  cv._update = o => { base = o.color || base; spawn(clamp(o.count || 40, 1, 180)); };
  cv._stop = () => { cancelAnimationFrame(raf); removeEventListener('resize', fit); };
  return cv;
}
function mkNoise() {
  const cv = h('canvas'); cv.width = 192; cv.height = 108; const c = cv.getContext('2d'); const img = c.createImageData(192, 108);
  const t = setInterval(() => { for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } c.putImageData(img, 0, 0); }, 75);
  cv.style.imageRendering = 'pixelated'; cv.style.mixBlendMode = 'screen';
  cv._update = o => { cv.style.opacity = clamp(o.strength || .2, 0, 1); }; cv._stop = () => clearInterval(t);
  return cv;
}
function mkBlood(el, opts) {
  el.innerHTML = '';
  const n = Math.round(6 + 14 * clamp(opts.strength || .5, 0, 1));
  for (let i = 0; i < n; i++) el.append(h('i', { style: { left: Math.random() * 98 + '%', '--w': (7 + Math.random() * 20) + 'px', '--h': (22 + Math.random() * 38) + '%', '--d': (8 + Math.random() * 16) + 's', '--y': (8 + Math.random() * 38) + '%', animationDelay: (Math.random() * 3) + 's' } }));
}

function setOverlay(d) {
  const { id, kind, on } = d, opts = d.opts || {};
  let o = overlays.get(id);
  if (!on) {
    if (!o) return;
    overlays.delete(id); o.el.classList.add('fx-in'); setTimeout(() => { if (o.el._stop) o.el._stop(); o.el.remove(); }, 800); return;
  }
  if (!o) {
    let el;
    if (kind === 'bugs') el = mkBugs(opts);
    else if (kind === 'noise') el = mkNoise();
    else el = h('div', { class: `fx-${kind}` });
    el.classList.add('fx-in'); $('#fx').append(el);
    requestAnimationFrame(() => el.classList.remove('fx-in'));
    o = { el, kind }; overlays.set(id, o);
    if (kind === 'blood') mkBlood(el, opts);
  } else if (kind === 'blood' && Math.abs((o.s || 0) - (opts.strength || 0)) > .15) mkBlood(o.el, opts);
  o.s = opts.strength;
  const el = o.el;
  if (kind === 'tint' || kind === 'vignette' || kind === 'acid' || kind === 'blood') {
    el.style.setProperty('--s', clamp(+opts.strength || .5, 0, 1));
    if (opts.color) el.style.setProperty('--c', opts.color);
    el.classList.toggle('pulse', !!opts.pulse);
  }
  if (el._update) el._update(opts);
}
function eyePlay(d) { if (window.UH_EYE) window.UH_EYE.play(d, o => Snd.play(o)); }
function eyeStop() { if (window.UH_EYE) window.UH_EYE.stop(); }
function clearSession(prefix) {
  if (window.UH_EYE && window.UH_EYE.ownedBy(prefix)) eyeStop();
  for (const [id] of [...overlays]) if (id.startsWith(prefix)) setOverlay({ id, on: false });
  Snd.stopPrefix(prefix);
  for (const [id, b] of [...bubbles]) if (id.startsWith(prefix)) { b.remove(); bubbles.delete(id); }
}
function clearAll() {
  for (const [id] of [...overlays]) setOverlay({ id, on: false });
  Snd.stopAll(.2); eyeStop(); $('#cues').innerHTML = ''; $('#words').innerHTML = '';
  for (const b of bubbles.values()) b.remove(); bubbles.clear();
  hideDialogue(); showHint({ show: false }); resistClose(); possessHud({ on: false });
}

/* ---------- flash / words / toast / hint ---------- */
function flash(d) {
  const f = $('#flash'); f.style.background = d.color || '#fff'; f.style.setProperty('--a', clamp(+d.alpha || .9, 0, 1));
  f.style.transition = 'none'; f.classList.add('on'); void f.offsetWidth;
  f.classList.remove('on'); f.style.transition = `opacity ${clamp(+d.ms || 120, 30, 2000)}ms ease-out`; f.style.opacity = 0;
  f.style.opacity = clamp(+d.alpha || .9, 0, 1); requestAnimationFrame(() => { f.style.opacity = 0; });
}
function word(d) {
  const w = h('div', { class: 'word', style: { left: clamp(d.x, .05, .95) * 100 + '%', top: clamp(d.y, .05, .95) * 100 + '%', fontSize: clamp(+d.size || 32, 14, 90) + 'px', '--ms': clamp(+d.ms || 2400, 600, 8000) + 'ms' } }, String(d.text || '').slice(0, 80));
  $('#words').append(w); setTimeout(() => w.remove(), (+d.ms || 2400) + 200);
}
const TOAST_ICON = {
  inform: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="M8 12.500l2.800 2.800L16 9.500"/>',
  warning: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
};
function toast(d) {
  const type = TOAST_ICON[d.type] ? d.type : 'inform';
  const col = { inform: 'var(--primary)', success: 'var(--ok)', warning: 'var(--accent)', error: 'var(--danger)' }[type];
  const el = h('div', { class: 'toast', style: { '--c': col } }, iconSvg(TOAST_ICON[type]), h('span', {}, String(d.message || '')));
  const box = $('#toasts'); box.append(el); while (box.children.length > 5) box.firstChild.remove();
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, clamp(+d.duration || 5000, 1000, 30000));
}
function showHint(d) {
  const el = $('#hint'); if (!d || !d.show) { el.classList.add('hidden'); return; }
  $('#hint-key').textContent = d.key || 'E'; $('#hint-text').textContent = d.text || ''; el.classList.remove('hidden');
}

/* ============================ dialogue + bubble ============================ */
let dlgTok = 0, dlgTimer = 0;
function hideDialogue() { dlgTok++; clearInterval(dlgTimer); $('#dialogue').classList.add('hidden'); }
function showDialogue(d) {
  const tok = ++dlgTok; clearInterval(dlgTimer);
  const box = $('#dialogue'); box.classList.remove('hidden'); box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
  $('#dlg-speaker').textContent = d.speaker || ''; $('#dlg-hint').textContent = d.hint || '';
  const txt = $('#dlg-text'), list = $('#dlg-choices'); txt.textContent = ''; list.innerHTML = '';
  const timer = $('#dlg-timer'); timer.classList.remove('run'); timer.style.visibility = (d.seconds > 0) ? 'visible' : 'hidden';
  const chars = Array.from(String(d.text || '')); const speed = clamp(+d.typeSpeed || 0, 0, 200);
  const done = () => {
    if (tok !== dlgTok) return; txt.textContent = chars.join('');
    for (const c of d.choices || []) list.append(h('li', { 'data-n': c.n }, h('kbd', {}, String(c.n)), h('span', {}, c.text)));
    if (d.seconds > 0) { timer.style.setProperty('--ms', d.seconds * 1000 + 'ms'); void timer.offsetWidth; timer.classList.add('run'); }
  };
  if (!speed || chars.length === 0) return done();
  let i = 0; dlgTimer = setInterval(() => { if (tok !== dlgTok) return clearInterval(dlgTimer); txt.textContent = chars.slice(0, ++i).join(''); if (i >= chars.length) { clearInterval(dlgTimer); done(); } }, speed);
}
const bubbles = new Map();
function bubble(d) {
  let b = bubbles.get(d.id);
  if (!d.on) { if (b) { b.remove(); bubbles.delete(d.id); } return; }
  if (!b) { b = h('div', { class: 'bubble' }); $('#bubbles').append(b); bubbles.set(d.id, b); }
  b.textContent = String(d.text || ''); bubblePos(d);
}
function bubblePos(d) { const b = bubbles.get(d.id); if (!b) return; b.style.left = clamp(d.x, 0, 1) * 100 + '%'; b.style.top = clamp(d.y, 0, 1) * 100 + '%'; }

/* ============================ cues ============================ */
/* the jump scare: random scary face (html/faces.js) or your own image (Config.Jumpscare.Images) */
const JS = { faces: [], images: [], imageChance: 0.35, last: '', mode: 'ped' };
function scareFace(d) {
  const all = window.UH_FACES || {};
  let ids = (JS.faces.length ? JS.faces : Object.keys(all)).filter(k => all[k]);
  if (!ids.length) ids = Object.keys(all);
  if (d.face && all[d.face]) return { svg: all[d.face](), id: d.face };
  if (JS.images.length && Math.random() < JS.imageChance) {
    let src = JS.images[Math.floor(Math.random() * JS.images.length)];
    if (JS.images.length > 1 && src === JS.lastImg) src = JS.images[(JS.images.indexOf(src) + 1) % JS.images.length];
    JS.lastImg = src;
    return { svg: '<img alt="" src="' + String(src).replace(/"/g, '') + '">', id: 'img' };
  }
  let id = ids[Math.floor(Math.random() * ids.length)];
  if (ids.length > 1 && id === JS.last) id = ids[(ids.indexOf(id) + 1) % ids.length];
  JS.last = id;
  return { svg: all[id] ? all[id]() : '', id };
}
function cue(d) {
  const ms = clamp((+d.seconds || 2) * 1000, 500, 30000), box = $('#cues');
  const add = (cls, html, kids) => { const el = h('div', { class: cls, style: { '--ms': ms + 'ms' } }); if (html) el.innerHTML = html; (kids || []).forEach(k => el.append(k)); box.append(el); setTimeout(() => el.remove(), ms + 400); return el; };
  switch (d.name) {
    case 'jumpscare': { const f = scareFace(d); const el = add('cue-scare f-' + f.id, f.svg); const k = (+d.strength || .6); el.style.setProperty('--k', k); if (Math.random() < .6) el.classList.add('flick'); break; }
    case 'blackout': add('cue-black'); break;
    case 'glitch': add('cue-glitch', '', Array.from({ length: 9 }, () => h('i', { style: { top: Math.random() * 96 + '%', height: (2 + Math.random() * 9) + '%', animationDelay: -Math.random() * .3 + 's' } }))); break;
    case 'frost': add('cue-frost'); break;
    case 'pulse': add('cue-pulse'); break;
  }
}

/* ============================ resist mini-games ============================ */
const ARROW_PATH = { left: 'M15 5l-7 7 7 7', right: 'M9 5l7 7-7 7', up: 'M5 15l7-7 7 7', down: 'M5 9l7 7 7-7' };
const rs = { game: null, el: {}, total: 7 };
const R_ = 110, CX = 125, CY = 125, A0 = 135, SWEEP = 270;
const polar = (pos, r = R_) => { const a = (A0 + SWEEP * pos) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
function arc(p0, p1) {
  const [x0, y0] = polar(clamp(p0, 0, 1)), [x1, y1] = polar(clamp(p1, 0, 1));
  const large = (p1 - p0) * SWEEP > 180 ? 1 : 0; return `M${x0} ${y0} A${R_} ${R_} 0 ${large} 1 ${x1} ${y1}`;
}
function resistOpen(d) {
  const box = $('#resist'), stage = $('#rs-stage'); stage.innerHTML = ''; rs.game = d.game; rs.el = {}; rs.total = d.seconds || 7;
  $('#rs-title').textContent = T('ui_resist_title', d.label || ''); $('#rs-time').style.width = '100%';
  const chip = $('#rs-chip'); chip.textContent = d.level ? T('ui_level_' + d.level) : ''; chip.dataset.level = d.level || ''; chip.hidden = !d.level;
  $('#rs-round').textContent = (d.rounds || 1) > 1 ? `${d.round || 1} / ${d.rounds}` : ''; $('#rs-hearts').replaceChildren();
  $('#resist').dataset.level = d.level || '';
  $('#rs-result').className = 'rs-result'; $('#rs-result').textContent = '';
  const k = d.key || 'G';
  if (d.game === 'mash') {
    rs.el.kbd = h('kbd', {}, k); rs.el.bar = h('i');
    stage.append(h('div', { class: 'mash' }, rs.el.kbd, h('div', { class: 'bar' }, rs.el.bar)));
    $('#rs-help').textContent = T('ui_resist_mash', k);
  } else if (d.game === 'hold') {
    const len = 2 * Math.PI * 96;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 250 250');
    s.innerHTML = `<path class="track" d="${arc(0, 1)}"/><path class="zone" id="rz" d="${arc(.4, .6)}"/><circle class="prog" cx="125" cy="125" r="96" stroke-dasharray="${len}" stroke-dashoffset="${len}" id="rp"/><circle class="marker" r="10" id="rm" cx="${polar(0)[0]}" cy="${polar(0)[1]}"/>`;
    rs.el.ring = h('div', { class: 'ring' }, s, h('div', { class: 'breath' }), h('div', { class: 'core' }, h('kbd', {}, k)));
    rs.el.zone = s.querySelector('#rz'); rs.el.prog = s.querySelector('#rp'); rs.el.mark = s.querySelector('#rm'); rs.el.breath = rs.el.ring.querySelector('.breath'); rs.el.len = len;
    stage.append(rs.el.ring); $('#rs-help').textContent = T('ui_resist_hold', k);
  } else if (d.game === 'timing') {
    rs.el.zone = h('div', { class: 'zone' }); rs.el.needle = h('div', { class: 'needle' }); rs.el.pips = h('div', { class: 'pips' });
    stage.append(h('div', { class: 'timing' }, h('div', { class: 'track' }, rs.el.zone, rs.el.needle), rs.el.pips));
    $('#rs-help').replaceChildren(h('kbd', {}, k), h('span', {}, T('ui_resist_timing')));
  } else {
    rs.el.seq = h('div', { class: 'seq' }); stage.append(rs.el.seq); $('#rs-help').textContent = T('ui_resist_seq'); rs.seqKey = '';
  }
  box.classList.remove('hidden');
}
function resistState(d) {
  if (!rs.game || d.game !== rs.game) return;
  $('#rs-time').style.width = clamp((d.left / (d.total || rs.total)) * 100, 0, 100) + '%';
  if (d.game === 'mash') rs.el.bar.style.width = clamp(d.progress, 0, 1) * 100 + '%';
  else if (d.game === 'hold') {
    const half = d.width / 2; rs.el.zone.setAttribute('d', arc(d.center - half, d.center + half));
    const [x, y] = polar(clamp(d.pos, 0, 1)); rs.el.mark.setAttribute('cx', x); rs.el.mark.setAttribute('cy', y);
    rs.el.prog.setAttribute('stroke-dashoffset', rs.el.len * (1 - clamp(d.progress, 0, 1)));
    rs.el.ring.classList.toggle('inside', !!d.inside); rs.el.breath.style.transform = `scale(${.65 + d.pos * .75})`;
  } else if (d.game === 'timing') {
    rs.el.zone.style.left = (d.zone - d.width / 2) * 100 + '%'; rs.el.zone.style.width = d.width * 100 + '%'; rs.el.needle.style.left = d.needle * 100 + '%';
    const key = `${d.round}|${d.hits}|${d.lives}`;
    if (rs.pipKey !== key) {
      rs.pipKey = key; rs.el.pips.replaceChildren();
      for (let i = 0; i < d.rounds; i++) rs.el.pips.append(h('span', { class: 'pip' + (i < d.hits ? ' hit' : '') }));
    }
    hearts(d);
  } else if (d.game === 'sequence') {
    const key = d.seq.join(',');
    if (rs.seqKey !== key) { rs.seqKey = key; rs.el.seq.replaceChildren(...d.seq.map(n => h('div', { class: 'k' }, iconSvg(`<path d="${ARROW_PATH[n]}"/>`)))); }
    [...rs.el.seq.children].forEach((c, i) => {
      c.classList.toggle('done', i < d.idx - 1); c.classList.toggle('now', i === d.idx - 1);
      c.classList.toggle('hidden-k', !!d.reveal && i > d.idx - 2 + d.reveal);   // far end of the sequence is hidden on hard levels
    });
    hearts(d);
  }
}
function hearts(d) {
  const box = $('#rs-hearts'), n = d.maxLives || 0, key = n + '|' + d.lives; if (box.dataset.k === key) return; box.dataset.k = key; box.replaceChildren();
  if (n < 2) return;   // a single life: nothing to show
  for (let i = 0; i < n; i++) box.append(h('i', { class: i >= d.lives ? 'lost' : '' }));
}
function resistSpike(d) {
  const box = $('#resist'); box.classList.remove('spike'); void box.offsetWidth; box.classList.add('spike');
  if (d && d.noFace) return;   // Config.Jumpscare.Mode = 'ped': the scare is a real ped in the world, no picture here
  const el = h('div', { class: 'rs-spike' }); el.innerHTML = scareFace({}).svg; box.append(el); setTimeout(() => el.remove(), 360);
}
function resistTap(d) {
  if (rs.game === 'mash' && rs.el.kbd) { rs.el.kbd.classList.add('tap'); setTimeout(() => rs.el.kbd && rs.el.kbd.classList.remove('tap'), 70); }
  if (rs.game === 'sequence' && d.good === false) { [...rs.el.seq.children].forEach(c => { c.classList.add('bad'); setTimeout(() => c.classList.remove('bad'), 320); }); }
}
function resistEnd(d) { const r = $('#rs-result'); r.textContent = T(d.more ? 'ui_resist_next' : d.ok ? 'ui_resist_won' : 'ui_resist_lost'); r.className = 'rs-result show ' + (d.ok ? 'ok' : 'bad'); }
function resistClose() { $('#resist').classList.add('hidden'); rs.game = null; $('#rs-stage').innerHTML = ''; }
function resistPrompt(d) {
  const el = $('#resist-prompt'); if (!d.on) return el.classList.add('hidden');
  $('#rp-key').textContent = d.key || 'G'; $('#rp-text').textContent = T('ui_resist_prompt'); $('#rp-sub').textContent = d.onset ? T('ui_resist_onset_sub', d.key || 'G') : T('ui_resist_prompt_sub', d.key || 'G');
  const lv = $('#rp-level'); lv.textContent = d.level ? T('ui_level_' + d.level) : ''; lv.dataset.level = d.level || ''; lv.hidden = !d.level;
  const r = $('#rp-ring'); el.style.setProperty('--ms', (d.seconds || 8) + 's');
  el.classList.remove('hidden'); el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  r.style.animation = 'none'; void r.getBoundingClientRect(); r.style.animation = '';
}

/* ============================ possession ribbon ============================ */
let psTimer = 0;
function possessHud(d) {
  clearInterval(psTimer); const el = $('#possess');
  if (!d.on) return el.classList.add('hidden');
  if (d.role === 'world') { $('#ps-title').textContent = T('ui_world_hud'); $('#ps-sub').textContent = T('ui_world_hud_sub'); }
  else if (d.role === 'ghost') { $('#ps-title').textContent = T('ui_takeover_ghost'); $('#ps-sub').textContent = T(d.move ? 'ui_takeover_ghost_move_sub' : 'ui_takeover_ghost_sub'); }
  else if (d.role === 'target') { $('#ps-title').textContent = T('ui_possess_target'); $('#ps-sub').textContent = T('ui_possess_target_sub'); }
  else { $('#ps-title').textContent = T('ui_possess_ctrl', d.name || ''); $('#ps-sub').textContent = T('ui_possess_ctrl_sub', d.cmd || 'hunpossess'); }
  let left = Math.round(+d.seconds || 0); const t = $('#ps-time');
  const draw = () => { t.textContent = left > 0 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : ''; };
  draw(); if (left > 0) psTimer = setInterval(() => { left = Math.max(0, left - 1); draw(); }, 1000);
  el.classList.remove('hidden');
}

/* ============================ reply box ============================ */
function replyOpen(d) {
  const f = $('#reply'), i = $('#reply-input'); i.maxLength = d.max || 120; i.value = ''; i.placeholder = T('ui_say_ph'); $('#reply-send').textContent = T('ui_send');
  f.classList.remove('hidden'); setTimeout(() => i.focus(), 60);
}
$('#reply').addEventListener('submit', e => { e.preventDefault(); post('reply', { text: $('#reply-input').value }); $('#reply').classList.add('hidden'); });

/* ============================ ADMIN PANEL ============================ */
let panelOpen = false, P = null, pTimer = 0, dragging = false, msgTimer = 0;
const ui = {
  tab: 'start', cat: 'all', type: null, search: '', pSearch: '', target: null,
  intensity: .5, duration: 60, subject: '',
  hide: { viewer: '', subject: '', duration: 120 }, solo: { viewer: '', subject: '', duration: 120 }, ghost: { alpha: 110, duration: 120 }, appear: { duration: 120 },
  dir: { type: 'friend', look: 'model', player: '' }, poss: { duration: 120 }, say: '',
  swap: { a: '', b: '', duration: 300 }, log: [],
  world: { place: '', staff: {}, seconds: 300, bucket: true, join: true, newPlace: '' },
  to: { pressure: null, move: null },
  zone: { name: '', type: '', radius: 25, intensity: .6, duration: 60, chance: .35, cooldown: 180 },
  ed: { key: '', scene: null, sel: 0, builtin: false }, diag: { running: false, done: 0, total: 0, result: null },
};
const TABS = [['start', 'use'], ['scenarios', 'use'], ['show', 'use'], ['people', 'use'], ['map', 'use'], ['director', 'director'], ['takeover', 'director'], ['world', 'director'], ['swap', 'swap'], ['mind', 'director'], ['zones', 'admin'], ['editor', 'admin'], ['settings', 'admin'], ['diag', 'admin'], ['active', 'use']];

function playerName(id) { const p = (P.players || []).find(x => String(x.id) === String(id)); return p ? p.name : '#' + id; }
function fmtTime(s) { s = Math.max(0, Math.round(s)); return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}s`; }
function act(action, payload) { post('panelAction', { action, payload }); }
function say(text, kind) {
  const m = $('#p-msg'); if (!m) return; m.textContent = text || ''; m.className = 'p-msg ' + (kind || '');
  clearTimeout(msgTimer); msgTimer = setTimeout(() => { m.textContent = ''; m.className = 'p-msg'; }, 6000);
}

function slider(o) {
  const out = h('output', {}, o.fmt(o.value));
  const inp = h('input', { type: 'range', min: o.min, max: o.max, step: o.step || 1, value: o.value, 'aria-label': o.label });
  const paint = () => { inp.style.setProperty('--p', ((inp.value - o.min) / (o.max - o.min)) * 100 + '%'); out.textContent = o.fmt(+inp.value); };
  inp.addEventListener('input', () => { dragging = true; paint(); o.onInput && o.onInput(+inp.value); });
  inp.addEventListener('change', () => { dragging = false; o.onChange && o.onChange(+inp.value); });
  paint();
  return h('label', { class: 'field' }, h('span', { class: 'field-h' }, h('span', {}, o.label), out), inp);
}
function select(opts, value, onChange, label) {
  const s = h('select', { 'aria-label': label || '' }, opts.map(([v, t]) => h('option', { value: v }, t)));
  s.value = String(value ?? ''); if (s.value !== String(value ?? '')) s.selectedIndex = 0;
  s.addEventListener('change', () => onChange(s.value)); return s;
}
const fieldOf = (label, ctl) => h('label', { class: 'field' }, h('span', {}, label), ctl);
function playerOpts(blank, exclude) {
  const base = blank ? [['', T('ui_pick_player')]] : [];
  return base.concat((P.players || []).filter(p => String(p.id) !== String(exclude)).map(p => [String(p.id), `#${p.id}  ${p.name}`]));
}
const targetId = () => (ui.target === 'all' ? 'all' : Number(ui.target));
const typeDef = k => (P.types || []).find(t => t.key === k);
const CATS = ['all', 'entity', 'visual', 'audio', 'body', 'people'];

let lastTabShown = null;
function renderPanel() {
  if (!P) return;
  const panel = $('#panel');
  // remember every scroll position: a re-render must be invisible to the user
  const keep = { body: $('.p-body') ? $('.p-body').scrollTop : 0, list: $('.p-list') ? $('.p-list').scrollTop : 0, tabs: $('.p-tabs') ? $('.p-tabs').scrollLeft : null };
  if (ui.target == null) ui.target = String(P.me);
  panel.replaceChildren(h('div', { class: 'p-shell' },
    h('header', { class: 'p-top' },
      cfg.brand.logo ? h('img', { class: 'p-logo', src: cfg.brand.logo, alt: '', draggable: 'false', onerror: function () { this.remove(); } }) : null,
      h('div', { class: 'p-brand' }, h('small', {}, cfg.brand.server || ''), h('b', {}, cfg.brand.name || 'Universal Hallucination')),
      h('div', { class: 'p-sp' }),
      h('button', { class: 'p-x', onclick: closePanel, 'aria-label': T('ui_close') }, iconSvg('<path d="M5 5l14 14M19 5L5 19"/>'))),
    renderRail(), renderMain(),
    h('footer', { class: 'p-foot' }, h('span', { class: 'p-msg', id: 'p-msg' }), h('span', {}, `${cfg.brand.dev || 'Ra7 DEV'}  ·  v${cfg.brand.version || ''}`))));
  const b = $('.p-body'); if (b) b.scrollTop = keep.body;
  const l = $('.p-list'); if (l) l.scrollTop = keep.list;
  const tb = $('.p-tabs');
  if (tb) {
    if (keep.tabs != null && lastTabShown === ui.tab) tb.scrollLeft = keep.tabs;
    else { const onTab = $('.p-tab.on'); if (onTab && onTab.scrollIntoView) onTab.scrollIntoView({ block: 'nearest', inline: 'center' }); }
    lastTabShown = ui.tab;
    tabsScroll(tb);
  }
}
/* tabs row: no scrollbar; mouse wheel and dragging scroll it */
function tabsScroll(bar) {
  const dir = () => (getComputedStyle(bar).direction === 'rtl' ? -1 : 1);
  bar.addEventListener('wheel', e => { const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX; if (!d) return; bar.scrollLeft += dir() * d; e.preventDefault(); }, { passive: false });
  let down = false, sx = 0, sl = 0, moved = false;
  bar.addEventListener('pointerdown', e => { if (e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = bar.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (!moved && Math.abs(dx) > 5) { moved = true; bar.classList.add('drag'); } if (moved) bar.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => bar.classList.remove('drag'), 0); });
}
function renderRail() {
  const q = ui.pSearch.trim().toLowerCase();
  const list = (P.players || []).filter(p => !q || p.name.toLowerCase().includes(q) || String(p.id).includes(q));
  const items = [];
  if (P.perms.admin) items.push(playerRow({ id: 'all', name: T('ui_all'), note: T('ui_toall') }));
  list.forEach(p => items.push(playerRow({ id: p.id, name: p.name + (p.id === P.me ? `  (${T('ui_you')})` : ''), note: '#' + p.id, active: p.active, swapped: p.swapped })));
  if (!list.length && !P.perms.admin) items.push(h('div', { class: 'p-empty' }, T('ui_nobody')));
  const search = h('input', { class: 'p-search', type: 'search', placeholder: T('ui_search'), value: ui.pSearch, 'aria-label': T('ui_search') });
  search.addEventListener('input', () => { ui.pSearch = search.value; const l = $('.p-list'); l.replaceWith(renderRail().querySelector('.p-list')); });
  return h('aside', { class: 'p-rail' }, search, h('div', { class: 'p-list' }, items));
}
function playerRow(p) {
  const sel = String(ui.target) === String(p.id);
  return h('button', { class: 'p-pl' + (sel ? ' sel' : ''), onclick: () => { ui.target = String(p.id); renderPanel(); } },
    h('div', {}, h('b', {}, p.name), h('small', {}, p.note)),
    h('div', { class: 'p-tag' }, p.swapped ? h('span', { class: 'p-badge swap' }, iconSvg('<path d="M4 8h13l-3-3M20 16H7l3 3"/>')) : null, p.active ? h('span', { class: 'p-badge' }, String(p.active)) : null));
}
function renderMain() {
  const tabs = TABS.filter(([, perm]) => P.perms[perm]);
  if (!tabs.find(t => t[0] === ui.tab)) ui.tab = tabs.length ? tabs[0][0] : 'start';
  const nActive = (P.active || []).length;
  const bar = h('nav', { class: 'p-tabs', role: 'tablist' }, tabs.map(([k]) => h('button', { class: 'p-tab' + (ui.tab === k ? ' on' : ''), role: 'tab', onclick: () => { ui.tab = k; renderPanel(); } },
    T('ui_tab_' + k), k === 'active' && nActive ? h('em', {}, String(nActive)) : null)));
  const body = h('div', { class: 'p-body' }, h('div', { class: 'p-target' }, T('ui_target') + ':', h('b', {}, ui.target === 'all' ? T('ui_all') : playerName(ui.target))), h('div', { style: { height: '14px' } }),
    ({ start: tabStart, scenarios: tabScenarios, show: tabShow, people: tabPeople, director: tabDirector, swap: tabSwap, active: tabActive, takeover: tabTakeover, world: tabWorld, editor: tabEditor, diag: tabDiag, zones: tabZones, mind: tabMind, map: tabMap, settings: tabSettings }[ui.tab] || tabStart)());
  return h('section', { class: 'p-main' }, bar, body);
}

/* --- start --- */
function tabStart() {
  const chips = h('div', { class: 'chips' }, CATS.map(c => h('button', { class: 'chip' + (ui.cat === c ? ' on' : ''), style: { '--c': CAT_COLOR[c] || 'var(--muted)' }, onclick: () => { ui.cat = c; renderPanel(); } }, h('i', { class: 'dot' }), T('ui_cat_' + c))));
  const q = ui.search.trim().toLowerCase();
  const types = (P.types || []).filter(t => t.key !== 'possess' && (ui.cat === 'all' || t.cat === ui.cat) && (!q || (t.short || '').toLowerCase().includes(q) || t.label.toLowerCase().includes(q) || t.key.includes(q)));
  const grid = h('div', { class: 'grid' }, types.map(t => h('button', {
    class: 'tile' + (ui.type === t.key ? ' on' : '') + (t.enabled ? '' : ' off'), disabled: !t.enabled, title: t.key, style: { '--c': CAT_COLOR[t.cat] || 'var(--muted)' },
    onclick: () => { ui.type = t.key; ui.intensity = t.intensity ?? .5; ui.duration = Math.round(t.duration ?? 60); renderPanel(); },
  }, h('span', {}, t.short || t.label, t.enabled ? null : h('small', {}, T('ui_disabled'))))));
  const search = h('input', { class: 'inp', type: 'search', placeholder: T('ui_search'), value: ui.search, style: { maxWidth: '260px', marginBottom: '14px' } });
  search.addEventListener('input', () => { ui.search = search.value; const g = $('.grid'); g.replaceWith(tabStart().querySelector('.grid')); });
  const def = typeDef(ui.type);
  const needSubject = def && (def.needsSubject || def.subjectOpt);
  const dock = h('div', { class: 'dock' }, h('p', { class: 'desc' }, def ? def.label : T('ui_tab_hint')), h('div', { class: 'dock-in' },
    slider({ label: T('ui_intensity'), min: 0.05, max: 1, step: .05, value: ui.intensity, fmt: v => Math.round(v * 100) + '%', onInput: v => ui.intensity = v }),
    slider({ label: T('ui_duration'), min: 5, max: 900, step: 5, value: clamp(ui.duration, 5, 900), fmt: fmtTime, onInput: v => ui.duration = v }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn pri', disabled: !def, onclick: () => launch() }, T('ui_start')),
      h('button', { class: 'btn dan', onclick: () => act('stop', { target: targetId() }) }, T('ui_stop')))),
    needSubject ? h('div', { class: 'two' }, fieldOf(def.needsSubject ? T('ui_subject') : T('ui_look_player'), select(playerOpts(true), ui.subject, v => ui.subject = v))) : null);
  return h('div', {}, chips, search, grid, dock);
}
function launch() {
  const def = typeDef(ui.type); if (!def) return;
  const payload = { target: targetId(), type: def.key, intensity: ui.intensity, duration: ui.duration };
  if (ui.subject && (def.needsSubject || def.subjectOpt)) { payload.subject = Number(ui.subject); if (def.subjectOpt) payload.params = { source: 'subject' }; }
  act('start', payload);
}

/* --- scenarios --- */
function tabScenarios() {
  const rows = (P.scenarios || []).map(s => h('div', { class: 'row' }, iconSvg('<path d="M4 5h16v14H4zM4 9h16M8 5v14"/>', 'ic'), h('div', {}, h('b', {}, s.label), h('small', {}, `${fmtTime(s.duration || 0)}`)),
    h('button', { class: 'btn pri', onclick: () => act('scenario', { target: Number(ui.target), name: s.key }) }, T('ui_run'))));
  const startScene = (key, mode) => act('start', { target: Number(ui.target), type: key ? 'scene' : 'gunfight', duration: key ? undefined : 40, intensity: 0.8, params: key ? { scene: key } : { mode } });
  const scenes = (P.scenes || []).map(s => h('div', { class: 'row' }, iconSvg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>', 'ic'),
    h('div', {}, h('b', {}, s.label), h('small', {}, `${T('ui_mode_' + (s.mode || 'present'))} · ${fmtTime(s.duration || 0)}`)),
    h('button', { class: 'btn pri', onclick: () => startScene(s.key) }, T('ui_run'))));
  const modes = h('div', { class: 'btns' }, ['ambush', 'crossfire', 'distant'].map(m => h('button', { class: 'btn', onclick: () => startScene(null, m) }, T('ui_mode_' + m))));
  const extra = ui.target === 'all' ? [] : [h('p', { class: 'card' }, T('ui_scenes_title')), ...scenes, h('p', { class: 'card' }, T('ui_gunfight_title')), modes];
  return h('div', { class: 'rows' }, h('p', { class: 'card' }, T('ui_scen_d')), ui.target === 'all' ? h('div', { class: 'p-empty' }, T('ui_pick_player')) : rows, ...extra,
    h('div', { class: 'btns' }, h('button', { class: 'btn dan', onclick: () => act('stop', { target: targetId() }) }, T('ui_stop'))));
}

/* --- show (cues + live intensity) --- */
function tabShow() {
  const cues = h('div', { class: 'cues' }, (P.cues || []).map(c => h('button', { class: 'cue', onclick: () => act('cue', { target: targetId(), cue: c.key }) },
    iconSvg(CUE_ICON[c.key] || CUE_ICON.glitch), h('b', {}, c.label), h('small', {}, fmtTime(c.duration || 0)))));
  const live = h('div', { class: 'card', style: { marginTop: '18px' } }, h('h3', {}, iconSvg('<path d="M4 20V10M10 20V4M16 20v-8M22 20V8" />'), T('ui_control_live')), h('p', {}, T('ui_live_hint')),
    slider({ label: T('ui_intensity'), min: 0.05, max: 1, step: .05, value: .6, fmt: v => Math.round(v * 100) + '%', onChange: v => act('adjust', { target: Number(ui.target), value: v }) }));
  return h('div', {}, h('p', { class: 'p-empty', style: { padding: '0 0 14px', textAlign: 'start' } }, T('ui_cues_d')), (P.cues || []).length ? cues : h('div', { class: 'p-empty' }, T('ui_disabled')), ui.target === 'all' ? null : live);
}

/* --- people --- */
function tabPeople() {
  const hid = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.hide_player), T('ui_hide')), h('p', {}, T('ui_hide_d')),
    h('div', { class: 'two' }, fieldOf(T('ui_viewer'), select([['all', T('ui_all')], ...playerOpts(false)], ui.hide.viewer || 'all', v => ui.hide.viewer = v)), fieldOf(T('ui_subject'), select(playerOpts(true), ui.hide.subject, v => ui.hide.subject = v))),
    slider({ label: T('ui_duration'), min: 10, max: 900, step: 10, value: ui.hide.duration, fmt: fmtTime, onInput: v => ui.hide.duration = v }),
    h('button', { class: 'btn pri', onclick: () => act('hide', { viewer: ui.hide.viewer || 'all', subject: Number(ui.hide.subject), duration: ui.hide.duration }) }, T('ui_start')));
  const solo = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.solo_visible), T('ui_solo')), h('p', {}, T('ui_solo_d')),
    h('div', { class: 'two' }, fieldOf(T('ui_subject'), select(playerOpts(true), ui.solo.subject, v => ui.solo.subject = v)), fieldOf(T('ui_viewer'), select(playerOpts(true), ui.solo.viewer, v => ui.solo.viewer = v))),
    slider({ label: T('ui_duration'), min: 10, max: 900, step: 10, value: ui.solo.duration, fmt: fmtTime, onInput: v => ui.solo.duration = v }),
    h('button', { class: 'btn pri', onclick: () => act('solo', { viewer: Number(ui.solo.viewer), subject: Number(ui.solo.subject), duration: ui.solo.duration }) }, T('ui_start')));
  const ghost = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.ghost_vision), T('ui_ghost')), h('p', {}, T('ui_ghost_d')),
    slider({ label: T('ui_alpha'), min: 10, max: 230, step: 5, value: ui.ghost.alpha, fmt: v => Math.round(v / 2.55) + '%', onInput: v => ui.ghost.alpha = v }),
    slider({ label: T('ui_duration'), min: 10, max: 900, step: 10, value: ui.ghost.duration, fmt: fmtTime, onInput: v => ui.ghost.duration = v }),
    h('button', { class: 'btn pri', onclick: () => act('ghost', { target: targetId(), alpha: ui.ghost.alpha, duration: ui.ghost.duration }) }, T('ui_start')));
  const cards = [hid, solo, ghost];
  if (P.perms.director) cards.push(h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.possess), T('ui_appear')), h('p', {}, T('ui_appear_d')),
    slider({ label: T('ui_duration'), min: 10, max: 900, step: 10, value: ui.appear.duration, fmt: fmtTime, onInput: v => ui.appear.duration = v }),
    h('button', { class: 'btn pri', disabled: ui.target === 'all', onclick: () => act('appear', { target: Number(ui.target), duration: ui.appear.duration }) }, T('ui_appear_go'))));
  return h('div', { class: 'cards' }, cards);
}

/* --- director --- */
function tabDirector() {
  const ctl = (P.types || []).filter(t => t.controllable);
  const look = h('div', { class: 'two' },
    fieldOf(T('ui_look'), select([['model', T('ui_look_model')], ['self', T('ui_look_self')], ['player', T('ui_look_player')]], ui.dir.look, v => { ui.dir.look = v; renderPanel(); })),
    ui.dir.look === 'player' ? fieldOf(T('ui_subject'), select(playerOpts(true), ui.dir.player, v => ui.dir.player = v)) : h('span'));
  const phantom = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.friend), T('ui_direct')), h('p', {}, T('ui_director_d')),
    fieldOf(T('ui_type'), select(ctl.map(t => [t.key, t.label]), ui.dir.type, v => ui.dir.type = v)), look,
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', disabled: ui.target === 'all', onclick: () => {
      const spec = ui.dir.look === 'self' ? `player:${P.me}` : (ui.dir.look === 'player' && ui.dir.player ? `player:${ui.dir.player}` : undefined);
      act('direct', { target: Number(ui.target), type: ui.dir.type, spec });
    } }, T('ui_start')), h('button', { class: 'btn dan', onclick: () => act('stop', { target: targetId() }) }, T('ui_stop'))));
  const lines = h('div', { class: 'console', id: 'console' }, ui.log.length ? ui.log.map(logLine) : h('div', { class: 'p-empty' }, T('ui_log_empty')));
  const inp = h('input', { class: 'inp', type: 'text', maxlength: 160, placeholder: T('ui_say_ph'), value: ui.say });
  const send = () => { const t = inp.value.trim(); if (!t) return; act('say', { text: t }); ui.say = ''; inp.value = ''; };
  inp.addEventListener('input', () => ui.say = inp.value); inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  const con = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.words), T('ui_console')), lines, h('div', { class: 'say-row' }, inp, h('button', { class: 'btn pri', onclick: send }, T('ui_send'))));
  const pos = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.possess), T('ui_possess')), h('p', {}, T('ui_possess_d')),
    slider({ label: T('ui_duration'), min: 10, max: 600, step: 10, value: ui.poss.duration, fmt: fmtTime, onInput: v => ui.poss.duration = v }),
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', disabled: ui.target === 'all' || !P.possess, onclick: () => act('possess', { target: Number(ui.target), duration: ui.poss.duration }) }, T('ui_possess_go')),
      h('button', { class: 'btn dan', onclick: () => act('unpossess', {}) }, T('ui_unpossess'))));
  return h('div', { class: 'cards' }, phantom, con, pos);
}
function logLine(l) { return h('div', { class: 'ln ' + l.kind }, h('small', {}, l.kind === 'say' ? T('ui_you') : playerName(l.from)), l.text); }

/* --- swap --- */
function tabSwap() {
  if (!P.swapEnabled) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  return h('div', { class: 'cards' }, h('div', { class: 'card' }, h('h3', {}, iconSvg('<path d="M4 8h14l-3-3M20 16H6l3 3"/>'), T('ui_tab_swap')), h('p', {}, T('ui_swap_d')),
    h('div', { class: 'two' }, fieldOf(T('ui_swap_a'), select(playerOpts(true), ui.swap.a, v => ui.swap.a = v)), fieldOf(T('ui_swap_b'), select(playerOpts(true), ui.swap.b, v => ui.swap.b = v))),
    slider({ label: T('ui_duration'), min: 10, max: 900, step: 10, value: ui.swap.duration, fmt: fmtTime, onInput: v => ui.swap.duration = v }),
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', onclick: () => act('swap', { a: Number(ui.swap.a), b: Number(ui.swap.b), duration: ui.swap.duration }) }, T('ui_swap_go')),
      h('button', { class: 'btn', onclick: () => act('restore', { id: ui.swap.a ? Number(ui.swap.a) : Number(ui.target) }) }, T('ui_restore')))));
}

/* --- active sessions --- */
function tabActive() {
  const list = P.active || [];
  if (!list.length) return h('div', { class: 'p-empty' }, T('ui_no_active'));
  return h('div', { class: 'rows' }, list.map(s => h('div', { class: 'live' },
    iconSvg(ICON[s.type] || ICON.ghost, 'ic'),
    h('div', { style: { minWidth: 0 } }, h('b', {}, s.label), h('small', { style: { color: 'var(--muted)' } }, `${s.targetName}  ·  #${s.target}${s.controlled ? '  ·  ' + T('ui_direct') : ''}`)),
    (() => { const w = slider({ label: '', min: 0.05, max: 1, step: .05, value: s.intensity, fmt: v => Math.round(v * 100) + '%', onChange: v => act('adjust', { sid: s.sid, target: s.target, value: v }) }); w.firstChild.firstChild.remove(); return w; })(),
    h('div', { class: 'btns', style: { alignItems: 'center', flexWrap: 'nowrap' } }, h('span', { class: 'eta' }, fmtTime(s.remaining)), h('button', { class: 'btn dan', style: { padding: '8px 14px' }, onclick: () => act('stop', { sid: s.sid }) }, T('ui_stop'))))));
}


/* ============================ takeover / world / editor / diagnostics ============================ */
const chk = (label, value, onChange) => {
  const i = h('input', { type: 'checkbox' }); i.checked = !!value; i.addEventListener('change', () => onChange(i.checked));
  return h('label', { class: 'chk' }, i, h('span', {}, label));
};
const placeOpts = () => (P.places || []).map(p => [p.key, p.label]);

/* --- takeover --- */
function tabTakeover() {
  if (!P.takeoverEnabled) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  const st = P.takeover; const all = ui.target === 'all'; const tc = P.takeoverCfg || {};
  if (ui.to.pressure == null) ui.to.pressure = tc.pressure || 'hard';
  if (ui.to.move == null) ui.to.move = !!tc.ghostMove;
  const lv = (tc.levels || ['easy', 'normal', 'hard', 'nightmare']).map(k => [k, T('ui_to_p_' + k)]);
  const status = st ? h('div', { class: 'note ok' }, T('ui_to_status_' + st.phase, st.targetName), ' · ', T('ui_to_status_pressure', T('ui_to_p_' + (st.pressure || tc.pressure || 'hard')))) : h('div', { class: 'note' }, T('ui_to_idle'));
  const go = () => act('takeover_talk', { target: Number(ui.target), pressure: ui.to.pressure, ghostMove: ui.to.move });
  return h('div', { class: 'cards' },
    h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.possess), T('ui_tab_takeover')), h('p', {}, T('ui_to_d')), status,
      h('ol', { class: 'steps' }, h('li', {}, T('ui_to_s1')), h('li', {}, T('ui_to_s2')), h('li', {}, T('ui_to_s3'))),
      fieldOf(T('ui_to_pressure'), select(lv, ui.to.pressure, v => { ui.to.pressure = v; })),
      h('div', { class: 'chk-row' }, chk(T('ui_to_move'), ui.to.move, v => { ui.to.move = v; })),
      h('div', { class: 'btns' },
        h('button', { class: 'btn pri', disabled: all || !!st, onclick: go }, T('ui_to_talk')),
        h('button', { class: 'btn pri', disabled: !st || st.phase !== 'talk', onclick: () => act('takeover_seize', { pressure: ui.to.pressure, ghostMove: ui.to.move }) }, T('ui_to_seize')),
        h('button', { class: 'btn', disabled: !st, onclick: () => act('takeover_back', {}) }, T('ui_to_back')),
        h('button', { class: 'btn dan', onclick: () => act('takeover_release', {}) }, T('ui_to_release')))),
    h('div', { class: 'card' }, h('h3', {}, iconSvg('<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'), T('ui_to_rules_t')), h('p', {}, T('ui_to_rules'))));
}

/* --- world --- */
function tabWorld() {
  const W = ui.world, cfgW = P.worldCfg || {};
  if (!cfgW.enabled) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  const all = ui.target === 'all';
  const people = (P.players || []).filter(p => String(p.id) !== String(ui.target));
  const staffList = h('div', { class: 'chk-list' }, people.length ? people.map(p => chk(`#${p.id}  ${p.name}`, W.staff[p.id], v => { if (v) W.staff[p.id] = true; else delete W.staff[p.id]; })) : h('div', { class: 'p-empty' }, T('ui_nobody')));
  if (!W.place && (P.places || [])[0]) W.place = P.places[0].key;
  const send = h('div', { class: 'card' }, h('h3', {}, iconSvg('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3.2 3 13.8 0 17M12 3.5c-3 3.2-3 13.8 0 17"/>'), T('ui_world_send')), h('p', {}, T('ui_world_d')),
    fieldOf(T('ui_world_place'), select(placeOpts(), W.place, v => W.place = v)),
    h('div', { class: 'field' }, h('span', {}, T('ui_world_staff')), staffList),
    slider({ label: T('ui_duration'), min: 10, max: Math.max(30, +cfgW.max || 1800), step: 10, value: clamp(W.seconds, 10, Math.max(30, +cfgW.max || 1800)), fmt: fmtTime, onInput: v => W.seconds = v }),
    h('div', { class: 'chk-row' }, chk(T('ui_world_bucket'), W.bucket, v => W.bucket = v), chk(T('ui_world_join'), W.join, v => W.join = v)),
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', disabled: all || !W.place, onclick: () => act('world_send', { target: Number(ui.target), place: W.place, staff: Object.keys(W.staff).map(Number), seconds: W.seconds, bucket: W.bucket, join: W.join }) }, T('ui_world_go'))));
  const worlds = P.worlds || [];
  const live = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.crowd), T('ui_world_live')),
    worlds.length ? h('div', { class: 'rows' }, worlds.map(w => {
      const add = select([['', T('ui_world_bring')]].concat((P.players || []).filter(p => p.id !== w.target).map(p => [String(p.id), `#${p.id} ${p.name}`])), '', v => { if (v) act('world_join', { target: w.target, id: Number(v) }); });
      return h('div', { class: 'live2' }, h('div', {}, h('b', {}, `${w.targetName}  →  ${w.place}`), h('small', {}, `${T('ui_world_staff')}: ${w.staff.length ? w.staff.join('، ') : '—'}  ·  ${fmtTime(w.remaining)}`)), add,
        h('button', { class: 'btn dan', onclick: () => act('world_return', { target: w.target }) }, T('ui_world_back')));
    })) : h('div', { class: 'p-empty' }, T('ui_world_none')));
  const nameInp = h('input', { class: 'inp', type: 'text', maxlength: 40, placeholder: T('ui_place_name'), value: W.newPlace });
  nameInp.addEventListener('input', () => W.newPlace = nameInp.value);
  const places = h('div', { class: 'card' }, h('h3', {}, iconSvg('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>'), T('ui_places')), h('p', {}, T('ui_places_d')),
    h('div', { class: 'rows' }, (P.places || []).map(p => h('div', { class: 'live2' }, h('div', {}, h('b', {}, p.label), h('small', {}, p.user ? T('ui_place_mine') : T('ui_place_cfg'))),
      p.user ? h('button', { class: 'btn dan', onclick: () => act('place_delete', { key: p.key }) }, T('ui_delete')) : h('span')))),
    h('div', { class: 'say-row' }, nameInp, h('button', { class: 'btn pri', onclick: () => { const n = nameInp.value.trim(); if (n) { act('place_save', { name: n }); W.newPlace = ''; } } }, T('ui_place_save'))));
  return h('div', { class: 'cards' }, send, live, places);
}

/* --- scene editor --- */
const SCENARIOS = ['', 'WORLD_HUMAN_STAND_IMPATIENT', 'WORLD_HUMAN_HANG_OUT_STREET', 'WORLD_HUMAN_CLIPBOARD', 'WORLD_HUMAN_STAND_MOBILE', 'WORLD_HUMAN_SMOKING', 'WORLD_HUMAN_STUPOR', 'WORLD_HUMAN_GUARD_STAND', 'WORLD_HUMAN_BUM_STANDING', 'WORLD_HUMAN_PARTYING'];
const WEAPONS = ['', 'WEAPON_PISTOL', 'WEAPON_COMBATPISTOL', 'WEAPON_MICROSMG', 'WEAPON_SMG', 'WEAPON_CARBINERIFLE', 'WEAPON_PUMPSHOTGUN'];
const TIMECYCLES = ['', 'NG_filmic02', 'NG_filmic05', 'hud_def_blur', 'drug_wobbly', 'REDMIST_blend', 'MP_Powerplay_blend'];
const WEATHERS = ['', 'EXTRASUNNY', 'CLEAR', 'CLOUDS', 'OVERCAST', 'FOGGY', 'RAIN', 'THUNDER', 'XMAS'];
const STEP_DO = ['walk', 'face', 'anim', 'scenario', 'aim', 'shoot', 'fall', 'rise', 'vanish'];
const EVENT_DO = ['flash', 'shake', 'sound', 'cue', 'blood', 'eyes'];
const blankScene = () => ({ Label: { ar: '', en: '' }, Mode: 'present', Duration: 30, Look: { TintStrength: .2, Strength: .6, SoundVolume: .4 }, Actors: [{ Id: 'a1', Model: 'a_m_y_hipster_01', At: { fwd: 4, right: 0 }, Heading: 'face', Lines: [], Timeline: [] }], Events: [] });
const clone = o => JSON.parse(JSON.stringify(o));

function edLoad(key) {
  const def = (P.sceneDefs || {})[key];
  ui.ed.key = key; ui.ed.scene = def ? clone(def) : blankScene(); ui.ed.sel = 0; ui.ed.builtin = !!def && !def.User;
  if (ui.ed.builtin) ui.ed.key = key + '_copy';
}
function edCanvas(sc) {
  const SZ = 380, R = 22, k = SZ / 2 / R;
  const cv = h('canvas', { width: SZ, height: SZ, class: 'ed-cv' }); const c = cv.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const col = n => css.getPropertyValue(n).trim() || '#888';
  const draw = () => {
    c.clearRect(0, 0, SZ, SZ); c.fillStyle = col('--bg'); c.fillRect(0, 0, SZ, SZ);
    c.strokeStyle = col('--border'); c.lineWidth = 1; c.font = '11px sans-serif'; c.fillStyle = col('--muted');
    for (let m = 5; m <= R; m += 5) { c.beginPath(); c.arc(SZ / 2, SZ / 2, m * k, 0, 6.283); c.stroke(); c.fillText(m + 'm', SZ / 2 + 3, SZ / 2 - m * k + 11); }
    c.beginPath(); c.moveTo(SZ / 2, 0); c.lineTo(SZ / 2, SZ); c.moveTo(0, SZ / 2); c.lineTo(SZ, SZ / 2); c.stroke();
    c.fillStyle = col('--primary'); c.beginPath(); c.moveTo(SZ / 2, SZ / 2 - 11); c.lineTo(SZ / 2 + 8, SZ / 2 + 8); c.lineTo(SZ / 2 - 8, SZ / 2 + 8); c.closePath(); c.fill();
    c.fillStyle = col('--muted'); c.fillText(T('ui_ed_you'), SZ / 2 + 12, SZ / 2 + 5);
    sc.Actors.forEach((a, i) => {
      const x = SZ / 2 + (a.At.right || 0) * k, y = SZ / 2 - (a.At.fwd || 0) * k;
      c.fillStyle = i === ui.ed.sel ? col('--danger') : col('--text'); c.beginPath(); c.arc(x, y, i === ui.ed.sel ? 8 : 6, 0, 6.283); c.fill();
      c.fillStyle = col('--text'); c.fillText((a.Name && (a.Name.ar || a.Name.en)) || a.Id || ('#' + (i + 1)), x + 10, y + 4);
    });
  };
  const pick = e => { const r = cv.getBoundingClientRect(); const sx = SZ / r.width; return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sx]; };
  let drag = -1;
  cv.addEventListener('pointerdown', e => {
    const [px, py] = pick(e); let best = -1, bd = 16;
    sc.Actors.forEach((a, i) => { const d = Math.hypot(SZ / 2 + (a.At.right || 0) * k - px, SZ / 2 - (a.At.fwd || 0) * k - py); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { drag = best; ui.ed.sel = best; cv.setPointerCapture(e.pointerId); dragging = true; draw(); }
  });
  cv.addEventListener('pointermove', e => {
    if (drag < 0) return; const [px, py] = pick(e);
    const a = sc.Actors[drag]; a.At.right = Math.round(clamp((px - SZ / 2) / k, -R, R) * 10) / 10; a.At.fwd = Math.round(clamp((SZ / 2 - py) / k, -R, R) * 10) / 10; draw();
  });
  const end = () => { if (drag >= 0) { drag = -1; dragging = false; renderPanel(); } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  draw(); return cv;
}
function numInp(v, o, cb) { const i = h('input', { class: 'inp sm', type: 'number', value: v ?? '', step: o.step || .1, min: o.min, max: o.max, 'aria-label': o.label || '' }); i.addEventListener('input', () => cb(i.value === '' ? undefined : +i.value)); return i; }
function txtInp(v, ph, cb, w) { const i = h('input', { class: 'inp' + (w ? ' ' + w : ''), type: 'text', value: v ?? '', placeholder: ph || '', maxlength: 160 }); i.addEventListener('input', () => cb(i.value)); return i; }
function listSel(list, v, cb) { return select(list.map(x => [x, x || '—']), v || '', cb); }
function setText(o, key, val) { o[key] = { ar: val, en: val }; }
const textOf = t => (t && (t.ar || t.en)) || '';

function tabEditor() {
  const E = ui.ed; if (!E.scene) edLoad('');
  const sc = E.scene, a = sc.Actors[E.sel] || null; sc.Look = sc.Look || {};
  const keys = Object.keys(P.sceneDefs || {}).sort();
  const head = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.scene || ICON.crowd), T('ui_tab_editor')), h('p', {}, T('ui_ed_d')),
    h('div', { class: 'two' },
      fieldOf(T('ui_ed_open'), select([['', T('ui_ed_new')]].concat(keys.map(k => [k, (((P.sceneDefs[k] || {}).User) ? '★ ' : '') + (textOf((P.sceneDefs[k] || {}).Label) || k)])), keys.includes(E.key) ? E.key : '', v => { edLoad(v); renderPanel(); })),
      fieldOf(T('ui_ed_key'), txtInp(E.key, 'my_scene', v => E.key = v.replace(/[^\w]/g, '').slice(0, 32)))),
    h('div', { class: 'two' }, fieldOf(T('ui_ed_label'), txtInp(textOf(sc.Label), '', v => setText(sc, 'Label', v))),
      fieldOf(T('ui_ed_mode'), select([['past', T('ui_ed_past')], ['present', T('ui_ed_present')]], sc.Mode, v => sc.Mode = v))),
    slider({ label: T('ui_duration'), min: 5, max: 300, step: 1, value: clamp(sc.Duration || 30, 5, 300), fmt: fmtTime, onInput: v => sc.Duration = v }),
    h('div', { class: 'two' }, fieldOf(T('ui_ed_timecycle'), listSel(TIMECYCLES, sc.Look.Timecycle, v => sc.Look.Timecycle = v || undefined)),
      fieldOf(T('ui_ed_weather'), listSel(WEATHERS, sc.Look.Weather, v => sc.Look.Weather = v || undefined))),
    h('div', { class: 'two' }, fieldOf(T('ui_ed_tint'), (() => { const i = h('input', { type: 'color', value: sc.Look.Tint || '#000000', class: 'clr' }); i.addEventListener('input', () => sc.Look.Tint = i.value); return i; })()),
      fieldOf(T('ui_ed_hour'), numInp(sc.Look.Clock ? sc.Look.Clock.h : '', { min: 0, max: 23, step: 1 }, v => { if (v === undefined) delete sc.Look.Clock; else sc.Look.Clock = { h: v, m: 0 }; }))),
    h('div', { class: 'chk-row' }, chk(T('ui_ed_grain'), sc.Look.Grain, v => sc.Look.Grain = v)));
  const actorsCard = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.crowd), T('ui_ed_actors')), h('p', {}, T('ui_ed_drag')), edCanvas(sc),
    h('div', { class: 'chips' }, sc.Actors.map((x, i) => h('button', { class: 'chip' + (i === E.sel ? ' on' : ''), onclick: () => { E.sel = i; renderPanel(); } }, textOf(x.Name) || x.Id || ('#' + (i + 1)))),
      h('button', { class: 'chip', disabled: sc.Actors.length >= 12, onclick: () => { sc.Actors.push({ Id: 'a' + (sc.Actors.length + 1), Model: 'a_m_y_hipster_01', At: { fwd: 4, right: sc.Actors.length * 1.5 }, Heading: 'face', Lines: [], Timeline: [] }); E.sel = sc.Actors.length - 1; renderPanel(); } }, '+ ' + T('ui_ed_add'))));
  const parts = [head, actorsCard];
  if (a) {
    a.Lines = a.Lines || []; a.Timeline = a.Timeline || [];
    const lines = a.Lines.map((ln, i) => h('div', { class: 'row3' }, numInp(ln.t, { min: 0, max: 300, step: .5, label: 't' }, v => ln.t = v ?? 0), txtInp(textOf(ln.text), T('ui_ed_say'), v => setText(ln, 'text', v)),
      h('button', { class: 'btn dan sm', onclick: () => { a.Lines.splice(i, 1); renderPanel(); } }, '×')));
    const steps = a.Timeline.map((st, i) => {
      const extra = [];
      if (st.Do === 'walk') extra.push(numInp(st.to && st.to.fwd, { label: 'fwd' }, v => { st.to = st.to || {}; st.to.fwd = v ?? 0; }), numInp(st.to && st.to.right, { label: 'right' }, v => { st.to = st.to || {}; st.to.right = v ?? 0; }));
      if (st.Do === 'shoot') extra.push(numInp(st.shots, { step: 1, min: 1, max: 12, label: T('ui_ed_shots') }, v => st.shots = v), txtInp(st.at, T('ui_ed_at'), v => st.at = v || undefined, 'sm'));
      if (st.Do === 'aim') extra.push(txtInp(st.at, T('ui_ed_at'), v => st.at = v || undefined, 'sm'));
      if (st.Do === 'anim') extra.push(txtInp(st.dict, 'dict', v => st.dict = v, 'sm'), txtInp(st.name, 'name', v => st.name = v, 'sm'));
      if (st.Do === 'scenario') extra.push(listSel(SCENARIOS, st.name, v => st.name = v));
      return h('div', { class: 'row3' }, numInp(st.t, { min: 0, max: 300, step: .5, label: 't' }, v => st.t = v ?? 0), select(STEP_DO.map(d => [d, T('ui_do_' + d)]), st.Do, v => { st.Do = v; renderPanel(); }), h('div', { class: 'extra' }, extra),
        h('button', { class: 'btn dan sm', onclick: () => { a.Timeline.splice(i, 1); renderPanel(); } }, '×'));
    });
    parts.push(h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.friend), T('ui_ed_actor') + ' ' + (E.sel + 1)),
      h('div', { class: 'two' }, fieldOf(T('ui_ed_name'), txtInp(textOf(a.Name), '', v => setText(a, 'Name', v))), fieldOf(T('ui_ed_model'), txtInp(a.Model, 'a_m_y_hipster_01', v => a.Model = v.replace(/[^\w]/g, '')))),
      h('div', { class: 'two' }, fieldOf(T('ui_ed_scenario'), listSel(SCENARIOS, a.Scenario, v => a.Scenario = v || undefined)), fieldOf(T('ui_ed_weapon'), listSel(WEAPONS, a.Weapon, v => a.Weapon = v || undefined))),
      h('div', { class: 'two' }, chk(T('ui_ed_lookme'), a.LookAtMe !== false, v => a.LookAtMe = v), h('button', { class: 'btn dan', disabled: sc.Actors.length <= 1, onclick: () => { sc.Actors.splice(E.sel, 1); E.sel = 0; renderPanel(); } }, T('ui_ed_rm'))),
      h('div', { class: 'field' }, h('span', {}, T('ui_ed_lines')), lines, h('button', { class: 'btn sm', onclick: () => { a.Lines.push({ t: (a.Lines.length ? (a.Lines[a.Lines.length - 1].t || 0) + 5 : 2), text: { ar: '', en: '' } }); renderPanel(); } }, '+ ' + T('ui_ed_add'))),
      h('div', { class: 'field' }, h('span', {}, T('ui_ed_timeline')), steps, h('button', { class: 'btn sm', onclick: () => { a.Timeline.push({ t: (a.Timeline.length ? (a.Timeline[a.Timeline.length - 1].t || 0) + 5 : 5), Do: 'walk', to: { fwd: 2, right: 0 } }); renderPanel(); } }, '+ ' + T('ui_ed_add')))));
  }
  sc.Events = sc.Events || [];
  const evs = sc.Events.map((ev, i) => {
    const extra = [];
    if (ev.Do === 'shake') extra.push(numInp(ev.amount, { min: 0, max: 1, label: T('ui_ed_amount') }, v => ev.amount = v));
    if (ev.Do === 'sound' || ev.Do === 'cue') extra.push(txtInp(ev.name, 'name', v => ev.name = v.replace(/[^\w]/g, ''), 'sm'));
    if (ev.Do === 'eyes') {
      extra.push(select([['lids', T('ui_ed_eye_lids')], ['watcher', T('ui_ed_eye_watcher')]], ev.name === 'watcher' ? 'watcher' : 'lids', v => ev.name = v));
      extra.push(numInp(ev.seconds, { min: 2, max: 30, step: 1, label: T('ui_ed_seconds') }, v => ev.seconds = v));
      extra.push(numInp(ev.amount, { min: 0, max: 1, step: .1, label: T('ui_ed_blinks') }, v => ev.amount = v));
    }
    return h('div', { class: 'row3' }, numInp(ev.t, { min: 0, max: 300, step: .5, label: 't' }, v => ev.t = v ?? 0), select(EVENT_DO.map(d => [d, T('ui_ev_' + d)]), ev.Do, v => { ev.Do = v; renderPanel(); }), h('div', { class: 'extra' }, extra),
      h('button', { class: 'btn dan sm', onclick: () => { sc.Events.splice(i, 1); renderPanel(); } }, '×'));
  });
  const save = () => { if (!E.key) return say(T('ui_ed_need_key'), 'bad'); act('scene_save', { key: E.key, scene: sc }); };
  parts.push(h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.cue || ICON.flicker), T('ui_ed_events')), h('div', { class: 'field' }, evs, h('button', { class: 'btn sm', onclick: () => { sc.Events.push({ t: 5, Do: 'flash' }); renderPanel(); } }, '+ ' + T('ui_ed_add'))),
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', onclick: save }, T('ui_ed_save')),
      h('button', { class: 'btn', onclick: () => { if (!E.key) return say(T('ui_ed_need_key'), 'bad'); act('scene_save', { key: E.key, scene: sc }); setTimeout(() => act('start', { target: P.me, type: 'scene', duration: Math.round((sc.Duration || 30) + 5), intensity: .7, params: { scene: E.key } }), 400); } }, T('ui_ed_preview')),
      h('button', { class: 'btn dan', disabled: !(P.userScenes || []).includes(E.key), onclick: () => { act('scene_delete', { key: E.key }); E.scene = null; } }, T('ui_delete')))));
  return h('div', { class: 'cards ed' }, parts);
}

/* --- diagnostics --- */
/* reliability: why a hallucination did not work + the full self-test */
function healthCards() {
  const H = P.health; if (!H) return [];
  const st = H.selftest, mins = Math.max(1, Math.round(((P.types || []).filter(t => !t.needsSubject).length * 9.5) / 60));
  const head = h('div', { class: 'card' }, h('h3', {}, iconSvg('<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5L15.5 9.5"/>'), T('ui_hl_title')), h('p', {}, T('ui_hl_d')),
    h('p', { class: 'muted' }, T('ui_hl_test_d', mins)),
    h('div', { class: 'btns' },
      st && st.running ? h('button', { class: 'btn dan', onclick: () => act('selftest_stop', {}) }, `${T('ui_hl_stop')}  ·  ${T('ui_hl_progress', st.i, st.n)}`)
        : h('button', { class: 'btn pri', onclick: () => act('selftest_start', {}) }, T('ui_hl_test')),
      h('button', { class: 'btn', onclick: () => act('health_reset', {}) }, T('ui_hl_clear'))));
  const cards = [head];
  if (st && st.results.length) {
    const bad = st.results.filter(r => !r.ok);
    cards.push(h('div', { class: 'card' }, h('h3', {}, T('ui_diag_result') + `  ${st.results.length - bad.length}/${st.results.length}`),
      h('div', { class: 'note ' + (bad.length ? 'bad' : 'ok') }, bad.length ? T('ui_hl_fails') + ': ' + bad.length : T('ui_hl_ok')),
      h('div', { class: 'rows' }, st.results.map(r => h('div', { class: 'live2' }, h('div', {}, h('b', {}, r.label), r.reason ? h('small', {}, r.reason) : null), h('span', { class: 'p-badge' + (r.ok ? '' : ' swap') }, r.ok ? '✓' : '✕'))))));
  }
  const fails = (H.stats || []).filter(x => x.fails > 0);
  cards.push(h('div', { class: 'card' }, h('h3', {}, T('ui_hl_recent')),
    (H.log || []).length ? h('div', { class: 'rows' }, H.log.slice().reverse().map(l => h('div', { class: 'live2' }, h('div', {}, h('b', {}, `${l.label}  ·  ${l.name}`), h('small', {}, l.reason)), h('span', { class: 'p-badge swap' }, '✕'))))
      : h('div', { class: 'p-empty' }, T('ui_hl_none')),
    fails.length ? h('div', { class: 'rows' }, fails.map(f => h('div', { class: 'live2' }, h('div', {}, h('b', {}, f.label), h('small', {}, `${T('ui_hl_runs')} ${f.runs}  ·  ${T('ui_hl_fails')} ${f.fails}  ·  ${f.last || ''}`))))) : null));
  return cards;
}
function tabDiag() {
  const D = ui.diag;
  const run = h('div', { class: 'card' }, h('h3', {}, iconSvg('<path d="M4 12h4l2-6 4 12 2-6h4"/>'), T('ui_tab_diag')), h('p', {}, T('ui_diag_d')),
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', disabled: D.running, onclick: () => { D.running = true; D.result = null; D.done = 0; post('diagRun', {}); renderPanel(); } }, D.running ? `${T('ui_diag_running')} ${D.done}/${D.total}` : T('ui_diag_run'))));
  const cards = [...healthCards(), run];
  if (D.result) {
    const r = D.result;
    cards.push(h('div', { class: 'card' }, h('h3', {}, T('ui_diag_result')),
      h('div', { class: 'note ' + (r.bad.length ? 'bad' : 'ok') }, r.bad.length ? T('ui_diag_bad', r.bad.length, r.total) : T('ui_diag_good', r.total)),
      h('div', { class: 'rows' }, r.bad.map(b => h('div', { class: 'live2' }, h('div', {}, h('b', {}, b.name), h('small', {}, `${T('ui_diag_k_' + b.kind)}  ·  ${b.where}`)), h('span', { class: 'p-badge swap' }, '✕')))),
      h('div', { class: 'rows' }, (r.info || []).map(i => h('div', { class: 'live2' }, h('div', {}, h('b', {}, i.name), h('small', {}, `${i.kind}${i.note ? '  ·  ' + i.note : ''}`)), h('span', { class: 'p-badge' + (i.ok ? '' : ' swap') }, i.ok ? '✓' : '✕'))))));
    if ((r.log || []).length) cards.push(h('div', { class: 'card' }, h('h3', {}, T('ui_diag_log')), h('div', { class: 'console' }, r.log.map(l => h('div', { class: 'ln' }, l)))));
  }
  return h('div', { class: 'cards' }, cards);
}

/* --- haunted zones --- */
function zoneInit(zc, typeOptions) {
  const Z = ui.zone, df = (zc && zc.defaults) || {};
  if (!Z.type) { Z.type = typeOptions.find(o => o[0] === df.Type) ? df.Type : (typeOptions[0] || [''])[0]; Z.radius = df.Radius || 25; Z.intensity = df.Intensity || .6; Z.duration = df.Duration || 60; Z.chance = df.Chance || .35; Z.cooldown = df.Cooldown || 180; }
}
function tabZones() {
  const zc = P.zoneCfg || {}; if (!zc.enabled) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  const Z = ui.zone;
  const typeOptions = (P.zoneTypes || []).map(k => [k, (typeDef(k) || {}).short || k]);
  zoneInit(zc, typeOptions);
  const nameInp = txtInp(Z.name, T('ui_zone_name'), v => Z.name = v);
  const form = h('div', { class: 'card' }, h('h3', {}, iconSvg('<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="2.2"/>'), T('ui_zone_new')), h('p', {}, T('ui_zone_d')),
    fieldOf(T('ui_zone_name'), nameInp), fieldOf(T('ui_type'), select(typeOptions, Z.type, v => Z.type = v)),
    slider({ label: T('ui_zone_radius'), min: 3, max: 200, step: 1, value: Z.radius, fmt: v => v + ' m', onInput: v => Z.radius = v }),
    slider({ label: T('ui_intensity'), min: .05, max: 1, step: .05, value: Z.intensity, fmt: v => Math.round(v * 100) + '%', onInput: v => Z.intensity = v }),
    slider({ label: T('ui_duration'), min: 5, max: 300, step: 5, value: Z.duration, fmt: fmtTime, onInput: v => Z.duration = v }),
    slider({ label: T('ui_zone_chance'), min: 0.05, max: 1, step: .05, value: Z.chance, fmt: v => Math.round(v * 100) + '%', onInput: v => Z.chance = v }),
    slider({ label: T('ui_zone_cooldown'), min: 10, max: 1800, step: 10, value: Z.cooldown, fmt: fmtTime, onInput: v => Z.cooldown = v }),
    h('div', { class: 'btns' }, h('button', { class: 'btn pri', onclick: () => { act('zone_save', { here: true, zone: { label: Z.name || Z.type, type: Z.type, radius: Z.radius, intensity: Z.intensity, duration: Z.duration, chance: Z.chance, cooldown: Z.cooldown } }); Z.name = ''; } }, T('ui_zone_here'))));
  const list = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.ghost), T('ui_zone_list')),
    (P.zones || []).length ? h('div', { class: 'rows' }, P.zones.map(z => h('div', { class: 'live2' },
      h('div', {}, h('b', {}, textOf(z.label) || z.key), h('small', {}, `${(typeDef(z.type) || {}).short || z.type}  ·  ${z.radius} m  ·  ${Math.round(z.chance * 100)}%  ·  ${fmtTime(z.cooldown)}`)),
      chk(T('ui_zone_on'), z.enabled, v => act('zone_save', { zone: Object.assign({}, z, { enabled: v }) })),
      h('button', { class: 'btn dan', onclick: () => act('zone_delete', { key: z.key }) }, T('ui_delete'))))) : h('div', { class: 'p-empty' }, T('ui_zone_none')));
  return h('div', { class: 'cards' }, form, list);
}


/* --- settings: the whitelisted options of shared/settings.lua, saved by the server --- */
const setKey = k => 'ui_set_' + k.replace(/\./g, '_');
function settingRow(S, d) {
  const val = S.values[d.k], changed = Object.prototype.hasOwnProperty.call(S.saved || {}, d.k);
  const save = v => act('setting_set', { key: d.k, value: v });
  let ctl;
  if (d.t === 'bool') ctl = chk(T(setKey(d.k)), val, save);
  else if (d.t === 'num') {
    const pct = d.max <= 1;
    ctl = slider({ label: T(setKey(d.k)), min: d.min, max: d.max, step: d.step || 1, value: val, fmt: v => pct ? Math.round(v * 100) + '%' : (d.max >= 60 ? fmtTime(v) : String(v)), onChange: save });
  } else if (d.t === 'enum') ctl = fieldOf(T(setKey(d.k)), select((d.v || []).map(v => [v, T('ui_level_' + v) === 'ui_level_' + v ? v : T('ui_level_' + v)]), val, save));
  else if (d.t === 'color') {
    const i = h('input', { type: 'color', class: 'clr', value: /^#[0-9a-fA-F]{6}$/.test(val || '') ? val : '#000000', 'aria-label': T(setKey(d.k)) });
    i.addEventListener('change', () => save(i.value.toUpperCase()));
    ctl = fieldOf(T(setKey(d.k)), h('span', { class: 'clr-row' }, i, h('code', {}, String(val || ''))));
  }
  return h('div', { class: 'set-row' + (changed ? ' on' : '') }, ctl,
    changed ? h('span', { class: 'set-tag' }, T('ui_set_changed'), h('button', { class: 'lnk', title: T('ui_set_default'), onclick: () => act('setting_clear', { key: d.k }) }, '↺')) : null);
}
function tabSettings() {
  const S = P.settings; if (!S) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  const groups = [];
  for (const d of S.defs) { let g = groups.find(x => x[0] === d.g); if (!g) groups.push(g = [d.g, []]); g[1].push(d); }
  const cards = groups.map(([g, list]) => h('div', { class: 'card' }, h('h3', {}, T('ui_set_g_' + g)), list.map(d => settingRow(S, d))));
  const ta = h('textarea', { class: 'inp json', rows: 6, spellcheck: 'false', placeholder: T('ui_set_json_ph'), 'aria-label': T('ui_set_json') }); ta.value = JSON.stringify(S.saved || {}, null, 2);
  const io = h('div', { class: 'card' }, h('h3', {}, T('ui_set_io')), h('p', {}, T('ui_set_io_d')), ta,
    h('div', { class: 'btns' },
      h('button', { class: 'btn', onclick: () => { ta.value = JSON.stringify(S.saved || {}, null, 2); ta.select(); try { document.execCommand('copy'); say(T('ui_set_copied'), 'ok'); } catch (e) { } } }, T('ui_set_export')),
      h('button', { class: 'btn pri', onclick: () => { let o; try { o = JSON.parse(ta.value || '{}'); } catch (e) { return say(T('ui_set_bad_json'), 'bad'); } if (!o || typeof o !== 'object' || Array.isArray(o)) return say(T('ui_set_bad_json'), 'bad'); act('settings_import', { data: o }); } }, T('ui_set_import')),
      h('button', { class: 'btn dan', onclick: () => act('settings_reset', {}) }, T('ui_set_reset_all'))));
  return h('div', { class: 'cards' }, h('div', { class: 'card' }, h('h3', {}, iconSvg('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'), T('ui_tab_settings')), h('p', {}, T('ui_set_d'))), cards, io);
}

/* --- map: players, zones, places and live hallucinations on the GTA V map (or a kilometre grid) --- */
const mapImg = { src: null, el: null, ok: false };
function mapView() { return ui.map || (ui.map = { zoom: 1, cx: null, cy: null, pick: null, hover: null, layers: { players: true, zones: true, places: true, active: true } }); }
function tabMap() {
  const M = cfg.map || {}, B = M.bounds || { minX: -4000, maxX: 4500, minY: -4300, maxY: 8000 };
  if (!P.mapOn) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  const V = mapView(); if (V.cx == null) { V.cx = (B.minX + B.maxX) / 2; V.cy = (B.minY + B.maxY) / 2; }
  if (M.image && mapImg.src !== M.image) { mapImg.src = M.image; mapImg.ok = false; const im = new Image(); im.onload = () => { mapImg.el = im; mapImg.ok = true; }; im.onerror = () => { mapImg.ok = false; }; im.src = M.image; }
  const SZW = 760, SZH = 440;
  const cv = h('canvas', { width: SZW, height: SZH, class: 'map-cv' }); const c = cv.getContext('2d');
  const css = getComputedStyle(document.documentElement), col = n => css.getPropertyValue(n).trim() || '#888';
  const base = () => Math.min(SZW / (B.maxX - B.minX), SZH / (B.maxY - B.minY));
  const sc = () => base() * V.zoom;
  const toS = (x, y) => [SZW / 2 + (x - V.cx) * sc(), SZH / 2 - (y - V.cy) * sc()];
  const toW = (px, py) => [V.cx + (px - SZW / 2) / sc(), V.cy - (py - SZH / 2) / sc()];
  const clampView = () => { V.cx = clamp(V.cx, B.minX, B.maxX); V.cy = clamp(V.cy, B.minY, B.maxY); V.zoom = clamp(V.zoom, 1, 40); };
  const players = () => (P.players || []).filter(p => p.x != null);
  const activeIds = () => new Set((P.active || []).map(a => String(a.target)));
  function draw(tm) {
    c.clearRect(0, 0, SZW, SZH); c.fillStyle = col('--bg'); c.fillRect(0, 0, SZW, SZH);
    const k = sc();
    if (mapImg.ok && mapImg.el) {
      const [x0, y0] = toS(B.minX, B.maxY); c.globalAlpha = .9; c.drawImage(mapImg.el, x0, y0, (B.maxX - B.minX) * k, (B.maxY - B.minY) * k); c.globalAlpha = 1;
      c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, 0, SZW, SZH);
    } else {
      // kilometre grid: the land is unknown without an image, so the grid and the named places are the map
      let step = 1000; while (step * k < 46) step *= 2;
      c.lineWidth = 1; c.font = '10px sans-serif';
      for (let x = Math.ceil(B.minX / step) * step; x <= B.maxX; x += step) { const [sx] = toS(x, 0); c.strokeStyle = x === 0 ? col('--muted') : col('--border'); c.beginPath(); c.moveTo(sx, 0); c.lineTo(sx, SZH); c.stroke(); c.fillStyle = col('--muted'); c.fillText(x / 1000 + 'km', sx + 3, SZH - 4); }
      for (let y = Math.ceil(B.minY / step) * step; y <= B.maxY; y += step) { const [, sy] = toS(0, y); c.strokeStyle = y === 0 ? col('--muted') : col('--border'); c.beginPath(); c.moveTo(0, sy); c.lineTo(SZW, sy); c.stroke(); c.fillStyle = col('--muted'); c.fillText(y / 1000 + 'km', 4, sy - 3); }
      const [bx0, by0] = toS(B.minX, B.maxY), [bx1, by1] = toS(B.maxX, B.minY); c.strokeStyle = col('--primary'); c.globalAlpha = .35; c.strokeRect(bx0, by0, bx1 - bx0, by1 - by0); c.globalAlpha = 1;
      c.font = '12px sans-serif'; (M.pois || []).forEach(([n, x, y]) => { const [sx, sy] = toS(x, y); c.fillStyle = col('--muted'); c.beginPath(); c.arc(sx, sy, 2.5, 0, 6.283); c.fill(); c.fillText(n, sx + 6, sy + 4); });
    }
    if (V.layers.zones) (P.zones || []).forEach(z => {
      const [sx, sy] = toS(z.x, z.y), r = Math.max(5, z.radius * k); c.fillStyle = col('--danger'); c.globalAlpha = z.enabled ? .16 : .05; c.beginPath(); c.arc(sx, sy, r, 0, 6.283); c.fill();
      c.globalAlpha = z.enabled ? .9 : .35; c.strokeStyle = col('--danger'); c.setLineDash([5, 4]); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
      c.fillStyle = col('--text'); c.font = '11px sans-serif'; c.fillText(textOf(z.label) || z.key, sx + 7, sy - 6);
    });
    if (V.layers.places) (P.places || []).forEach(p => {
      const [sx, sy] = toS(p.x, p.y); c.fillStyle = col('--accent'); c.beginPath(); c.moveTo(sx, sy - 7); c.lineTo(sx + 6, sy); c.lineTo(sx, sy + 7); c.lineTo(sx - 6, sy); c.closePath(); c.fill();
      c.fillStyle = col('--text'); c.font = '11px sans-serif'; c.fillText(p.label, sx + 9, sy + 4);
    });
    const act = activeIds();
    if (V.layers.players) players().forEach(p => {
      const [sx, sy] = toS(p.x, p.y), me = p.id === P.me, sel = String(ui.target) === String(p.id);
      if (V.layers.active && act.has(String(p.id))) { const ph = ((tm || 0) / 900 + p.id * .37) % 1; c.strokeStyle = col('--danger'); c.globalAlpha = 1 - ph; c.lineWidth = 2; c.beginPath(); c.arc(sx, sy, 8 + ph * 24, 0, 6.283); c.stroke(); c.globalAlpha = 1; c.lineWidth = 1; }
      c.fillStyle = act.has(String(p.id)) ? col('--danger') : col('--primary'); c.beginPath(); c.arc(sx, sy, sel ? 7 : 5, 0, 6.283); c.fill();
      if (me) { c.strokeStyle = col('--text'); c.lineWidth = 2; c.beginPath(); c.arc(sx, sy, 9, 0, 6.283); c.stroke(); c.lineWidth = 1; }
      if (sel) { c.strokeStyle = col('--primary'); c.beginPath(); c.arc(sx, sy, 12, 0, 6.283); c.stroke(); }
      c.fillStyle = col('--text'); c.font = 'bold 11px sans-serif'; c.fillText(p.name, sx + 10, sy + 4);
    });
    if (V.pick) { const [sx, sy] = toS(V.pick.x, V.pick.y); c.strokeStyle = col('--text'); c.lineWidth = 2; c.beginPath(); c.moveTo(sx - 10, sy); c.lineTo(sx + 10, sy); c.moveTo(sx, sy - 10); c.lineTo(sx, sy + 10); c.stroke(); c.lineWidth = 1; c.beginPath(); c.arc(sx, sy, 6, 0, 6.283); c.stroke(); }
  }
  let down = null, moved = false;
  cv.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, cx: V.cx, cy: V.cy }; moved = false; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(), f = SZW / r.width, px = (e.clientX - r.left) * f, py = (e.clientY - r.top) * f;
    const [wx, wy] = toW(px, py); V.hover = [Math.round(wx), Math.round(wy)]; const ro = $('#map-xy'); if (ro) ro.textContent = `X ${V.hover[0]}   Y ${V.hover[1]}`;
    if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (!moved && Math.hypot(dx, dy) > 4) { moved = true; dragging = true; }
    if (moved) { V.cx = down.cx - dx * f / sc(); V.cy = down.cy + dy * f / sc(); clampView(); }
  });
  cv.addEventListener('pointerup', e => {
    const wasMoved = moved; down = null; moved = false; dragging = false; if (wasMoved) return;
    const r = cv.getBoundingClientRect(), f = SZW / r.width, px = (e.clientX - r.left) * f, py = (e.clientY - r.top) * f;
    let hit = null, bd = 14; players().forEach(p => { const [sx, sy] = toS(p.x, p.y), d = Math.hypot(sx - px, sy - py); if (d < bd) { bd = d; hit = p; } });
    if (hit) { ui.target = String(hit.id); V.pick = { x: hit.x, y: hit.y }; } else { const [wx, wy] = toW(px, py); V.pick = { x: Math.round(wx), y: Math.round(wy) }; }
    renderPanel();
  });
  cv.addEventListener('wheel', e => {
    e.preventDefault(); const r = cv.getBoundingClientRect(), f = SZW / r.width, px = (e.clientX - r.left) * f, py = (e.clientY - r.top) * f;
    const [wx, wy] = toW(px, py); V.zoom = clamp(V.zoom * (e.deltaY < 0 ? 1.25 : .8), 1, 40);
    V.cx = wx - (px - SZW / 2) / sc(); V.cy = wy + (py - SZH / 2) / sc(); clampView();
  }, { passive: false });
  const loop = tm => { if (!cv.isConnected) return; draw(tm); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);

  const layerBtn = (k, label) => h('button', { class: 'btn sm' + (V.layers[k] ? ' pri' : ''), onclick: () => { V.layers[k] = !V.layers[k]; renderPanel(); } }, label);
  const zoomBtn = (label, f) => h('button', { class: 'btn sm', onclick: () => { V.zoom = clamp(V.zoom * f, 1, 40); clampView(); } }, label);
  const bar = h('div', { class: 'map-bar' }, layerBtn('players', T('ui_map_players')), layerBtn('zones', T('ui_map_zones')), layerBtn('places', T('ui_map_places')), layerBtn('active', T('ui_map_active')), h('span', { class: 'p-sp' }),
    zoomBtn('+', 1.4), zoomBtn('−', .7),
    h('button', { class: 'btn sm', onclick: () => { V.zoom = 1; V.cx = (B.minX + B.maxX) / 2; V.cy = (B.minY + B.maxY) / 2; } }, T('ui_map_reset')),
    h('button', { class: 'btn sm', onclick: () => { const p = players().find(x => String(x.id) === String(ui.target)) || players().find(x => x.id === P.me); if (p) { V.cx = p.x; V.cy = p.y; V.zoom = Math.max(V.zoom, 6); clampView(); } } }, T('ui_map_center')));
  const canvasCard = h('div', { class: 'card map-card' }, bar, h('div', { class: 'map-wrap' }, cv), h('div', { class: 'map-foot' }, h('span', { id: 'map-xy' }, V.hover ? `X ${V.hover[0]}   Y ${V.hover[1]}` : ''),
    h('span', {}, mapImg.src && !mapImg.ok ? T('ui_map_noimg') : (M.image ? '' : T('ui_map_grid')))));

  // pick card: create a zone at the picked point
  let pickCard;
  if (!V.pick) pickCard = h('div', { class: 'card' }, h('h3', {}, T('ui_map_pick')), h('p', {}, T('ui_map_hint')));
  else {
    const kids = [h('h3', {}, T('ui_map_picked')), h('p', {}, `X ${V.pick.x}   Y ${V.pick.y}`)];
    if (P.perms.admin && (P.zoneCfg || {}).enabled) {
      const typeOptions = (P.zoneTypes || []).map(k => [k, (typeDef(k) || {}).short || k]); zoneInit(P.zoneCfg, typeOptions); const Z = ui.zone;
      kids.push(fieldOf(T('ui_zone_name'), txtInp(Z.name, T('ui_zone_name'), v => Z.name = v)), fieldOf(T('ui_type'), select(typeOptions, Z.type, v => Z.type = v)),
        slider({ label: T('ui_zone_radius'), min: 3, max: 200, step: 1, value: Z.radius, fmt: v => v + ' m', onInput: v => Z.radius = v }),
        h('div', { class: 'btns' }, h('button', { class: 'btn pri', onclick: () => { act('zone_save', { at: { x: V.pick.x, y: V.pick.y }, zone: { label: Z.name || Z.type, type: Z.type, radius: Z.radius, intensity: Z.intensity, duration: Z.duration, chance: Z.chance, cooldown: Z.cooldown } }); Z.name = ''; } }, T('ui_map_create_zone'))));
    }
    pickCard = h('div', { class: 'card' }, kids);
  }
  return h('div', { class: 'cards' }, canvasCard, pickCard);
}

/* --- mind (stress) --- */
function tabMind() {
  const mc = P.mindCfg || {}; if (!mc.enabled) return h('div', { class: 'p-empty' }, T('ui_disabled'));
  const max = +mc.max || 100; const sel = ui.target === 'all' ? null : (P.players || []).find(p => String(p.id) === String(ui.target));
  const lv = (mc.levels || []).slice().sort((a, b) => a.at - b.at);
  const colorFor = v => { let c = 'var(--ok)'; if (lv[0] && v >= lv[0].at) c = '#F2C94C'; if (lv[1] && v >= lv[1].at) c = '#E8A15B'; if (lv[2] && v >= lv[2].at) c = 'var(--danger)'; return c; };
  const rows = h('div', { class: 'rows' }, (P.players || []).map(p => h('button', { class: 'mind-row' + (sel && sel.id === p.id ? ' sel' : ''), onclick: () => { ui.target = String(p.id); renderPanel(); } },
    h('b', {}, p.name), h('div', { class: 'bar' }, h('i', { style: { width: clamp(p.stress / max * 100, 0, 100) + '%', background: colorFor(p.stress) } })), h('span', { class: 'num' }, String(p.stress)))));
  const ctl = h('div', { class: 'card' }, h('h3', {}, iconSvg(ICON.heartbeat || ICON.ghost), T('ui_tab_mind')), h('p', {}, T('ui_mind_d')),
    h('div', { class: 'note' }, sel ? `${sel.name}: ${sel.stress}/${max}` : T('ui_mind_pick')),
    h('div', { class: 'btns' }, [[-25, 'ui_mind_m25'], [-10, 'ui_mind_m10'], [10, 'ui_mind_p10'], [25, 'ui_mind_p25']].map(([v, k]) => h('button', { class: 'btn' + (v < 0 ? '' : ' dan'), disabled: !sel, onclick: () => act('mind_add', { target: sel.id, value: v }) }, T(k))),
      h('button', { class: 'btn pri', disabled: !sel, onclick: () => act('mind_set', { target: sel.id, value: 0 }) }, T('ui_mind_reset'))),
    h('div', { class: 'field' }, h('span', {}, T('ui_mind_levels')), lv.map(l => h('div', { class: 'lvl' }, h('b', {}, '≥ ' + l.at), h('span', {}, (l.types || []).map(k => (typeDef(k) || {}).short || k).join('، '))))));
  return h('div', { class: 'cards' }, h('div', { class: 'card' }, h('h3', {}, T('ui_mind_players')), rows), ctl);
}

let lastSig = '';
const sigOf = d => { try { return JSON.stringify(d, (k, v) => (k === 'sceneDefs' ? undefined : v)); } catch (_) { return String(Math.random()); } };
function openPanel(data) {
  P = data; panelOpen = true; if (!P.sceneDefs) P.sceneDefs = {}; lastSig = sigOf(P); lastTabShown = null;
  const pn = $('#panel'); pn.classList.remove('hidden'); pn.classList.add('enter'); setTimeout(() => pn.classList.remove('enter'), 600); renderPanel();
  clearInterval(pTimer); pTimer = setInterval(() => post('panelRefresh', {}), clamp(+cfg.panelRefresh || 2000, 1000, 10000));
}
function closePanel() { panelOpen = false; clearInterval(pTimer); $('#panel').classList.add('hidden'); post('panelClose', {}); }
function panelData(data) {
  if (!panelOpen) return; data.sceneDefs = data.sceneDefs || (P && P.sceneDefs) || {}; P = data;
  const sig = sigOf(data); if (sig === lastSig) return;   // nothing changed: do not touch the DOM (no flicker, no lost hover/scroll)
  lastSig = sig;
  if (dragging || document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
    // never rebuild under the user's hands: only refresh the live parts
    const rail = $('.p-list'); if (rail && document.activeElement.className !== 'p-search') rail.replaceWith(renderRail().querySelector('.p-list'));
    return;
  }
  renderPanel();
}
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('#reply').classList.contains('hidden')) { $('#reply').classList.add('hidden'); post('replyClose', {}); }
  else if (panelOpen) closePanel();
});

/* ============================ message router ============================ */
const H = {
  config: d => { applyConfig(d); Snd.setMaster((d.sounds || {}).master ?? .9); },
  notify: toast, overlay: setOverlay, flash, word, hint: showHint, clear: clearAll, clearSession: d => clearSession(d.prefix || ''),
  sound: d => Snd.play(d), soundUpdate: d => Snd.update(d), soundStop: d => (d.all ? Snd.stopAll(d.fade) : Snd.stop(d.id, d.fade)),
  dialogue: showDialogue, dialogueHide: hideDialogue,
  dialogueChoice: d => { const li = $(`#dlg-choices li[data-n="${d.n}"]`); if (li) li.classList.add('picked'); },
  bubble, bubblePos, pulse: d => cue({ name: 'pulse', seconds: 3, strength: d.strength }), cue,
  eye: eyePlay, eyeStop, resistPrompt, resistOpen, resist: resistState, resistTap, resistEnd, resistClose, resistSpike,
  possessHud, replyOpen, replyClose: () => $('#reply').classList.add('hidden'),
  panelOpen: d => openPanel(d), panelData, panelClose: () => { panelOpen = false; clearInterval(pTimer); $('#panel').classList.add('hidden'); },
  diagProgress: d => { ui.diag.done = d.done; ui.diag.total = d.total; if (ui.tab === 'diag' && panelOpen) renderPanel(); },
  diagResult: d => { ui.diag.running = false; ui.diag.result = d; if (panelOpen) renderPanel(); },
  panelResult: d => { say(d.message, d.ok ? 'ok' : 'bad'); if (d.ok) post('panelRefresh', {}); },
  panelLog: d => { ui.log.push({ kind: d.kind, from: d.from, text: d.text }); if (ui.log.length > 80) ui.log.shift(); const c = $('#console'); if (c) { if (ui.log.length === 1) c.replaceChildren(); c.append(logLine(ui.log[ui.log.length - 1])); c.scrollTop = c.scrollHeight; } },
};
addEventListener('message', e => {
  const m = e.data; if (!m || typeof m.action !== 'string') return;
  const fn = H[m.action]; if (fn) { try { fn(m.data || {}); } catch (err) { console.error('[universal_hallucination]', m.action, err); } }
});
post('ready', {});
