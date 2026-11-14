# Changelog

## 1.3.0
The jump scare is a real ped.

**Changed**
- **Jump scare = a local ped (NPC), not an image** (`client/fx/jumpscare.lua`, `Config.Jumpscare`). A harmless zombie/ghost ped (the horde's looks, wounds and blood) shows up for one player in one of three styles - `pop` (in front, stares, lunges), `rush` (sprints from afar), `behind` (lands when you turn around) - with a white flash, the scream and a camera kick, then vanishes when it reaches the player. It works in a vehicle (always from the front), is never shown to a dead player, never blocks, never hurts, never exists for anyone else, and always cleans up. `Mode = 'ped' | 'image' | 'both'` (also in the Settings tab); `Looks`, `Styles`, `VanishDistance`, `Fallback`.
- The resist-game **spikes** now send the same ped for an instant instead of flashing a face picture (`noFace`).
- Cue `jumpscare` Duration 1.4 -> 5.0 s (the maximum life of the ped).
- If no ped can be placed (no free spot, model missing) the scare still lands as flash + scream + shake and no error is logged.

**Added**
- `Realism.PickLook` / `Realism.Dress` (reuse the zombie looks), `Cue.Ctx`, settings entry `Jumpscare.Mode`, locale keys for it (ar/en).
- Tests: section [18] (31 checks): every style, cleanup, no picture, vehicle, dead player, spike, no-spot fallback, `image` and `both` modes. Total 419 server + 262 client.

## 1.2.0
Reliability, the eye, a stronger takeover and the first public SEO pass.

**New**
- **Eye hallucination** (`eyes`): the screen itself becomes an eye (default `lids`): you see the world through an eye-shaped opening that opens, blinks, closes completely, stays shut, then opens until the whole screen is back (pattern `sleep`); `watcher` = optional giant eye with iris and pupil. Sound, blur, veins; a cue (`eye_blink`) and a scene-editor event (`eyes`).
- **Takeover, upgraded** (`Config.Takeover`): choose the **pressure** of the duel (easy / normal / hard / nightmare), let the watcher **walk** (`Ghost.Freeze = false` / panel toggle, limited by `Ghost.MaxRoam`) or stay frozen, **controller rules** (`Config.Takeover.Controller`: no inventory, weapons, melee or vehicles; the server cancels `weaponDamageEvent` of the controller), and **`/hback`** / panel button to put both players back where they stood before the takeover (`ReturnTo = 'body' | 'origin'` for the normal end). Exports: `TakeoverTalk/Seize` take `opts`, new `TakeoverBack`.
- **Reliability** (`Config.Health`): per-type failure reasons, full self-test, fallback scare, auto-registration of players whose client never announced itself; the framework wait is 20 s (`Config.General.ReadyTimeout`).
- **RESIST! before the effect** (`Config.Resist.Onset`) and an earlier first prompt (`Prompt.FirstAfter`).
- **Map tab** and **Settings tab** (saved by the server, export / import JSON).
- Stronger synthesized horror sounds (`tools/make_sounds.py`, `Config.Sounds.Layered`).
- Framework names `qbx`, `qbx_core`, `qb-core`, `es_extended` are accepted; a failing adapter no longer blocks the script.
- Tools: `tests/lint.py`, `tools/verify_names.py` (natives / models / particles checked against citizenfx/natives and gta-v-data-dumps).

**Fixed**
- Duration slider: the knob and the bar disagreed in the RTL (Arabic) panel.
- Invalid particle and damage-pack names replaced with existing ones.
- Settings actions were blocked by the client action whitelist.

Tests: 419 server + 231 client checks.

## 1.1.0
Harder, scarier, and the things that did not work are fixed.

**Resist mini-games are now hard** (`Config.Resist.Level`, default `'hard'`):
- Four levels - `easy`, `normal`, `hard`, `nightmare` - each with `Difficulty`, `Seconds`, `Mistakes`, `Chain`, `Spikes` in `Config.Resist.Levels` (edit the numbers freely).
- **Chain**: on hard you must win 2 different games in a row (nightmare: 3). **Spikes**: scares hit you in the middle of a game (a face flashes, the screen shakes) and punish you - the mash bar is knocked back, the breath marker is shoved, the timing zone jumps, the sequence loses your place.
- Tighter games: a faster and more erratic breath zone, up to 5 timing rounds with a narrow zone (a miss now costs a heart instead of silently failing the round), longer arrow sequences where only the next 4 arrows are visible and a mistake sends you back to the start.
- The server rejects a result faster than `MinMs` x the chain length.
- New resist prompt ("RESIST!"): a round countdown ring around the key, a beating glow, the level badge. The game screen shows the level, the round (1 / 2) and the hearts left.

**Jump scare: no more skull.** The skull is gone. `Config.Jumpscare` shows realistic zombie images (15 bundled in `html/assets/scare/`, cut from the Ra7 zombie poster) with a lunge, shake and flicker; you can add your own images, and 14 hand-drawn SVG faces in `html/faces.js` remain as a fallback (`Faces`, `ImageChance`). Image paths are validated like the logo. The same faces flash inside the resist games.

**16 zombie forms** (`Config.Realism.Zombies.Looks`): ghost girl, ghost bride, rotting, torn jaw, screamer, drowned, burnt, shadow, infected, long face, crawler, possessed, toxic, faceless, bloated, infected hound. Each has its own models, movement variant, speed, transparency, wounds, blood and optional particles; force one with `params.look`. `SetPedMoveRateOverride` is now called every tick (the native only holds while looped).

**Fixed (found by auditing every script):**
- **All notifications were silently dropped** (the code read a config key that did not exist). Now `Config.Notifications.Enabled`.
- The wall check used `StartShapeTestRay` (an alias of the slow synchronous probe); now `StartShapeTestLosProbe`.
- A missed press in the timing game left you with a lost round and no feedback.

**Setup help:** a bilingual "Start here" block at the top of `config.lua` - server.cfg order, ACE permissions, how to make yourself an admin with `add_principal`, first run, common problems.

Tests: 191 client + 357 server checks, including the new levels, the scare config validation, the bundled images and the zombie looks.

## 1.0.8
Branding:
- **The default look is now the Ra7 DEV logo palette** (warm black, gold `#E8A63B`, silver text) instead of blue. Nothing else changed: every colour is still yours in `Config.Brand.Colors`, and the config now lists ready-made sets (blood red, toxic green, violet, ice cyan, blue, neon pink).
- **Logo in the panel header** (`Config.Brand.Logo`, a path inside `html/`; set `''` to hide it or point it to your own server logo). The path is validated (no `..`, no URLs).
- New screenshots in `docs/images/` taken from the real panel in the new colours.

Found by watching a real in-game recording of the panel:
- **Fixed the panel "cutting" / flicker.** The panel's entrance animation was replayed on every re-render, and the panel re-rendered every 2 seconds (and on every click), so it kept fading in and out. Now the animation plays only when the panel opens, a refresh with unchanged data does not touch the screen at all, and the scroll positions (page, player list, tabs) are kept when something does change.
- **Scrollbars redesigned.** The default browser scrollbar (with arrow buttons) is replaced by a slim rounded one in the panel colours. The tab row has no scrollbar at all: use the mouse wheel or drag it; the edges fade softly.

## 1.0.7
Three new hallucinations (all in `Config.Types`, all with a switch in `Config.Switches`):
- **Echo** (`echo`): a copy of the player walks the exact path he walked a few seconds ago (`Delay`), a little transparent. When he stops it catches up with him and fades away, then comes back later. Bug found by the tests while building it: it stood still instead of walking to the last place the player stood.
- **Fake lag** (`fake_lag`): while he is walking the game "hitches": the character freezes for a moment and may snap back a few metres, like a bad connection. Never when in a vehicle, ragdolled, climbing or swimming; always unfrozen when it ends.
- **Phantom wounds** (`fake_wounds`): bruises and blood appear on his body one by one and he starts limping. Visual only, his health is not touched, everything is cleaned when it ends.

## 1.0.6
- **`Config.Switches`**: one block at the top of `config.lua` with every hallucination, scenario, cue and scene on its own line (`true` / `false`), plus a switch for each whole category (entity, visual, audio, body, people). A switched-off item cannot be started by command, panel, scenario step, zone or the mind system, and shows greyed out in the panel. Typos in the block are reported at start-up.
- Exports `SetTypeEnabled(type, true|false|nil)` and `IsTypeEnabled(type)` to turn a type on/off while the server runs.

## 1.0.5
- **Haunted zones** (tab "Zones"): stand somewhere, press "Create zone here" and everybody who enters gets the chosen hallucination (chance, rest time, radius, intensity, duration; enable/disable/delete from the panel). Players who opted out are not touched. `Config.Zones`.
- **Mind / stress** (tab "Mind"): a persistent stress counter per character (0-100). Death and low health raise it, time calms it, and the higher it is the more often automatic hallucinations start (`Config.Mind.Levels`). Psychologists / admins lower or raise it from the panel; other scripts (drugs, medication, therapy) use the exports `AddStress`, `ReduceStress`, `SetStress`, `GetStress`.

## 1.0.4
Everything below is driven from the panel, no commands needed.
- **Parallel world** (tab "World"): move a player to another place (optionally his own routing bucket so nobody else sees it), frozen so he can only look, bring REAL staff players next to him, return everybody with one button (also automatic after `Config.World.MaxSeconds`, when the player leaves, or when the session is stopped). Places come from `Config.Places` or are saved from the panel ("Save my position") into `data/user_data.json`.
- **Takeover tab**: appear and talk, start the duel, end, with the current phase shown.
- **Visual scene editor** (tab "Scene editor"): add actors, drag them on a top-down map, write their lines, moves and events, pick the colour filter / weather / hour, save, delete and test on yourself. Scenes are sanitised on the server and stored in `data/user_data.json`.
- **Diagnostics tab**: checks every model, clipset, animation, particle and weapon in the config inside the game and lists the ones that do not exist, plus the latest failure reasons.
- Panel tabs scroll; takeover and world refuse each other. Exports `TakeoverTalk/Seize/Release`. Events `worldStarted`, `worldEnded`.


## 1.0.3
Fixes found by testing in a real server:
- **Every local ped fell through the map** (it was created with world collision disabled). Peds now keep their collision and only pass through the player (`SetEntityNoCollisionEntity`). This was the cause of ghosts / zombies / scene actors that were not seen or vanished at once.
- Ghost: appears where you can see it (`SpawnAngle`), stays `Lifetime` seconds, no longer vanishes just because you look at it (`VanishWhenLooked = false`), stops and flickers when stared at, retries after 1.5 s when no spot is found. All of it is in `Config.Types.ghost`.
- Spawn points are checked for line of sight (no ghosts / zombies behind walls where they get stuck); scenes shrink towards the player when a wall is in front of him.
- Zombies: blood splats, sick faces, slightly different walking speeds, first-sight scare (heartbeat, red flash, groan); `WaveSeconds`, `SightScare`, `BloodSplats`, `SickFace` in the config.
- Insects: new screen overlay with glossy beetles/roaches (stop-and-go, antennae), flies with blurred wings and big blurred bugs crawling on the lens.
- Test added: every scenario starts all of its steps.


## 1.0.2
- **Takeover by swapping** (`/htake`, `/hseize`, `/hrelease`): the admin appears to ONE player and talks to him; if the player refuses, a mini-game duel starts. If the player wins `Contest.WinsNeeded` rounds the admin is expelled (he vanishes before taking over). If he loses (or the time runs out) the admin enters the player's place wearing his look, and the player becomes a bystander at the admin's old place: frozen, invincible, seen and heard by nobody except the admin, while he sees and hears everybody. When it ends (`/hrelease`, timeout, death or leaving) looks and places are restored. Settings in `Config.Takeover`. Exports: `TakeoverTalk`, `TakeoverSeize`, `TakeoverRelease`. Events: `universal_halluc:takeoverResult`, `universal_halluc:takeoverEnded`.
- UI: the type grid no longer uses small icons; tiles are plain text with a thin category-colour accent, and category chips use a coloured dot.
- Fix: custom CSS properties set through the UI helper (`--w`, `--c`...) were ignored.

## 1.0.0
First public release.
- UI: bundled Cairo font (SIL OFL, Arabic + Latin), navy palette, compact type list with short names, flatter panel. Actors look at the player and move their mouth when they speak; shooters reposition between bursts.
- Realism pack: real shooter peds and harmless bullets with a per-shot safety check (gunfight), near-death feeling, config scenes of the past and present, zombies with 18 peds and 6 behaviours, self-zombie, collapse, drunk, underwater, real insects, mic-to-mic voice (pma-voice / mumble-voip / custom), 8 new sounds.
- 47 hallucination types: phantoms (ghost, shadow, stalker, crowd, zombie horde, animals, gunman, double, friend), screen perception, positional audio, body (weapon tremor, hand tremor, dizziness) and player visibility (hide, solo-visible, translucent players, possession).
- 17 ready roleplay scenarios as server timelines.
- Live Director: control an imaginary person, speak through it, scripted dialogue trees (Arabic / English).
- Resist mini-games (mash, breath control, timing, sequence) with server-validated results.
- Instant cues: jumpscare, blackout, heartbeat rush, glitch, quake, whispers, blood rain, freeze.
- Possession: the target watches through the admin's eyes (frozen, silent) while the admin wears the target's look.
- Appear: an admin shows up with his real character to ONE player only.
- Look swap with backup/restore; optional whitelist-only item swap and carry pouch between characters (off by default).
- Admin panel (/hmenu) with player picker, type grid, scenarios, live control, visibility, director, swap and active sessions.
- Frameworks: standalone, ESX, QBCore, Qbox, custom. Clothing: illenium-appearance, fivem-appearance, custom exports, custom code.
- 27 original synthesized sounds (WebAudio, stereo panned). Arabic / English UI with RTL.
