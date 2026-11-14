/* Universal Hallucination | Ra7 DEV | Dev by: Abudaqa | https://discord.gg/Zk5CrhHYe | MIT
   html/eye.js - the eye hallucination: the screen becomes an eye that opens and closes.
     mode 'lids'    : your own eyelids. THE SCREEN IS THE EYE: you see the world only through an eye-shaped opening
                      (pointed corners, lashes, blood-shot rim). It opens, blinks, sinks shut until it is completely closed
                      (black), stays shut for a while, then opens again until the whole screen is back (pattern 'sleep')
     mode 'watcher' : a huge eye opens in the dark, looks around, then locks onto you
   Everything is drawn from one deterministic function (UH_EYE.render), so the page and the promo video share the code. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const EASE = { lin: x => x, in: x => x * x * x, out: x => 1 - Math.pow(1 - x, 3), inout: x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) };
  function rng(seed) { let s = (seed >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  /* ---- the opening: [seconds, open 0..1, easing] steps; open 1 = lids out of the screen ---- */
  function timeline(p) {
    const r = rng(p.seed || 7), sp = clamp(+p.speed || 1, .4, 2.5), total = clamp(+p.seconds || 5, 1.5, 30);
    const steps = []; const add = (d, v, e) => steps.push([d / sp, v, e || 'inout']);
    const hold = (d, v) => add(d, v, 'lin');
    const blink = () => { add(.13, 0, 'in'); hold(.06 + r() * .14, 0); add(.26, 1, 'out'); };
    const blinkE = () => { add(.13, 0, 'in'); hold(.06 + r() * .14, 0); add(.26, .58, 'out'); };      // blink inside the eye shape
    const pat = p.pattern || 'blink';
    add(.001, 0, 'lin');
    if (pat === 'sleep') {
      // opens a little and shuts, opens to the whole eye shape, blinks, sinks closed, black for a while, then opens until the screen is fully back
      add(1.3, .34); hold(.3, .34); add(.45, 0, 'in');
      hold(.35, 0); add(1.0, .58); hold(.4, .58);
      add(.2, .18, 'in'); add(.3, .6, 'out');
      add(.2, 0, 'in'); hold(.1, 0); add(.35, .6, 'out'); hold(.5, .6);
      add(1.6, .12); add(.7, 0, 'in');
      hold(1.8, 0);
      add(2.0, .42); add(.5, .3); add(1.6, .58); hold(.3, .58); add(1.4, 1, 'out');
    } else if (pat === 'wake') {
      add(1.5, .45); add(.35, .3); add(.9, .58, 'out'); add(.35, .5); add(.6, 1, 'out');
    } else if (pat === 'heavy') {
      add(.9, .55, 'out'); add(2.0, .2); add(.25, .4, 'out'); add(.9, .1); add(.12, .58, 'out'); add(.45, .3); add(1.3, .03, 'in'); hold(.5, 0); add(1.5, 1, 'out');
    } else if (pat === 'close') {
      add(.8, .58, 'out'); hold(.5, .58); add(.5, 0, 'in'); hold(Math.max(1, total - 4.6), 0); add(1.8, 1, 'out');
    } else if (pat === 'stare') {
      add(2.4, 1, 'out'); hold(1.2 + r() * 1.2, 1); blink(); hold(1.1 + r(), 1); add(.9, .82); hold(.9, .82); add(.5, 1, 'out');
    } else {
      add(.55, .58, 'out'); const n = Math.max(1, Math.round(+p.blinks || 2));
      for (let i = 0; i < n; i++) { hold(.3 + r() * .7, .58); blinkE(); }
      hold(.3, .58); add(.7, 1, 'out');
    }
    let t = 0; const keys = [[0, 0]];
    for (const [d, v, e] of steps) { t += d; keys.push([t, v, e]); }
    const k = t > total ? total / t : 1;                // too long: squeeze to fit
    for (const kk of keys) kk[0] *= k;
    const end = keys[keys.length - 1][0];
    if (end < total) keys.push([total, keys[keys.length - 1][1], 'lin']);
    return { keys, total: Math.max(end, total) };
  }
  function openAt(tl, t) {
    const ks = tl.keys; if (t <= 0) return 0; if (t >= ks[ks.length - 1][0]) return ks[ks.length - 1][1];
    for (let i = 1; i < ks.length; i++) {
      if (t <= ks[i][0]) {
        const a = ks[i - 1], b = ks[i], d = b[0] - a[0] || 1e-6, x = (t - a[0]) / d;
        return a[1] + (b[1] - a[1]) * (EASE[b[2]] || EASE.inout)(x);
      }
    }
    return 1;
  }
  /* moments to put a sound on: closing to shut (eyelid), first opening (eye_open) */
  function soundTimes(tl) {
    const out = []; let first = true;
    for (let i = 1; i < tl.keys.length; i++) {
      const a = tl.keys[i - 1], b = tl.keys[i];
      if (b[1] < .08 && a[1] > .1) out.push({ t: a[0], name: 'eyelid', vol: .8 });
      if (a[1] < .1 && b[1] > .5) { out.push({ t: a[0], name: first ? 'eye_open' : 'eyelid', vol: first ? 1 : .55 }); first = false; }
    }
    return out;
  }

  /* ---- drawing ---- */
  let el = null, refs = null;
  function svg(tag, attrs, parent) { const n = document.createElementNS(NS, tag); for (const k in attrs || {}) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
  function build() {
    if (refs) return refs;
    el = document.getElementById('eye');
    el.innerHTML = '<div class="eye-blur"></div><div class="eye-glow"></div>';
    const s = svg('svg', { id: 'eye-svg', viewBox: '0 0 1000 600', preserveAspectRatio: 'none' }); el.appendChild(s);
    const defs = svg('defs', {}, s);
    const f = svg('filter', { id: 'eye-soft', x: '-20%', y: '-40%', width: '140%', height: '180%' }, defs); const blur = svg('feGaussianBlur', { stdDeviation: 6 }, f);
    const g1 = svg('radialGradient', { id: 'eye-scl', cx: '50%', cy: '50%', r: '70%' }, defs);
    [['0', '#efe6da'], ['.55', '#d3c2ab'], ['.85', '#9b7b66'], ['1', '#4a2c25']].forEach(([o, c]) => svg('stop', { offset: o, 'stop-color': c }, g1));
    const g2 = svg('radialGradient', { id: 'eye-iris', cx: '50%', cy: '50%', r: '50%' }, defs);
    const irisStops = [svg('stop', { offset: '0', 'stop-color': '#000' }, g2), svg('stop', { offset: '.3', 'stop-color': '#000' }, g2), svg('stop', { offset: '.34', 'stop-color': '#fff' }, g2), svg('stop', { offset: '.8', 'stop-color': '#fff' }, g2), svg('stop', { offset: '1', 'stop-color': '#000' }, g2)];
    const mask = svg('mask', { id: 'eye-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1000, height: 600 }, defs);
    svg('rect', { width: 1000, height: 600, fill: '#fff' }, mask);
    const hole = svg('path', { fill: '#000', filter: 'url(#eye-soft)' }, mask);
    const clip = svg('clipPath', { id: 'eye-clip' }, defs); const clipP = svg('path', {}, clip);
    const ball = svg('g', { 'clip-path': 'url(#eye-clip)' }, s);
    svg('rect', { x: -50, y: -50, width: 1100, height: 700, fill: 'url(#eye-scl)' }, ball);
    const veins = svg('g', { fill: 'none', 'stroke-linecap': 'round' }, ball);
    const iris = svg('g', {}, ball);
    const irisDisc = svg('circle', { r: 150, fill: '#a07a22' }, iris);
    const fibres = svg('g', { stroke: '#000', 'stroke-opacity': '.28', 'stroke-width': 2 }, iris);
    for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2, r0 = 50 + (i % 3) * 8; svg('line', { x1: Math.cos(a) * r0, y1: Math.sin(a) * r0, x2: Math.cos(a) * 148, y2: Math.sin(a) * 148 }, fibres); }
    svg('circle', { r: 150, fill: 'url(#eye-iris)', 'fill-opacity': '.0' }, iris);
    svg('circle', { r: 148, fill: 'none', stroke: '#150d05', 'stroke-width': 16, 'stroke-opacity': '.85' }, iris);
    const pupil = svg('ellipse', { rx: 48, ry: 48, fill: '#030101' }, iris);
    const shine = svg('g', { 'fill-opacity': '.8' }, ball);
    const sh1 = svg('ellipse', { rx: 26, ry: 14, fill: '#fff', transform: 'rotate(-28)' }, shine); const sh2 = svg('ellipse', { rx: 9, ry: 6, fill: '#fff' }, shine);
    const dark = svg('rect', { width: 1000, height: 600, fill: '#070101', mask: 'url(#eye-mask)' }, s);
    const rim2 = svg('path', { fill: 'none', stroke: '#8a2a1f', 'stroke-width': 46, 'stroke-opacity': '.22', filter: 'url(#eye-soft)' }, s);        // skin of the lids around the opening
    const rim = svg('path', { fill: 'none', stroke: '#3a0707', 'stroke-width': 16, 'stroke-opacity': '.8', filter: 'url(#eye-soft)' }, s);
    const lashT = svg('path', { fill: 'none', stroke: '#000', 'stroke-width': 26, 'stroke-dasharray': '2 11' }, s);
    const lashB = svg('path', { fill: 'none', stroke: '#000', 'stroke-width': 14, 'stroke-dasharray': '1.6 16', 'stroke-opacity': '.8' }, s);
    refs = { s, blur, hole, clipP, ball, veins, iris, irisDisc, irisStops, pupil, sh1, sh2, dark, rim, rim2, lashT, lashB, built: '' };
    return refs;
  }
  const GEO = { lids: { x0: -600, x1: 1600, c: 1100 }, watcher: { x0: 60, x1: 940, c: 600 } };
  function render(p, t) {
    const R = build(); const tl = p._tl || (p._tl = timeline(p));
    const mode = p.mode === 'watcher' ? 'watcher' : 'lids';
    let v = clamp(typeof p.v === 'number' ? p.v : openAt(tl, t), 0, 1.06);      // p.v: an exact opening (used by the promo video)
    const flutter = (p.pattern === 'heavy' && v > .05 && v < .9) ? Math.sin(t * 17) * .018 + Math.sin(t * 29) * .01 : 0;
    v = clamp(v + flutter, 0, 1.06);
    let x0, x1, ct, cb;
    if (mode === 'watcher') { const G = GEO.watcher; x0 = G.x0; x1 = G.x1; ct = 300 - G.c * v; cb = 300 + G.c * v * .55; }
    else {
      // lids: the screen IS the eye. v 0..0.6 = the almond grows (corners stay on screen), 0.6..1 = it spreads out past the screen
      const grow = clamp(v / .6, 0, 1), sp = clamp((v - .6) / .4, 0, 1), s2 = sp * sp * (3 - 2 * sp);
      x0 = 25 - 720 * s2; x1 = 975 + 720 * s2; ct = 300 - 490 * grow - 1000 * s2; cb = 300 + 390 * grow + 1000 * s2;
    }
    const top = `M${x0.toFixed(1)} 300 Q500 ${ct.toFixed(1)} ${x1.toFixed(1)} 300`, bot = `Q500 ${cb.toFixed(1)} ${x0.toFixed(1)} 300Z`;
    R.hole.setAttribute('d', top + bot); R.clipP.setAttribute('d', top + bot);
    R.rim.setAttribute('d', top + ' Q500 ' + cb.toFixed(1) + ' ' + x0.toFixed(1) + ' 300'); R.rim2.setAttribute('d', R.rim.getAttribute('d'));
    R.lashT.setAttribute('d', top); R.lashB.setAttribute('d', `M${x1.toFixed(1)} 300 Q500 ${cb.toFixed(1)} ${x0.toFixed(1)} 300`);
    const I = clamp(+p.intensity || .6, .1, 1), soft = 4 + (1 - Math.min(v, 1)) * (10 + 14 * I);
    R.blur.setAttribute('stdDeviation', soft.toFixed(1));
    R.dark.setAttribute('fill-opacity', mode === 'watcher' ? 1 : .99); R.dark.setAttribute('fill', p.color || '#070101');
    el.dataset.mode = mode;
    const veinsOn = p.veins !== false;
    R.rim.setAttribute('stroke-opacity', veinsOn ? .85 : .35);
    // blur of the world behind the lids (lids mode only)
    const bl = (mode === 'lids' && p.blur !== false) ? (Math.max(0, 1 - v * 1.15) * (9 + 11 * I) + (p.pattern === 'heavy' ? 3 : 0)) : 0;
    el.style.setProperty('--eye-blur', bl.toFixed(1) + 'px');
    el.style.setProperty('--eye-glow', (veinsOn ? .55 : .2) * (1 - Math.min(v, 1) * .6));
    const fade = Math.min(1, t / .12) * Math.min(1, Math.max(0, (tl.total - t) / .35));
    el.style.opacity = fade.toFixed(3);
    if (mode === 'watcher') {
      const key = (p.iris || '#b8902a') + '|' + (p.seed || 7) + '|' + (p.slit ? 1 : 0);
      if (R.built !== key) {
        R.built = key; R.irisDisc.setAttribute('fill', p.iris || '#b8902a');
        const r2 = rng((p.seed || 7) + 11); R.veins.innerHTML = '';
        for (let i = 0; i < 34; i++) {
          const left = r2() < .5, y = 140 + r2() * 320, x = left ? 70 : 930, tx = 500 + (left ? -1 : 1) * (185 + r2() * 70), ty = 300 + (y - 300) * .3;
          svg('path', { d: `M${x} ${y} C${x + (tx - x) * .4} ${y + (r2() - .5) * 120} ${x + (tx - x) * .7} ${ty + (r2() - .5) * 90} ${tx} ${ty}`, stroke: `rgba(${140 + (r2() * 40) | 0},14,18,${(.25 + r2() * .35 * (veinsOn ? 1 : .3)).toFixed(2)})`, 'stroke-width': (1 + r2() * 2.6).toFixed(1) }, R.veins);
        }
      }
      // saccades: quick jumps between random targets, then it settles on the viewer
      const r3 = rng((p.seed || 7) * 31); let gx = 0, gy = 0, px = 0, py = 0, tt = 0; const lock = tl.total - 2.2;
      while (tt < t) { const d = .7 + r3() * 1.5; px = gx; py = gy; if (tt + d > lock) { gx = 0; gy = 0; } else { gx = (r3() - .5) * 300; gy = (r3() - .5) * 140; } if (t < tt + d) { const x = EASE.out(clamp((t - tt) / .14, 0, 1)); gx = px + (gx - px) * x; gy = py + (gy - py) * x; break; } tt += d; }
      const dil = 1 + .55 * Math.sin(t * 2.1) * .25 + (v > .9 ? .35 * I : 0) + (t > lock ? .55 : 0);
      R.iris.setAttribute('transform', `translate(${(500 + gx).toFixed(1)} ${(300 + gy).toFixed(1)}) scale(${(1 + .08 * Math.sin(t * 1.3)).toFixed(3)})`);
      const pr = clamp(40 * dil, 26, 95);
      if (p.slit) { R.pupil.setAttribute('rx', (pr * .34).toFixed(1)); R.pupil.setAttribute('ry', (pr * 1.9).toFixed(1)); } else { R.pupil.setAttribute('rx', pr.toFixed(1)); R.pupil.setAttribute('ry', pr.toFixed(1)); }
      R.sh1.setAttribute('transform', `translate(${(430 + gx * .35).toFixed(1)} ${(238 + gy * .3).toFixed(1)}) rotate(-28)`); R.sh2.setAttribute('transform', `translate(${(560 + gx * .35).toFixed(1)} ${(352 + gy * .3).toFixed(1)})`);
      R.ball.style.display = '';
    } else R.ball.style.display = 'none';
    return v;
  }

  /* ---- playing it on the page ---- */
  let cur = null, raf = 0;
  function stop() { cancelAnimationFrame(raf); cur = null; if (el) { el.classList.add('hidden'); el.style.opacity = 0; } if (window.UH_EYE_SND) window.UH_EYE_SND.stop(); }
  function play(d, sound) {
    build(); stop();
    const p = Object.assign({ seed: (Math.random() * 99999) | 0, intensity: .6, pattern: 'blink', mode: 'lids' }, d || {});
    p._tl = timeline(p); cur = { p, t0: performance.now(), snd: soundTimes(p._tl), si: 0 };
    el.classList.remove('hidden');
    const loop = now => {
      if (!cur) return; const t = (now - cur.t0) / 1000;
      render(cur.p, t);
      while (cur.si < cur.snd.length && cur.snd[cur.si].t <= t) { const s = cur.snd[cur.si++]; if (sound) sound({ id: (cur.p.id || 'eye') + ':' + cur.si, name: s.name, volume: clamp(s.vol * (.55 + .45 * cur.p.intensity), 0, 1), rate: .92 + Math.random() * .16 }); }
      if (t >= cur.p._tl.total) { stop(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  window.UH_EYE = { timeline, openAt, soundTimes, render, play, stop, isPlaying: () => !!cur, ownedBy: prefix => !!cur && String(cur.p.id || '').startsWith(prefix) };
})();
