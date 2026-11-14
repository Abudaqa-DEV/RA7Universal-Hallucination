/* Universal Hallucination | Ra7 DEV | Dev by: Abudaqa | https://discord.gg/Zk5CrhHYe | MIT
   faces.js - the scary faces of the jump scare. All drawn here as SVG (nothing to download, original art).
   FACES[id] = function () -> svg string   |   viewBox 0 0 400 500
   Add your own: window.UH_FACES.my_face = () => '<svg viewBox="0 0 400 500">...</svg>'  (then list its id in Config.Jumpscare.Faces) */
(function () {
  const R = (a, b) => a + Math.random() * (b - a);
  const D = `<defs>
    <radialGradient id="fPale" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#e9e4d8"/><stop offset=".6" stop-color="#a9a496"/><stop offset="1" stop-color="#2a2824"/></radialGradient>
    <radialGradient id="fRot" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#a7b48f"/><stop offset=".6" stop-color="#5f6e4f"/><stop offset="1" stop-color="#1a2016"/></radialGradient>
    <radialGradient id="fSick" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#c8c47a"/><stop offset=".6" stop-color="#7d7a3c"/><stop offset="1" stop-color="#201f0c"/></radialGradient>
    <radialGradient id="fBlue" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#9fb4b8"/><stop offset=".6" stop-color="#52666c"/><stop offset="1" stop-color="#0e1618"/></radialGradient>
    <radialGradient id="fChar" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#4a3a30"/><stop offset=".7" stop-color="#1c140f"/><stop offset="1" stop-color="#060403"/></radialGradient>
    <radialGradient id="eyeW" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#f2f2f2"/><stop offset="1" stop-color="#9a9a9a"/></radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="14"/></filter>
    <filter id="smoke" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="3" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="46"/><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 -.12"/></filter>
  </defs>`;
  const svg = (inner, extra) => `<svg viewBox="0 0 400 500" ${extra || ''}>${D}${inner}</svg>`;
  const veins = (n, cx, cy, spread, col, w) => Array.from({ length: n }, () => {
    let x = cx + R(-spread, spread), y = cy + R(-spread, spread), d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    for (let i = 0; i < 4; i++) { x += R(-26, 26); y += R(8, 34); d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w || 1.6}" stroke-linecap="round" opacity="${R(.5, .9).toFixed(2)}"/>`;
  }).join('');
  const drips = (xs, col, y0) => xs.map(x => { const l = R(40, 150); return `<path d="M${x} ${y0}c0 ${l * .4} 2 ${l * .7} 0 ${l}" stroke="${col}" stroke-width="${R(3, 7).toFixed(1)}" fill="none" stroke-linecap="round" opacity=".9"/>`; }).join('');
  const teeth = (x0, x1, y, n, h, col) => { let s = ''; const w = (x1 - x0) / n; for (let i = 0; i < n; i++) { const x = x0 + i * w, hh = h * R(.6, 1.2); s += `<path d="M${x.toFixed(1)} ${y}l${(w / 2).toFixed(1)} ${hh.toFixed(1)}l${(w / 2).toFixed(1)} -${hh.toFixed(1)}z" fill="${col || '#d9d2bd'}" stroke="#1a1410" stroke-width=".8"/>`; } return s; };
  const hair = (n, col, x0, x1, y0, len, w) => Array.from({ length: n }, () => {
    const x = R(x0, x1), sway = R(-70, 70);
    return `<path d="M${x.toFixed(0)} ${y0}c${(sway * .3).toFixed(0)} ${(len * .3).toFixed(0)} ${(sway).toFixed(0)} ${(len * .6).toFixed(0)} ${(sway * R(.2, 1.3)).toFixed(0)} ${len}" fill="none" stroke="${col}" stroke-width="${R(w * .4, w).toFixed(1)}" stroke-linecap="round"/>`;
  }).join('');
  const eye = (x, y, rx, ry, glowCol, pupil) => `<g filter="url(#glow)"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${glowCol || '#fff'}"/></g>` + (pupil ? `<circle cx="${x}" cy="${y}" r="${pupil}" fill="#000"/>` : '');

  const FACES = {
    /* long black hair, glowing white eyes, a pale sliver of face, grey stained dress */
    ghost_girl: () => svg(`
      <path d="M40 500c10-90 40-120 110-130l100 0c70 10 100 40 110 130z" fill="#6c6a68"/><path d="M60 500c20-70 50-95 100-104-30 30-40 70-34 104z" fill="#2a2826" opacity=".6"/>
      <path d="M120 400l20 60M250 420l-16 70M180 440l6 60" stroke="#5a1111" stroke-width="6" opacity=".55" stroke-linecap="round"/>
      <path d="M95 140c0-80 40-118 105-118s105 38 105 118c0 130 40 250 55 330H40c15-80 55-200 55-330z" fill="#050505"/>
      ${hair(110, '#000', 80, 320, 30, 480, 7)}${hair(60, '#0d0d0d', 100, 300, 24, 420, 4)}
      <path d="M146 112c10-14 98-14 108 0 8 56 6 140-6 206-8 18-88 18-96 0-12-66-14-150-6-206z" fill="url(#fPale)" filter="url(#rough)"/>
      <path d="M150 120c8 80 6 170 16 210M250 120c-8 80-6 170-16 210" stroke="#000" stroke-width="12" opacity=".5" fill="none"/>
      ${eye(178, 184, 11, 8, '#ffffff')}${eye(222, 184, 11, 8, '#ffffff')}
      <path d="M178 272q22 7 44 0" stroke="#150909" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      ${drips([186, 214], '#3a0000', 190)}
      <path d="M170 150h60v40h-60z" fill="#000" opacity=".45"/>`),

    /* hair parted: both eyes black voids with white pin-pricks, stretched cracked grin */
    ghost_bride: () => svg(`
      <path d="M30 500c0-120 20-230 70-300 20-60 60-170 100-170s80 110 100 170c50 70 70 180 70 300z" fill="#040404"/>
      ${hair(120, '#000', 60, 340, 24, 500, 8)}
      <path d="M120 150c20-40 140-40 160 0 12 60 4 140-24 190-20 34-92 34-112 0-28-50-36-130-24-190z" fill="url(#fPale)" filter="url(#rough)"/>
      <ellipse cx="164" cy="212" rx="22" ry="30" fill="#000"/><ellipse cx="236" cy="212" rx="22" ry="30" fill="#000"/>
      <circle cx="166" cy="206" r="3.4" fill="#fff" filter="url(#glow)"/><circle cx="234" cy="206" r="3.4" fill="#fff" filter="url(#glow)"/>
      <path d="M164 242c-6 40-8 80-4 110M236 242c6 40 8 80 4 110" stroke="#0a0000" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M140 316q60 56 120 0q-60 20-120 0z" fill="#0b0000"/>${teeth(148, 252, 322, 14, 11, '#cfc7b0')}
      <path d="M140 316l-14-10M260 316l14-10" stroke="#3a0000" stroke-width="4"/>`),

    /* decayed green face, hole in the cheek showing teeth, one eye gone, blood */
    zombie_rot: () => svg(`
      <path d="M200 20c80 0 126 60 126 150 0 60-20 100-46 130l-12 110H132l-12-110c-26-30-46-70-46-130C74 80 120 20 200 20z" fill="url(#fRot)" filter="url(#rough)"/>
      <path d="M96 150c20-60 60-84 104-84s84 24 104 84c-20-30-60-44-104-44S116 120 96 150z" fill="#1c1a12" opacity=".7"/>
      <ellipse cx="148" cy="190" rx="27" ry="32" fill="#0d0a06"/><ellipse cx="252" cy="190" rx="27" ry="32" fill="#0d0a06"/>
      <circle cx="252" cy="194" r="17" fill="#d8d6a0"/><circle cx="256" cy="196" r="6.5" fill="#3a1a00"/>
      <path d="M232 178l12 10M268 176l-10 14" stroke="#7a0d0d" stroke-width="2.4"/>
      <path d="M194 240l-14 40q20 10 40 0l-14-40z" fill="#1a1308"/><ellipse cx="190" cy="270" rx="5" ry="8" fill="#000"/><ellipse cx="212" cy="270" rx="5" ry="8" fill="#000"/>
      <path d="M270 250c26 10 38 40 24 62-12 6-30 0-40-14z" fill="#3a0505"/><path d="M262 270h24v26h-24z" fill="#0c0000"/>${teeth(262, 288, 270, 4, 12, '#bfb596')}
      <path d="M122 330c40 34 116 34 156 0 8 30-10 60-78 62-68-2-86-32-78-62z" fill="#090000"/>${teeth(134, 266, 338, 11, 20, '#c9bfa0')}${teeth(144, 258, 372, 9, -14, '#bcb292')}
      ${veins(14, 200, 230, 110, '#1a2a12', 1.8)}${drips([140, 170, 230, 270, 200], '#5a0000', 330)}
      <path d="M96 128l-24-26M320 150l30-40M300 100l22-40" stroke="#0e0c08" stroke-width="4" stroke-linecap="round"/>`),

    /* dislocated jaw hanging, milky eyes */
    zombie_jaw: () => svg(`
      <path d="M200 24c76 0 120 56 120 138 0 40-12 70-30 94-6 50-10 96-18 130H128c-8-34-12-80-18-130-18-24-30-54-30-94C80 80 124 24 200 24z" fill="url(#fRot)" filter="url(#rough)"/>
      <ellipse cx="150" cy="170" rx="30" ry="26" fill="#0b0805"/><ellipse cx="250" cy="170" rx="30" ry="26" fill="#0b0805"/>
      <circle cx="150" cy="172" r="19" fill="#e3e2d0"/><circle cx="250" cy="172" r="19" fill="#e3e2d0"/><circle cx="150" cy="172" r="6" fill="#6b6a58"/><circle cx="250" cy="172" r="6" fill="#6b6a58"/>
      ${veins(6, 150, 172, 16, '#8a1a1a', 1.4)}${veins(6, 250, 172, 16, '#8a1a1a', 1.4)}
      <path d="M200 206l-10 30q10 8 20 0z" fill="#10140a"/>
      <path d="M118 262c18-26 60-30 82-30s64 4 82 30c-6 8-26 14-82 14s-76-6-82-14z" fill="#150000"/>${teeth(130, 270, 262, 12, 16, '#d0c8a8')}
      <path d="M126 266c-10 70-6 130 20 170 30 20 78 20 108 0 26-40 30-100 20-170-30 20-118 20-148 0z" fill="#0a0000"/>
      <path d="M140 400q60 60 120 0q-10 44-60 52-50-8-60-52z" fill="#7a1b25"/>${teeth(146, 254, 276, 10, 18, '#c4bb9b')}${teeth(150, 250, 420, 8, -14, '#b3aa8c')}
      ${drips([160, 200, 240, 176, 226], '#5a0000', 420)}${veins(10, 200, 120, 100, '#1b2a14', 1.6)}`),

    /* the scream: huge mouth, black rings around the eyes */
    screamer: () => svg(`
      <path d="M200 20c84 0 130 70 130 160 0 60-30 110-60 140l-10 150H140l-10-150c-30-30-60-80-60-140C70 90 116 20 200 20z" fill="url(#fPale)" filter="url(#rough)"/>
      <ellipse cx="144" cy="168" rx="38" ry="44" fill="#050000"/><ellipse cx="256" cy="168" rx="38" ry="44" fill="#050000"/>
      <circle cx="144" cy="174" r="9" fill="#fff" filter="url(#glow)"/><circle cx="256" cy="174" r="9" fill="#fff" filter="url(#glow)"/>
      <path d="M100 112l78 26M300 112l-78 26" stroke="#0b0000" stroke-width="12" stroke-linecap="round"/>
      <path d="M176 230l-12 52q36 14 72 0l-12-52q-24 8-48 0z" fill="#241a14"/>
      <path d="M118 296c0 80 28 166 82 166s82-86 82-166c-30 24-134 24-164 0z" fill="#040000"/>${teeth(134, 266, 306, 9, 22, '#d8d0bb')}
      <path d="M146 440c20 14 88 14 108 0-6 14-30 24-54 24s-48-10-54-24z" fill="#6a1520"/>
      <path d="M118 296c-8 20-10 40-6 60M282 296c8 20 10 40 6 60" stroke="#000" stroke-width="10" opacity=".6" fill="none"/>
      ${veins(8, 200, 80, 90, '#3a1010', 1.6)}${hair(26, '#0a0a0a', 100, 300, 24, 130, 4)}`),

    /* charred, glowing cracks */
    burnt: () => svg(`
      <path d="M200 20c80 0 124 58 124 144 0 40-14 74-34 98l-8 120H118l-8-120c-20-24-34-58-34-98C76 78 120 20 200 20z" fill="url(#fChar)" filter="url(#rough)"/>
      <g filter="url(#glow)" stroke="#ff7a1a" stroke-linecap="round" fill="none">
        <path d="M200 30l-10 60 22 50-18 70" stroke-width="3"/><path d="M120 120l40 40 30 4M290 130l-50 40-6 40" stroke-width="2.4"/><path d="M110 260l60 20 30 50M300 250l-60 36-20 50" stroke-width="2.6"/><path d="M150 360l50 20 50-20" stroke-width="2.4"/>
      </g>
      <ellipse cx="150" cy="180" rx="26" ry="30" fill="#000"/><ellipse cx="250" cy="180" rx="26" ry="30" fill="#000"/>
      <circle cx="150" cy="182" r="6" fill="#ffae3a" filter="url(#glow)"/><circle cx="250" cy="182" r="6" fill="#ffae3a" filter="url(#glow)"/>
      <path d="M190 232l-8 30q18 8 36 0l-8-30z" fill="#000"/>
      <path d="M120 316c40 40 120 40 160 0v14c-20 70-140 70-160 0z" fill="#150403"/>${teeth(134, 266, 324, 10, 18, '#e8dfc8')}
      ${Array.from({ length: 22 }, () => `<circle cx="${R(60, 340).toFixed(0)}" cy="${R(20, 470).toFixed(0)}" r="${R(1, 3.4).toFixed(1)}" fill="#ff9a3a" opacity="${R(.4, 1).toFixed(2)}" filter="url(#glow)"/>`).join('')}`),

    /* black smoke figure, red slits, white shark smile */
    shadow_grin: () => svg(`
      <g filter="url(#smoke)"><path d="M200 10c92 0 140 80 140 180 0 70-30 120-60 160l20 150H100l20-150c-30-40-60-90-60-160C60 90 108 10 200 10z" fill="#020202"/></g>
      <g filter="url(#glow)"><path d="M124 168q24-22 56-8-26 22-56 8zM276 168q-24-22-56-8 26 22 56 8z" fill="#ff1a1a"/></g>
      <path d="M96 270q104 120 208 0q-104 60-208 0z" fill="#f2efe6" filter="url(#glow)"/>${teeth(110, 290, 280, 17, 28, '#fff')}
      <path d="M96 270q104 60 208 0" stroke="#000" stroke-width="3" fill="none"/>`),

    /* many staring eyes */
    many_eyes: () => svg(`
      <path d="M200 20c84 0 130 66 130 150 0 66-34 110-62 140l-10 160H142l-10-160c-28-30-62-74-62-140C70 86 116 20 200 20z" fill="url(#fPale)" filter="url(#rough)"/>
      ${[[150, 150, 26], [250, 150, 26], [200, 112, 18], [112, 214, 18], [288, 214, 18], [200, 200, 22], [160, 250, 12], [240, 250, 12]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .8}" fill="#f6f1e4" stroke="#210000" stroke-width="3"/><circle cx="${x + R(-r * .3, r * .3)}" cy="${y + R(-r * .2, r * .3)}" r="${r * .42}" fill="#a31212"/><circle cx="${x + R(-r * .3, r * .3)}" cy="${y}" r="${r * .2}" fill="#000"/>${veins(2, x, y, r * .6, '#c01818', 1)}`).join('')}
      <path d="M150 330h100" stroke="#100000" stroke-width="7" stroke-linecap="round"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${156 + i * 11} 318v24" stroke="#210000" stroke-width="3"/>`).join('')}
      ${drips([150, 250, 200], '#6a0000', 170)}`),

    /* smooth face, no eyes, a dark vertical mouth */
    faceless: () => svg(`
      <path d="M200 18c88 0 130 70 130 160 0 70-34 110-62 140l-10 160H142l-10-160c-28-30-62-70-62-140C70 88 112 18 200 18z" fill="url(#fPale)"/>
      <path d="M200 18c88 0 130 70 130 160 0 70-34 110-62 140l-10 160H142l-10-160c-28-30-62-70-62-140C70 88 112 18 200 18z" filter="url(#grain)" opacity=".7"/>
      <path d="M142 170q-6 18 0 30M258 170q6 18 0 30" stroke="#6b665a" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M142 200c-4 60-6 110 4 140M258 200c4 60 6 110-4 140" stroke="#5a0000" stroke-width="3.6" fill="none" opacity=".75"/>
      <path d="M200 260c-18 8-24 40-18 80 4 26 32 26 36 0 6-40 0-72-18-80z" fill="#050000"/><path d="M190 276v70M210 276v70" stroke="#c9bfa8" stroke-width="2" opacity=".5"/>
      <path d="M192 215l-6 30q14 8 28 0l-6-30z" fill="#8c877a" opacity=".6"/>`),

    /* drowned: blue-grey, seaweed hair, white-blue eyes, dripping */
    drowned: () => svg(`
      <path d="M96 170c-4-90 44-150 104-150s108 60 104 150c-2 30 24 160 40 330H56c16-170 42-300 40-330z" fill="#0f1a14"/>
      ${hair(90, '#24402c', 70, 330, 40, 470, 6)}
      <path d="M200 70c60 0 104 50 104 116 0 56-30 100-56 124l-8 90H160l-8-90c-26-24-56-68-56-124 0-66 44-116 104-116z" fill="url(#fBlue)" filter="url(#rough)"/>
      <ellipse cx="156" cy="190" rx="22" ry="20" fill="#d8e6e8"/><ellipse cx="244" cy="190" rx="22" ry="20" fill="#d8e6e8"/><circle cx="156" cy="192" r="4.4" fill="#304a55"/><circle cx="244" cy="192" r="4.4" fill="#304a55"/>
      <path d="M130 170q26-18 52 0M218 170q26-18 52 0" stroke="#243a40" stroke-width="5" fill="none"/>
      <path d="M200 206l-8 34q8 8 16 0z" fill="#3c5258"/>
      <path d="M156 280q44 34 88 0q-10 40-44 44-34-4-44-44z" fill="#2b3a45"/><path d="M158 284q42 20 84 0" stroke="#7d93a0" stroke-width="3" fill="none"/>
      ${drips([150, 190, 230, 260], '#7fa2b0', 300)}${Array.from({ length: 14 }, () => `<circle cx="${R(60, 340).toFixed(0)}" cy="${R(60, 460).toFixed(0)}" r="${R(2, 7).toFixed(1)}" fill="none" stroke="#9cc2d0" stroke-width="1.4" opacity=".7"/>`).join('')}`),

    /* possessed: white eyes, black veins, too-wide grin */
    possessed: () => svg(`
      <g transform="rotate(-6 200 250)"><path d="M200 24c82 0 126 62 126 148 0 62-30 108-58 136l-8 170H140l-8-170c-28-28-58-74-58-136C74 86 118 24 200 24z" fill="url(#fPale)" filter="url(#rough)"/>
      ${veins(28, 200, 170, 120, '#0c0c0c', 2.4)}
      <path d="M118 186q30-24 62 0-32 22-62 0zM220 186q32-24 62 0-30 22-62 0z" fill="#f6f6f6" stroke="#0a0a0a" stroke-width="3" filter="url(#glow)"/><circle cx="150" cy="186" r="3" fill="#000"/><circle cx="250" cy="186" r="3" fill="#000"/>
      <path d="M92 296q108 110 216 0q-108 46-216 0z" fill="#070000"/>${teeth(106, 294, 300, 22, 18, '#e8e2d0')}${teeth(120, 280, 338, 18, -12, '#ddd6c2')}
      <path d="M92 296l-18-30M308 296l18-30" stroke="#0a0000" stroke-width="5" stroke-linecap="round"/></g>`),

    /* infected: sick yellow, bloodshot, bloody chin */
    infected: () => svg(`
      <path d="M200 24c80 0 124 60 124 146 0 60-26 104-52 132l-10 150H138l-10-150c-26-28-52-72-52-132C76 84 120 24 200 24z" fill="url(#fSick)" filter="url(#rough)"/>
      <ellipse cx="150" cy="176" rx="30" ry="24" fill="#d9d36a"/><ellipse cx="250" cy="176" rx="30" ry="24" fill="#d9d36a"/>
      ${veins(5, 150, 176, 22, '#a31010', 1.6)}${veins(5, 250, 176, 22, '#a31010', 1.6)}
      <circle cx="152" cy="178" r="9" fill="#2a1400"/><circle cx="248" cy="178" r="9" fill="#2a1400"/>
      <path d="M118 150q30-30 64-6M218 144q34-24 64 6" stroke="#2a2a08" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M200 206l-10 36q10 8 20 0z" fill="#4c4a14"/>
      <path d="M130 290c20 40 120 40 140 0 6 42-22 84-70 86-48-2-76-44-70-86z" fill="#5a0505"/>${teeth(142, 258, 296, 10, 16, '#cfc487')}
      <path d="M130 300c-8 60 0 120 20 150h100c20-30 28-90 20-150-30 30-110 30-140 0z" fill="#7a0b0b" opacity=".85"/>
      ${drips([156, 190, 222, 250], '#a01010', 330)}${veins(16, 200, 250, 130, '#3a4a0a', 1.8)}`),

    /* the long face: stretched, tiny features */
    long_face: () => svg(`
      <path d="M200 -10c60 0 90 70 90 180s-24 220-50 330H160c-26-110-50-220-50-330S140 -10 200 -10z" fill="url(#fPale)" filter="url(#rough)"/>
      <ellipse cx="166" cy="150" rx="13" ry="18" fill="#000"/><ellipse cx="234" cy="150" rx="13" ry="18" fill="#000"/>
      <circle cx="166" cy="154" r="3.6" fill="#ff2a2a" filter="url(#glow)"/><circle cx="234" cy="154" r="3.6" fill="#ff2a2a" filter="url(#glow)"/>
      <path d="M194 200l-4 24q10 6 20 0l-4-24z" fill="#2a2620"/>
      <path d="M170 260c14 130 46 130 60 0-16 10-44 10-60 0z" fill="#070000"/>${teeth(174, 226, 264, 6, 40, '#d8d0bb')}
      <path d="M150 90v250M250 90v250" stroke="#000" stroke-width="30" opacity=".25"/>`),
  };
  // upside-down crawler: the bride, flipped
  FACES.crawler = () => FACES.ghost_bride().replace('<svg viewBox="0 0 400 500" ', '<svg viewBox="0 0 400 500" style="transform:rotate(180deg)" ');

  window.UH_FACES = Object.assign(FACES, window.UH_FACES || {});
})();
