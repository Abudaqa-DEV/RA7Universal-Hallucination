# Contributing

## How you can help (no coding needed)
1. **Test on a real server and tell us what breaks.** Run `/hmenu` -> Diagnostics and open a [test report](https://github.com/Abudaqa-DEV/RA7Universal-Hallucination/issues/new?template=test_report.md) with the names that do not exist on your build.
2. **Report bugs** with the bug template (framework, version, server console + F8 output).
3. **Suggest ideas** with the feature template or in Discord: https://discord.gg/Zk5CrhHYe
4. **Share content:** scenes (from the scene editor, copy the entry from `data/user_data.json`), scenarios, zones, new languages (`locales/xx.lua`, copy `en.lua`).
5. **Star the repository** and tell other servers.

## Code contributions

Thank you for helping. Open an issue first for big changes: https://discord.gg/Zk5CrhHYe

Rules that keep the resource safe for every server:
1. Hallucinations are local to the target. Never create networked entities for them (`isNetwork = false`).
2. Nothing can hurt a player: no combat tasks against him, weapons have 0 ammo, fake bullets have damage 0 and always miss.
3. Everything a client sends is validated on the server. Never trust the NUI.
4. Every session cleans up after itself (entities, timecycle, shake, time scale, NUI overlays, sounds).
5. Every new config value has an Arabic comment (the file's comments are Arabic), a range and a default. New texts go to both locale files.

Before opening a pull request run:
```
python3 tests/runlua.py run tests/server_test.lua
python3 tests/runlua.py run tests/client_test.lua
node --check html/script.js
```
