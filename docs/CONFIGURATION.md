# Configuration map (`config.lua`)

Every value has an Arabic comment with the range and the default.

| Section | What you change |
|---|---|
| `Config.Brand` | server name, script name, logo image (`Logo`), colors (HEX). Default colours = Ra7 DEV logo (black + gold); the file lists ready-made colour sets |
| `Config.General` | language, framework, debug, banner |
| `Config.Permissions` | ACE names and jobs |
| `Config.Safety` | max duration, concurrency, opt-out, stop on death, time-scale floor |
| `Config.Commands` | every command name |
| `Config.Types.<type>` | enable/disable, duration, intensity and options of each of the 47 types |
| `Config.Realism` | **zombie models/behaviours/wounds, shooter peds and weapons, gunfire sound mode and safety margin, insect particles / creatures / your prop models** |
| `Config.Texts` | whispers, fake notifications, last words |
| `Config.Dialogues` | scripted conversation trees |
| `Config.Scenes` | **scenes of the past and the present** (see below) |
| `Config.Scenarios` | timelines of several types |
| `Config.Director`, `Config.Voice` | live puppeting and mic-to-mic voice |
| `Config.Appearance`, `Config.Swap` | clothing provider, look/item swap, carry pouch |
| `Config.Resist`, `Config.Cues`, `Config.Possess`, `Config.Panel` | mini-games, instant cues, possession, panel |
| `Config.UI`, `Config.Sounds`, `Config.Security`, `Config.Integration` | appearance, volume, rate limits, events/state bags |

## Writing a scene
```lua
Config.Scenes.my_scene = {
    Label = { ar = 'اسم', en = 'Name' },
    Mode = 'past',                       -- 'past' or 'present'
    Duration = 30,
    Look = { Timecycle = 'NG_filmic05', Strength = 0.7, Tint = '#B8873A', TintStrength = 0.25,
             Grain = true, Clock = { h = 18, m = 30 }, Weather = 'EXTRASUNNY', Sound = 'music_box' },
    Actors = {
        { Id = 'dad', Name = { ar = 'أبي', en = 'Father' }, Model = 'a_m_o_soucent_01',
          At = { fwd = 3.0, right = 1.0 }, Heading = 'face', Scenario = 'WORLD_HUMAN_STAND_IMPATIENT',
          Lines = { { t = 2, text = { ar = 'مرحباً', en = 'Hello' } } },
          Timeline = { { t = 10, Do = 'walk', to = { fwd = 8, right = 0 }, speed = 1.0 }, { t = 20, Do = 'vanish' } } },
    },
    Events = { { t = 5, Do = 'shake', amount = 0.3 } },
}
```
Actions: `walk face anim scenario aim shoot fall rise vanish` (actors) and `flash shake sound cue blood` (events).
`Model = 'self'` makes the actor look like the target; `'subject'` like another player. Every shot misses and does no damage.
Run it with `/hscene <id> my_scene`, from the panel, or with a scenario step `Params = { scene = 'my_scene' }`.
`death_feeling` can flash your scenes before the faint (`Config.Types.death_feeling.LifeFlash.Scenes`).

## Real insects
GTA has no insect models. Use the layers in `Config.Realism.Insects`: particle candidates (the first that loads is used),
real rats / crows, and `PropModels` where you list models of insects streamed by your own resources (they crawl over the body).

## Takeover by swapping
`/htake <id>` then `/hseize`. Everything is in `Config.Takeover`:
- `RequireLooks` needs a clothing provider (`Config.Swap`) so the looks are really swapped; set it to `false` to skip the look swap (places are still swapped).
- `Contest.WinsNeeded` / `LossesToLose` / `Seconds` decide the duel; the player runs the resist mini-game (`Config.Resist.Games`).
- `Ghost.Freeze` / `Ghost.Invincible` control the swapped player's state. `Teleport = false` keeps everyone in place.
- **Pressure** (`Contest.Pressure`, or picked in the panel per takeover): `easy` / `normal` / `hard` / `nightmare` = the resist level of the duel (`Config.Resist.Levels`). `/htake <id> [pressure] [move]`.
- **Watcher movement:** `Ghost.Freeze = false` (or the panel toggle / `move` argument) lets the swapped player walk inside `Ghost.MaxRoam` metres; he is ghosted against other players, unarmed, and cannot enter vehicles.
- **Controller rules** (`Config.Takeover.Controller`): `BlockInventory`, `BlockWeapons`, `BlockMelee`, `BlockVehicles` lock the controller on his client (ox_inventory and qb-inventory through the `invBusy` / `inv_busy` state; any other inventory through `Custom.Takeover.Inventory(on)` in `bridge/custom.lua`); `BlockKill` makes the server cancel every `weaponDamageEvent` he causes. Test the inventory lock with your own inventory resource.
- **Returning:** `/hrelease` (or the panel "End") puts the controller back and wakes the player where his body ended (`ReturnTo = 'body'`) or at his original place (`'origin'`). `/hback` (panel "Restore places") always returns BOTH to where they stood before the takeover.
- Voice: with `Config.Voice.Enabled = true` the swapped player's microphone is heard ONLY by the controller (pma-voice `overrideProximityCheck`, or `Custom.Voice.Isolate`). Without a voice provider his microphone is muted instead.
Limits: the framework identity (citizenid / license) cannot be swapped, only the look and the place; not available while either player is in a vehicle.

