# Architecture

- `config.lua` -> `shared/` (utils, locale, registry) -> `locales/`.
- **Server** (`server/`): `sessions` (validation, limits, lifecycle) -> `scenarios`, `director`, `swap`, `voice`, `extras` (resist, cues, possess/appear), `takeover`, `world` (parallel world), `store` (saved places / scenes / zones / stress in `data/user_data.json`), `zones`, `mind` -> `main` (events, commands, panel, exports).
  The server decides; clients only draw.
- **Client** (`client/`): `engine` runs one session per hallucination with automatic cleanup; effects register in `fx/*`
  (`entity_types`, `realism`, `more`, `visual`, `audio`, `body`, `people`, `extras`, `takeover`); `world.lua` holds the fade, user scenes and the in-game diagnostics; `entities` creates only local harmless peds; `dialogue`, `resist`, `voice`, `nui`.
- **NUI** (`html/`): overlay (no focus) and the admin panel (`/hmenu`); WebAudio with stereo panning; colors from `Config.Brand`.
- **Safety path for bullets:** `Realism.Fire` -> `Realism.IsSafeShot` (ray distance to head, chest, feet) -> `ShootSingleBulletBetweenCoords(damage 0)`.
- **Tests:** `python3 tests/runlua.py run tests/server_test.lua` and `tests/client_test.lua` (mocked natives, virtual clock), `node --check html/script.js`, `python3 tests/ui_shots.py <folder>` for UI screenshots.
