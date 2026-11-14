--[[
    ============================================================
    Universal Hallucination  |  see CHANGELOG.md
    Developer : Ra7 DEV
    Dev by    : Abudaqa
    Discord   : https://discord.gg/Zk5CrhHYe
    License   : MIT (open source)
    Copyright (c) Ra7 DEV
    ============================================================
]]

fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'universal_hallucination'
author 'Ra7 DEV'
license 'MIT'
description 'Universal Hallucination by Ra7 DEV (Dev by: Abudaqa) - Free open-source hallucination system for roleplay: phantom people, zombies, ghosts, fake gunmen, hidden/solo-visible players, live-directed imaginary people, drug/psychosis scenarios. Discord: https://discord.gg/Zk5CrhHYe'
version '1.3.0'
repository 'https://github.com/Abudaqa-DEV/RA7Universal-Hallucination'

dependency '/onesync'

shared_scripts {
    'config.lua',
    'shared/utils.lua',
    'shared/locale.lua',
    'locales/*.lua',
    'shared/registry.lua',
    'shared/settings.lua',
}

client_scripts {
    'bridge/custom.lua',
    'bridge/framework.lua',
    'bridge/notifications.lua',
    'bridge/appearance.lua',
    'client/state.lua',
    'client/nui.lua',
    'client/helpers.lua',
    'client/entities.lua',
    'client/fx/visual.lua',
    'client/fx/audio.lua',
    'client/fx/body.lua',
    'client/fx/people.lua',
    'client/fx/entity_types.lua',
    'client/fx/extras.lua',
    'client/fx/realism.lua',
    'client/fx/jumpscare.lua',
    'client/fx/more.lua',
    'client/fx/takeover.lua',
    'client/world.lua',
    'client/voice.lua',
    'client/dialogue.lua',
    'client/engine.lua',
    'client/resist.lua',
    'client/main.lua',
}

server_scripts {
    'bridge/custom.lua',
    'bridge/framework.lua',
    'bridge/appearance_server.lua',
    'bridge/inventory.lua',
    'server/security.lua',
    'server/sessions.lua',
    'server/health.lua',
    'server/scenarios.lua',
    'server/director.lua',
    'server/swap.lua',
    'server/voice.lua',
    'server/extras.lua',
    'server/takeover.lua',
    'server/store.lua',
    'server/world.lua',
    'server/zones.lua',
    'server/mind.lua',
    'server/main.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/faces.js',
    'html/eye.js',
    'html/assets/map/*.png',
    'html/assets/map/*.jpg',
    'html/assets/map/*.webp',
    'html/assets/scare/*.png',
    'html/assets/scare/*.jpg',
    'html/assets/scare/*.webp',
    'html/assets/sounds/*.ogg',
    'html/assets/fonts/*.txt',
    'html/assets/fonts/*.woff',
    'html/assets/brand/*.png',
}