## Ghost (`Config.Types.ghost`)
`SpawnAngle` (where it appears relative to your view: 0 = ahead, 180 = behind), `Lifetime` (seconds on screen), `Alpha`, `FadeInMs`, `Approach` / `ApproachSpeed`,
`StopWhenLooked`, `Flicker`, `VanishWhenLooked` + `LookSeconds`, `VanishDistance`, `Shake`, `Respawn`, `MaxSpawns`.
Zombie extras in `Config.Realism.Zombies`: `BloodSplats`, `SickFace`; per type `SightScare`, `WaveSeconds`.

## Parallel world (`Config.World`, `Config.Places`)
Panel -> World: choose the player on the left, a place, the staff to bring and press Send. `UseBucket` isolates them in their own routing bucket (OneSync), `Fade` blacks the screen around the teleport, `MaxSeconds` returns everybody automatically, `StaffOnly` limits who can be brought to players with the `Use` permission, `TargetFrozen` / `TargetInvincible` control the moved player.
Places: add rows to `Config.Places` or press "Save my position" in the panel (stored in `data/user_data.json`).

## Scene editor
Panel -> Scene editor (needs the `Admin` permission). Built-in scenes cannot be overwritten: open one and save it under a new key. Limits: 12 actors, 20 lines per actor, 40 moves per actor, 20 events, 60 saved scenes.

## Diagnostics
Panel -> Diagnostics checks the names written in the config against your game build. Fix or remove the entries it lists in `config.lua`.

## Haunted zones (`Config.Zones`)
Panel -> Zones (Admin). Stored in `data/user_data.json`. A zone fires at most once per `Cooldown` per player, and only with probability `Chance` at each check (`CheckMs`).

## Mind (`Config.Mind`)
`Gain` (what raises stress), `Decay` (calming), `Levels` (from which stress value which hallucinations may appear, how often and how strong). Integration from other resources:
```lua
exports.universal_hallucination:AddStress(source, 20)      -- shock
exports.universal_hallucination:ReduceStress(source, 15)   -- medication / therapy
print(exports.universal_hallucination:GetStress(source))
```

## Turning hallucinations on / off (`Config.Switches`)
The block right after `Config.General` lists every hallucination type, scenario, cue and scene with `true` or `false`.
- `Categories.audio = false` turns off every audio type at once (same for `entity`, `visual`, `body`, `people`).
- `Types.ghost = false` turns off one type. `Scenarios.paranoia = false`, `Cues.jumpscare = false`, `Scenes.present_ambush = false` do the same for those lists.
- The old `Config.Types.<type>.Enabled = false` still works; the type is off when either one says `false`.
- A switched-off item is refused everywhere (commands, panel, scenarios, zones, mind levels) and shown greyed out in the panel. Sessions that are already running finish normally.
- At runtime: `exports.universal_hallucination:SetTypeEnabled('ghost', false)` (pass `nil` to go back to the config value) and `IsTypeEnabled('ghost')`.

## Echo, fake lag, phantom wounds
- `Config.Types.echo`: `Delay` (seconds behind you), `MinGap` (it only appears when it is at least this far), `VanishDistance`, `RestSeconds`, `Alpha`, `Source` (`self` = a copy of you).
- `Config.Types.fake_lag`: `Interval`, `MinSpeed`, `Lag`, `Freeze`, `RubberChance`, `MaxBack`.
- `Config.Types.fake_wounds`: `Count`, `GapSeconds`, `Packs` (damage packs), `Limp`, `Clipset`. The wounds are drawn on the player's own ped; whether other players see the decals depends on the game build, so test it on your server.

## Reliability (`Config.Health`)
Every hallucination is watched: if nothing visible happened the reason is logged and shown in **Diagnostics -> Reliability** (in a vehicle, no free spot, missing model, script error). `Fallback` runs a simple scare so it never passes silently; **Run full test** tries every type on you. `AutoRegisterAfter` registers a player whose client never announced itself.

## RESIST! before the effect (`Config.Resist.Onset`)
A warning phase (heartbeat, dark edges) of `Seconds` where the player can fight the hallucination before it starts; it does not eat the duration. `MinIntensity` and `Exclude` choose which hallucinations get it. `Config.Resist.Prompt.FirstAfter` is the first automatic prompt.

## Map, Settings and sounds
- `Config.Map`: an atlas image in `html/assets/map/` and its `Bounds`; without it a kilometre grid is drawn.
- Settings tab: the whitelist in `shared/settings.lua` (resist level, colours, switches...) is saved by the server and can be exported / imported as JSON.
- `Config.Sounds.Layered` adds a scream over the hit and a heavy heartbeat; regenerate sounds with `tools/make_sounds.py`.
- `Config.Types.eyes` (`Mode` `lids` (default: the screen becomes the eye, closes completely, then opens again) / `watcher` (giant iris + pupil) / `both`, `Blinks`, `Veins`, `Blur`, `Color`, `Iris`, `Slit`, `Shake`); the cue `eye_blink` and the scene event `eyes`.


## Jump scare (a real ped)
`Config.Jumpscare` (since 1.3.0): `Mode = 'ped'` (default, an NPC appears for one player only) | `'image'` (the old pictures) | `'both'`.
`Looks` = names from `Config.Realism.Zombies.Looks` used for the scare (empty = any). `Styles.pop / rush / behind` each have `Weight`, `Distance`, `Speed` (`pop`: `Stay` = seconds it stares before it lunges; `behind`: `Wait` = seconds before the scare lands if you do not turn around; `Enabled = false` switches a style off). `VanishDistance` = meters from the player where it disappears (0.8-3.0). `Fallback = 'flash' | 'image'` when no ped can be placed. Cue duration: `Config.Cues.Items.jumpscare.Duration` (the maximum life of the ped).
Test it: `/hcue me jumpscare` (or the panel, Show tab).
