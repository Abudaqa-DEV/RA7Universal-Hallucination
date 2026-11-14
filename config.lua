--[[
    ======================================================================
    Universal Hallucination System  |  v1.3.0  |  OPEN SOURCE (MIT)
    Developer : Ra7 DEV
    Dev by    : Abudaqa
    Discord   : https://discord.gg/Zk5CrhHYe
    Copyright (c) Ra7 DEV
    ======================================================================

    هذا الملف هو مكان كل الإعدادات: عدّله بحرية. لا تحتاج معرفة Lua: غيّر القيم فقط ولا تحذف الفواصل , ولا الأقواس { }.
    This file holds every setting. You do not need to know Lua: only change values, keep the commas and braces.

    طريقة قراءة التعليقات / How to read the comments:   -- الوصف | القيم المقبولة | الافتراضي
    الوقت بالثواني (s) إلا إذا كُتب ms.   Time is in seconds unless it says ms.
    الألوان بصيغة HEX مثل '#F5C518'.       Colors are HEX like '#F5C518'.
    الهلوسة بصرية وصوتية فقط: لا تسبب أي ضرر حقيقي للاعب (صُممت هكذا عمداً).
    Hallucinations are visual/audio only: they never deal real damage (by design).
]]

--[[
    ======================================================================
    START HERE / ابدأ من هنا:  طريقة التشغيل + صلاحيات الأدمن
    ======================================================================

    ┌─ 1) التثبيت / INSTALL ───────────────────────────────────────────────
    │ ضع المجلد في resources/ واسمه بالضبط:  universal_hallucination
    │ Put the folder in resources/ and name it exactly:  universal_hallucination
    │ (لو نزّلته من GitHub باسم RA7Universal-Hallucination-main غيّر اسمه)
    │
    │ المتطلبات / Requirements:  OneSync مفعّل (onesync on) + نسخة سيرفر حديثة.
    │ اختياري / optional: pma-voice أو mumble أو saltychat (للصوت)، illenium-appearance أو fivem-appearance (تبديل الملامح).
    └──────────────────────────────────────────────────────────────────────

    ┌─ 2) server.cfg ─ انسخ هذا كما هو / copy this as is ───────────────────
    │ ensure universal_hallucination          # بعد الفريمورك (es_extended / qb-core / qbx_core) وبعد pma-voice إن وُجد
    │                                         # AFTER your framework (and after pma-voice if you use it)
    │
    │ # --- الصلاحيات / permissions (ACE) ---
    │ add_ace group.admin universal_hallucination.use      allow   # تشغيل/إيقاف الهلوسات + اللوحة | start/stop + panel
    │ add_ace group.admin universal_hallucination.director allow   # تحكم حي، سيطرة، تبديل العالم   | live puppeting, possession, world
    │ add_ace group.admin universal_hallucination.swap     allow   # تبديل الملامح والأغراض         | look/item swap
    │ add_ace group.admin universal_hallucination.admin    allow   # كل شيء + المناطق والمحرر والتشخيص | everything + zones, editor, diagnostics
    └──────────────────────────────────────────────────────────────────────

    ┌─ 3) كيف تصير أدمن؟ / HOW TO BECOME AN ADMIN ─────────────────────────
    │ الأدمن = لاعب ينتمي لـ group.admin. أضف نفسك في server.cfg (مرة واحدة ثم أعد تشغيل السيرفر):
    │ Admin = a player in group.admin. Add yourself in server.cfg (once, then restart the server):
    │
    │     add_principal identifier.license:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX group.admin
    │
    │ مكان الـ license:  بدّل XXXX برقم الـ license الخاص بك. تجده في:
    │   • كونسول السيرفر عند دخولك (سطر Player ... connecting) أو txAdmin ← Players ← اضغط على اسمك ← IDs
    │ Find your license: txAdmin → Players → your name → IDs, or the server console when you join.
    │
    │ صلاحية لشخص بدون أن يكون أدمن كامل / a single permission for one person:
    │     add_ace identifier.license:XXXX universal_hallucination.use allow
    │
    │ لوظائف فريمورك (شرطة/إسعاف/طبيب نفسي): اكتب أسماءها في Config.Permissions.Jobs أدناه
    │ For framework jobs (police/ambulance/...): list them in Config.Permissions.Jobs below.
    │
    │ الكونسول (id 0) مسموح له دائماً: تقدر تجرب من كونسول السيرفر قبل ضبط الصلاحيات:  halluc 1 ghost 60 0.8
    └──────────────────────────────────────────────────────────────────────

    ┌─ 4) أول تشغيل / FIRST RUN (دقيقتان / 2 minutes) ───────────────────────
    │ 1. ادخل اللعبة واكتب  /hmenu  ← تفتح اللوحة (كل شيء من الواجهة، لا حاجة للأوامر).  Type /hmenu: the panel opens.
    │ 2. تبويب «التشخيص / Diagnostics» ← اضغط تشغيل: يفحص كل موديل وحركة ومؤثر مكتوب هنا ويقول لك أيها غير موجود في سيرفرك.
    │    Diagnostics tab → Run: checks every model/clip/particle name in this file against your game.
    │ 3. اختر لاعباً وهلوسة (مثل «Zombie horde») ← ابدأ.  Pick a player + a hallucination → Start.
    │ 4. عند تشغيل المورد يطبع الكونسول سطر «Framework: ...» باسم ما اكتشفه؛ لو غلط غيّر Config.General.Framework.
    │    The console prints a "Framework: ..." line at start; if it is wrong, set Config.General.Framework.
    │
    │ فتح اللوحة بزر: Config.Panel.Key = 'F7'     |  غيّر اسم أي أمر في Config.Commands
    │ مقاومة اللاعب: زر G (Config.Resist.Key) وصعوبته Config.Resist.Level = 'hard'
    └──────────────────────────────────────────────────────────────────────

    ┌─ 5) أشهر المشاكل / COMMON PROBLEMS ────────────────────────────────────
    │ «لا أملك صلاحية / no permission»  ← السطر add_principal ناقص أو الـ license خطأ، أو لم تعد تشغيل السيرفر.
    │ اللوحة لا تفتح                    ← تأكد أنك أدمن (الخطوة 3) واسم المجلد صحيح، وانظر F8 للأخطاء.
    │ زومبي/موديل لا يظهر                ← شغّل التشخيص: الموديل غير موجود في سيرفرك، بدّله في Config.Realism.Zombies.
    │ الواجهة بدون صور رعب                ← تأكد أن مجلد html/assets/scare/ داخل المورد كما هو.
    └──────────────────────────────────────────────────────────────────────
]]

Config = {}

-- ======================================================================
-- 0) BRAND / ابدأ من هنا: اسم السيرفر + اسم السكربت + الألوان
-- ======================================================================
Config.Brand = {
    ServerName  = 'My Server',                   -- اسم سيرفرك | نص | يظهر في الكونسول
    ScriptName  = 'Universal Hallucination',     -- اسم السكربت كما يظهر في الكونسول والشات | نص

    Logo = 'assets/brand/ra7dev_logo.png', -- لوجو يظهر في ترويسة اللوحة | مسار داخل html/ أو '' لإخفائه | الافتراضي لوجو Ra7 DEV

    -- الألوان الافتراضية = ألوان لوجو Ra7 DEV (ذهبي على أسود). غيّرها بحرية.
    -- ألوان جاهزة: أحمر دم  Primary '#D9363E' Accent '#FF6B6B'   | أخضر سام  Primary '#4CD964' Accent '#A6F5B0'
    --              بنفسجي    Primary '#9B5CFF' Accent '#C7A6FF'   | سماوي جليدي Primary '#2BC4D9' Accent '#8CE9F5'
    --              أزرق      Primary '#5B7CFA' Accent '#8CA2FF'   | وردي نيون  Primary '#F0508A' Accent '#FF9EC0'
    Colors = {
        Primary    = '#E8A63B',   -- اللون الرئيسي (ذهبي اللوجو): الأزرار والتمييز | HEX
        Accent     = '#F6C86A',   -- لون ثانوي | HEX
        Danger     = '#E04458',   -- لون الدم والخطر | HEX
        Background = '#0B0A08',   -- خلفية اللوحة وبطاقة الحوار (أسود دافئ) | HEX
        Border     = '#3A2B14',   -- الحدود | HEX
        Text       = '#EEE9E1',   -- لون النص | HEX
        MutedText  = '#9C917F',   -- لون النص الخافت | HEX
    },
}

-- ======================================================================
-- 1) GENERAL / الإعدادات العامة
-- ======================================================================
Config.General = {
    Enabled       = true,        -- تشغيل/إيقاف السكربت بالكامل | true/false | true
    Debug         = false,       -- وضع التطوير (طباعة معلومات) | true/false | false
    Version       = '1.3.0',     -- (معلومة فقط، لا تغيّره)
    ResourceName  = 'universal_hallucination', -- اسم المجلد المتوقع. إذا غيّرته يظهر تحذير فقط
    Author        = 'Ra7 DEV',
    Developer     = 'Abudaqa',
    Discord       = 'https://discord.gg/Zk5CrhHYe',

    Framework     = 'auto',      -- 'auto' | 'standalone' | 'esx' | 'qbcore' | 'qbox' | 'custom' | الافتراضي 'auto'
                                 -- أسماء مقبولة أيضاً: 'qbx' 'qbx_core' = qbox | 'qb' 'qb-core' = qbcore | 'es_extended' = esx
                                 -- 'custom' = تكتب الربط بنفسك في bridge/custom.lua
                                 -- Works with: Standalone, ESX, QBCore, Qbox (QBX) and Custom. 'auto' picks what is started.
    ReadyTimeout  = 20,          -- ثواني ينتظر فيها السكربت "تحميل الشخصية" ثم يعتبر اللاعب جاهزاً حتى لو الفريمورك لم يُعلن | 3-120 | 20
                                 -- Seconds to wait for the framework's "character loaded" before the player is treated as ready anyway.
    Language      = 'ar',        -- 'ar' | 'en' | أي ملف جديد داخل locales/ | الافتراضي 'ar'
    PrintBanner   = true,        -- طباعة سطر تعريف في الكونسول عند التشغيل (بدون أي اتصال خارجي) | true/false | true
}

-- ======================================================================
-- 1b) SWITCHES / مفاتيح التشغيل والإيقاف (كل هلوسة بسطر واحد)
-- ======================================================================
-- true = شغّال | false = مطفأ تماماً (لا يبدأ بالأمر ولا بالواجهة ولا بالسيناريوهات ولا بالمناطق ولا بالحالة الذهنية)
-- أي نوع غير مذكور هنا يُعتبر شغّالاً. الإيقاف يسري على من يبدأ بعد ذلك؛ ما يعمل الآن يكمل حتى ينتهي
-- (أو أوقفه من تبويب "نشط"). مفتاح Config.Types.<type>.Enabled القديم ما زال يعمل، ويكفي أن يكون أحدهما false.
Config.Switches = {
    -- فئة كاملة: عطّلها فتتعطل كل أنواعها دفعة واحدة
    Categories = {
        entity = true,   -- كائنات (شبح، ظل، زومبي، جمهور، مشاهد...)
        visual = true,   -- بصري (تشوه، حشرات، دم، نصوص...)
        audio  = true,   -- صوتي (دقات قلب، همسات، طرق...)
        body   = true,   -- جسدي (رعشة، دوخة، سقوط، شعور الموت...)
        people = true,   -- لاعبون (إخفاء، رؤية للاعب وحده، سيطرة، رؤية الأشباح)
    },

    -- كل هلوسة على حدة
    Types = {
        -- كائنات
        ghost             = true,
        shadow            = true,
        stalker           = true,
        crowd             = true,
        zombie_horde      = true,
        animals           = true,
        gunman            = true,
        gunfight          = true,
        scene             = true,
        double            = true,
        echo              = true,
        friend            = true,
        -- بصري
        distortion        = true,
        acid_trip         = true,
        tunnel_vision     = true,
        double_vision     = true,
        flicker           = true,
        bugs              = true,
        blood             = true,
        words             = true,
        tint              = true,
        eyes              = true,
        camera_sway       = true,
        time_slow         = true,
        fake_notify       = true,
        insects           = true,
        underwater        = true,
        -- صوتي
        heartbeat         = true,
        breathing         = true,
        whispers_audio    = true,
        footsteps_behind  = true,
        knocking          = true,
        phone_ring        = true,
        static_noise      = true,
        drone             = true,
        music_box         = true,
        tinnitus          = true,
        distant_gunshots  = true,
        -- جسدي
        weapon_tremor     = true,
        hand_tremor       = true,
        dizzy             = true,
        death_feeling     = true,
        self_zombie       = true,
        collapse          = true,
        drunk             = true,
        fake_lag          = true,
        fake_wounds       = true,
        -- لاعبون
        hide_player       = true,
        solo_visible      = true,
        possess           = true,
        ghost_vision      = true,
    },

    -- سيناريوهات جاهزة (Config.Scenarios)
    Scenarios = {
        zombie_outbreak        = true,
        near_death             = true,
        memory_lane            = true,
        insect_nightmare       = true,
        drug_trip              = true,
        psychosis              = true,
        paranoia               = true,
        ptsd_flashback         = true,
        haunted                = true,
        zombie_delusion        = true,
        grief                  = true,
        fever_dream            = true,
        withdrawal             = true,
        stalked                = true,
        alcohol_blackout       = true,
        sleep_deprivation      = true,
        imaginary_friend       = true,
    },

    -- مؤثرات استعراضية (Config.Cues)
    Cues = {
        jumpscare        = true,
        blackout         = true,
        heartbeat_rush   = true,
        glitch           = true,
        quake            = true,
        whispers         = true,
        blood_rain       = true,
        freeze           = true,
    },

    -- مشاهد (Config.Scenes) - المشاهد التي تضيفها من الواجهة تتبع هذه القائمة أيضاً إن ذكرت اسمها
    Scenes = {
        memory_family_table        = true,
        memory_old_friend_goodbye  = true,
        memory_shooting_night      = true,
        present_ambush             = true,
        present_hospital_staff     = true,
        present_dead_relative      = true,
    },
}

-- ======================================================================
-- 2) PERMISSIONS / الصلاحيات
-- ======================================================================
-- الكونسول (id 0) مسموح له دائماً. بقية اللاعبين: صلاحية ACE أو وظيفة (Job) من الفريمورك.
-- في server.cfg:  add_ace group.admin universal_hallucination.use allow   (وكذلك .director .swap .admin)
Config.Permissions = {
    Use      = 'universal_hallucination.use',      -- /halluc /hscenario /hstop /hhide /hsolo /hghost
    Director = 'universal_hallucination.director', -- /hdirect /hsay (التحكم بشخص وهمي بحوار حي)
    Swap     = 'universal_hallucination.swap',     -- /hswap /hrestore (تبديل الملامح/الأغراض)
    Admin    = 'universal_hallucination.admin',     -- تجاوز كل القيود (مثل الـ opt-out)

    -- وظائف تُعطى الصلاحية تلقائياً (تحتاج فريمورك): مثال { Use = { 'ambulance', 'psychologist' } }
    Jobs = {
        Use      = {},
        Director = {},
        Swap     = {},
    },
}

-- ======================================================================
-- 3) SAFETY / الأمان والخصوصية
-- ======================================================================
Config.Safety = {
    MaxConcurrentPerPlayer = 8,      -- أقصى عدد هلوسات متزامنة للاعب الواحد | 1-30 | 8
    MaxDuration            = 1800,   -- أقصى مدة هلوسة (ثانية) | 5-7200 | 1800
    MinIntensity           = 0.05,   -- أقل شدة مقبولة | 0.0-1.0 | 0.05
    BlockWhenDead          = true,   -- لا تبدأ هلوسة لاعب ميت | true/false | true
    BlockWhenBusy          = false,  -- لا تبدأ هلوسة لمن هو مقيّد/في السجن (حسب الفريمورك) | true/false | false
    StopOnDeath            = true,   -- إيقاف كل الهلوسات عند الموت | true/false | true
    NoEntitiesWhileDriving = true,   -- لا تظهر أشخاص/زومبي وهميين أثناء القيادة (للأمان) | true/false | true

    AllowOptOut            = true,   -- يسمح للاعب بإيقاف استقبال الهلوسات من الأوامر بـ /hoff | true/false | true
    OptOutBlocksScripts    = false,  -- هل يمنع الـ opt-out هلوسات السكربتات الأخرى (مخدرات...) أيضاً | true/false | false
    AllowCustomModels      = false,  -- يسمح بتمرير موديل Ped من الأمر (غير الموجود في القوائم أدناه) | true/false | false
    AllowRagdoll           = false,  -- يسمح بأن تُسقط الهلوسة اللاعب أرضاً (dizzy) | true/false | false
    AllowTimeScale         = true,   -- يسمح بنوع time_slow (إبطاء سرعة اللعبة محلياً) | true/false | true
    TimeScaleMin           = 0.6,    -- أقل سرعة مسموحة للعبة | 0.3-1.0 | 0.6
    LogToConsole           = true,   -- سجل كل هلوسة (من فعلها ومن استقبلها) في الكونسول | true/false | true
    DiscordWebhook         = '',     -- رابط Webhook ديسكورد لسجل الهلوسات ('' = معطل). يرسل أسماء اللاعبين فقط | نص
}

-- ======================================================================
-- 4) COMMANDS / الأوامر (غيّر أسماءها كما تشاء)
-- ======================================================================
-- ضع nil أو '' لتعطيل أمر. كلها تعمل أيضاً من الكونسول (بدل <id> اكتب رقم اللاعب).
Config.Commands = {
    Start     = 'halluc',     -- /halluc <id|me> <type> [seconds] [intensity 0-1]
    Scenario  = 'hscenario',  -- /hscenario <id|me> <scenario> [seconds]
    Stop      = 'hstop',      -- /hstop [id|all]
    List      = 'hlist',      -- /hlist  : يعرض الأنواع والسيناريوهات
    Hide      = 'hhide',      -- /hhide <viewerId|all> <subjectId> [seconds] : المشاهد لا يرى الشخص
    Solo      = 'hsolo',      -- /hsolo <subjectId> <viewerId> [seconds]     : الشخص يراه المشاهد فقط
    Ghost     = 'hghost',     -- /hghost <id|me> [alpha 0-255] [seconds]     : يرى اللاعبين شفافين
    Direct    = 'hdirect',    -- /hdirect <id> [friend|double|ghost|gunman|stalker] [model|player:<id>] : تحكم حي
    Say       = 'hsay',       -- /hsay <text> : المتحكم يتكلم عبر الشخص الوهمي
    Reply     = 'hr',         -- /hr <text>   : الهدف يرد على الشخص الوهمي
    Swap      = 'hswap',      -- /hswap <idA> <idB> [seconds] : تبديل الملامح (والأغراض إن فُعّلت)
    Restore   = 'hrestore',   -- /hrestore [id] : إرجاع الملامح
    OptOut    = 'hoff',       -- /hoff : إيقاف/تشغيل استقبال هلوسات الأوامر (لو AllowOptOut)
    Menu      = 'hmenu',      -- /hmenu : لوحة التحكم (واجهة كاملة) لمن لديه صلاحية Use
    Carry     = 'hcarry',     -- /hcarry <id> : (أدمن) نقل أغراض القائمة البيضاء للشخصية الحالية (راجع Config.Swap.Carry)
    Appear    = 'happear',    -- /happear <targetId> [seconds] : تظهر بشخصيتك الحقيقية للاعب محدد فقط (لا يراك غيره)
    Take      = 'htake',      -- /htake <id> : (المرحلة 1) تظهر للاعب وحده وتتحدث معه صوتياً وتهدده
    Seize     = 'hseize',     -- /hseize : (المرحلة 2) مبارزة ميني جيم، إن خسر اللاعب تدخل شخصيته ويذهب هو لمكانك
    Back      = 'hback',      -- /hback [id] : ينهي التبديل ويُرجع المتحكم واللاعب بالضبط لأماكنهما قبل التبديل
    Release   = 'hrelease',   -- /hrelease : إنهاء التبديل وإرجاع كل واحد لشخصيته ومكانه
    Possess   = 'hpossess',   -- /hpossess <targetId> [seconds] : يرى اللاعب بعينيك ويتجمد ويصمت، وأنت تتكلم بملامحه
    Unpossess = 'hunpossess', -- /hunpossess [targetId] : إنهاء السيطرة
    Cue       = 'hcue',       -- /hcue <id|me> <cue> : مؤثر استعراضي فوري (jumpscare, blackout...)
    Scene     = 'hscene',     -- /hscene <id|me> <scene> [seconds] : مشهد من الماضي/الحاضر (Config.Scenes)
    Voice     = 'hvoice',     -- /hvoice <id> : تشغيل/إيقاف صوت مايك لمايك بينك وبين لاعب (Config.Voice)
    Adjust    = 'hadjust',    -- /hadjust <id|me> <0-1> : تغيير شدة كل هلوسات لاعب مباشرة
}

-- ======================================================================
-- 5) TYPES / أنواع الهلوسة (38 نوع) - كل نوع له إعداداته
-- ======================================================================
-- مشترك لكل نوع:  Enabled = تفعيل | Duration = المدة الافتراضية (ثانية) | Intensity = الشدة الافتراضية 0.0-1.0
-- النطاقات { min = , max = } تُختار عشوائياً بين القيمتين. الشدة (Intensity) تضبط العدد/القوة تلقائياً.
-- أسماء الموديلات (Models) يجب أن تكون موجودة في لعبتك. الموديل غير الموجود يُتخطى بأمان.
local PEOPLE = { 'a_m_y_hipster_01', 'a_f_y_hipster_01', 'a_m_m_business_01', 'a_f_m_business_02' }

Config.Types = {
    -- ------------------------------------------------------------------
    -- (أ) كيانات / Entities: أشخاص وكائنات يراها الهدف فقط (محلية 100%، لا يراها أحد غيره)
    -- ------------------------------------------------------------------
    ghost = {   -- شبح يظهر أمامك ويحدّق ثم يقترب كلما أشحت بنظرك
        Enabled = true, Duration = 90, Intensity = 0.5,
        Models = PEOPLE,             -- موديلات عشوائية (تُستخدم إذا Source = 'model')
        Source = 'model',            -- 'model' = من القائمة | 'self' = نسخة منك | 'subject' = نسخة من لاعب (يحتاج subject)
        Distance = { min = 9.0, max = 15.0 },       -- متر
        IndoorDistance = { min = 2.5, max = 5.0 },  -- متر داخل المباني
        SpawnAngle = { min = -70.0, max = 70.0 },   -- زاوية الظهور بالنسبة لنظرك: 0 = أمامك مباشرة | -90 يسارك | 90 يمينك | 180 خلفك (استخدم -180..180 لأي اتجاه)
        Alpha = 170,                 -- الشفافية 0-255 (255 = صلب)
        FadeInMs = 900,              -- مدة الظهور التدريجي (مللي ثانية)
        Lifetime = { min = 18.0, max = 40.0 },      -- كم ثانية يبقى في كل ظهور قبل أن يتلاشى
        Approach = true,             -- يقترب عندما لا تنظر إليه
        ApproachSpeed = 1.0,         -- سرعة المشي 0.5-3.0
        StopWhenLooked = true,       -- يتجمّد في مكانه إذا نظرت إليه
        Flicker = true,              -- يرتجف/يومض عند التحديق به
        VanishWhenLooked = false,    -- true = يختفي إذا حدّقت به
        LookSeconds = 6.0,           -- (إذا VanishWhenLooked) كم ثانية نظر تكفي ليختفي
        VanishDistance = 1.8,        -- يختفي عند هذه المسافة مع رعشة
        Shake = 0.25,                -- قوة رعشة الشاشة عند وصوله 0-1
        Whisper = true,              -- صوت خفيف عند ظهوره
        Respawn = { min = 6.0, max = 14.0 },        -- ثواني بين ظهور وآخر
        MaxSpawns = 6,               -- أقصى عدد ظهور في الهلوسة الواحدة
    },
    shadow = {  -- ظل يعبر في طرف الرؤية بسرعة
        Enabled = true, Duration = 75, Intensity = 0.5,
        Models = PEOPLE,
        Alpha = 70,
        Distance = { min = 7.0, max = 12.0 },
        Speed = 2.0,                 -- 1.0 مشي | 2.0 ركض | 3.0 عدو
        Interval = { min = 8.0, max = 20.0 },       -- ثواني بين مرورين
    },
    stalker = { -- يتبعك من الخلف ويتجمّد عندما تلتفت (على طريقة Weeping Angel)
        Enabled = true, Duration = 120, Intensity = 0.5,
        Models = PEOPLE,
        Alpha = 190,
        FollowDistance = 7.0,        -- المسافة التي يحافظ عليها
        FreezeWhenLooked = true,     -- يتجمد عندما تنظر إليه
        Speed = 1.2,
        VanishDistance = 2.0,
    },
    crowd = {   -- جمهور واقف يحدّق بك من بعيد
        Enabled = true, Duration = 90, Intensity = 0.5,
        Models = PEOPLE,
        Count = { min = 3, max = 9 },               -- يُضرب بالشدة
        Radius = { min = 12.0, max = 24.0 },
        Alpha = 215,
        VanishWhenApproach = 6.0,    -- يختفون إذا اقتربت منهم لهذه المسافة
    },
    zombie_horde = { -- زومبي ببيدات حقيقية متنوعة (يمشي/يعرج/يركض/يسقط ويقوم/يزحف/يتربص) ويختفي قبل أن يصلك (بدون أي ضرر)
        Enabled = true, Duration = 60, Intensity = 0.6,
        Models = { 'u_m_y_zombie_01' },  -- (احتياطي) القائمة الحقيقية في Config.Realism.Zombies.Models
        Count = { min = 3, max = 10 },
        SpawnDistance = { min = 22.0, max = 38.0 },
        VanishDistance = 1.7,        -- يختفي عند هذه المسافة مع رعشة شاشة
        Waves = 3,                   -- عدد الموجات (تُضرب بالشدة)
        WaveGap = { min = 8.0, max = 16.0 },
        Groans = true,               -- أصوات الزومبي
        SightScare = true,           -- نبض قلب + وميض أحمر + أنين لحظة رؤيتك للزومبي لأول مرة
        WaveSeconds = 28,            -- أقصى مدة لكل موجة (ثواني)
        BloodFlash = true,           -- وميض دم عند الاختفاء
        Shake = 0.35,                -- رعشة الكاميرا عند الاختفاء 0-1
    },
    animals = { -- فئران/قطط/كلاب وهمية تقترب
        Enabled = true, Duration = 60, Intensity = 0.5,
        Models = { 'a_c_rat', 'a_c_cat_01', 'a_c_rottweiler' },
        Count = { min = 2, max = 7 },
        Distance = { min = 8.0, max = 16.0 },
        Speed = 1.6,
        VanishDistance = 1.2,
    },
    gunman = {  -- شخص يصوّب عليك سلاحاً ويطلق (طلقات تخطئ دائماً وبدون ضرر)
        Enabled = true, Duration = 45, Intensity = 0.6,
        Models = PEOPLE,
        Source = 'model',            -- 'model' | 'self' | 'subject'
        Weapon = 'WEAPON_PISTOL',    -- شكل السلاح فقط (يُعطى بدون ذخيرة والطلقات المرئية تُحاكى)
        Distance = { min = 6.0, max = 11.0 },
        AimSeconds = { min = 2.0, max = 5.0 },
        Shots = { min = 1, max = 3 },
        ShotGap = { min = 350, max = 900 },         -- ms بين الطلقات
        MissBy = 2.2,                -- متر: الطلقة تخطئ بهذه المسافة دائماً
        Flash = true,                -- وميض أبيض عند الطلقة
        Shake = 0.45,                -- رعشة الكاميرا عند الطلقة 0-1
        Alpha = 255,
    },
    double = {  -- قرين: نسخة منك أو من لاعب آخر تقف وتحدّق أو تقلّدك
        Enabled = true, Duration = 90, Intensity = 0.5,
        Source = 'self',             -- 'self' = نسخة منك | 'subject' = نسخة من لاعب (subject) | 'model'
        Models = PEOPLE,
        Behavior = 'stare',          -- 'stare' = يحدّق | 'follow' = يتبعك | 'mimic' = يقف بجانبك ويلتفت معك
        Distance = { min = 6.0, max = 10.0 },
        Alpha = 210,
        VanishDistance = 1.5,
    },
    echo = {    -- صدى: نسخة منك تعيد خطواتك بالضبط بعد عدة ثوانٍ، وتختفي إذا وصلت إليك
        Enabled = true, Duration = 120, Intensity = 0.5,
        Source = 'self',             -- 'self' = نسخة منك | 'subject' | 'model'
        Models = PEOPLE,
        Delay = { min = 5.0, max = 9.0 },   -- كم ثانية تتأخر عنك
        MinGap = 4.0,                -- لا تظهر إلا إذا كانت أبعد منك بهذه المسافة (متر)
        VanishDistance = 2.0,        -- تختفي عندما تصل لهذه المسافة منك (تقف أنت فتلحق بك)
        RestSeconds = 5.0,           -- راحة قبل أن تظهر من جديد
        Alpha = 170,                 -- الشفافية 0-255
    },
    friend = {  -- شخص (أو صديق وهمي) يراه الهدف فقط، يمشي معه ويتكلمان (حوار جاهز أو تحكم حي)
        Enabled = true, Duration = 600, Intensity = 0.5,
        Models = PEOPLE,
        Source = 'model',            -- 'model' | 'self' | 'subject' (يظهر بشكل لاعب حقيقي)
        Alpha = 255,
        FollowOffset = { x = -0.9, y = -1.3, z = 0.0 }, -- مكانه بالنسبة لك (يمين/أمام/أعلى)
        TalkKey = 38,                -- زر بدء الحديث (38 = E) https://docs.fivem.net/docs/game-references/controls/
        TalkKeyLabel = 'E',          -- الحرف الظاهر في التلميح
        TalkRange = 3.0,             -- متر
        AutoTalk = true,             -- يبدأ الحديث وحده كل فترة
        AutoTalkEvery = { min = 25.0, max = 60.0 },
        Dialogue = 'imaginary_friend', -- اسم الحوار من Config.Dialogues (يُستخدم عند عدم وجود متحكم)
        Speech = true,               -- يشغّل صوت كلام عام للشخصية عند الحديث (ان وُجد)
        DisappearInVehicle = true,   -- يختفي عند ركوب مركبة ويعود عند النزول
        Name = { ar = 'صديق', en = 'Friend' },
    },

    -- ------------------------------------------------------------------
    -- (ب) إدراك بصري / Perception: تأثيرات على الشاشة
    -- ------------------------------------------------------------------
    distortion = {  -- تشوّه وتموّج
        Enabled = true, Duration = 90, Intensity = 0.5,
        Timecycle = 'drug_wobbly', Pulse = true,
    },
    acid_trip = {   -- رحلة مخدرات: ألوان وتأثيرات تتبدل
        Enabled = true, Duration = 90, Intensity = 0.6,
        Timecycles = { 'drug_flying_01', 'drug_flying_02', 'DRUG_gas_huffin', 'drug_wobbly' },
        PostFX = 'DrugsMichaelAliensFight',   -- '' = بدون
        CycleSeconds = 14,
        Tint = '#7B2FF7',
    },
    tunnel_vision = { -- رؤية نفقية (حواف سوداء)
        Enabled = true, Duration = 60, Intensity = 0.6,
        Pulse = true,
    },
    double_vision = { -- رؤية مزدوجة / تغبيش
        Enabled = true, Duration = 60, Intensity = 0.5,
        Timecycle = 'drug_drive_blend01',
    },
    flicker = {     -- انطفاءات ووميض للشاشة
        Enabled = true, Duration = 75, Intensity = 0.5,
        Interval = { min = 4.0, max = 11.0 },
        Length = { min = 80, max = 260 },          -- ms
        Color = '#000000',
    },
    bugs = {        -- حشرات تزحف على الشاشة
        Enabled = true, Duration = 75, Intensity = 0.5,
        Count = 60,                  -- يُضرب بالشدة
        Color = '#120C08',
    },
    blood = {       -- دم يسيل من حواف الشاشة
        Enabled = true, Duration = 45, Intensity = 0.5,
    },
    words = {       -- كلمات تظهر وتختفي على الشاشة (من Config.Texts.Whispers)
        Enabled = true, Duration = 75, Intensity = 0.5,
        Interval = { min = 5.0, max = 12.0 },
        Pool = 'Whispers',
    },
    tint = {        -- صبغة لون على الشاشة
        Enabled = true, Duration = 75, Intensity = 0.5,
        Color = '#8B0000', Pulse = true,
    },
    eyes = {        -- العين: الشاشة تصير فتحة عين تفتح وتغلق (جفون ثقيلة، رمش، رؤية مشوشة) أو عين ضخمة في الظلام تحدّق بك
        Enabled = true, Duration = 50, Intensity = 0.6,
        Mode     = 'lids',                        -- 'lids' = الشاشة نفسها تصير عيناً: ترى العالم من فتحة عين تفتح وترمش وتنغلق كلها ثم تفتح بعد مدة (الافتراضي)
                                                  -- 'watcher' = عين ضخمة (بؤبؤ وبياض) تحدّق بك في الظلام | 'both' = تتناوب
        Interval = { min = 7.0, max = 16.0 },     -- كل كم ثانية تبدأ دورة فتح/إغلاق جديدة (يقصر مع الشدة)
        Blinks   = { min = 1, max = 3 },          -- عدد الرمشات في الدورة
        Veins    = true,                          -- عروق حمراء وإطار دموي حول الجفون
        Blur     = true,                          -- تغبيش العالم خلف الجفون
        Color    = '#070101',                     -- لون الجفن/الظلام
        Iris     = { '#b8902a', '#7a8f3a', '#5a7fa6', '#8a1f1f', '#d8d3c4' },   -- ألوان قزحية العين الضخمة (يُختار واحد)
        Slit     = 0.25,                          -- احتمال بؤبؤ عمودي (عين وحش) بدل المستدير | 0-1
        Shake    = true,                          -- رجّة خفيفة مع كل فتحة
    },
    camera_sway = { -- ترنّح الكاميرا
        Enabled = true, Duration = 60, Intensity = 0.5,
        Shake = 'DRUNK_SHAKE',
    },
    time_slow = {   -- إبطاء/تذبذب سرعة اللعبة محلياً (يحكمه Config.Safety.TimeScaleMin)
        Enabled = true, Duration = 45, Intensity = 0.4,
    },
    fake_notify = { -- إشعارات وهمية (من Config.Texts.FakeNotify) عبر نظام الإشعارات
        Enabled = true, Duration = 120, Intensity = 0.5,
        Interval = { min = 15.0, max = 40.0 },
        Pool = 'FakeNotify',
    },

    -- ------------------------------------------------------------------
    -- (ج) أصوات / Audio: كلها مصنوعة خصيصاً للسكربت (ملفات html/assets/sounds/<name>.ogg) ويمكنك استبدالها
    -- Direction = 'behind' | 'left' | 'right' | 'front' | 'random' | 'around'
    -- ------------------------------------------------------------------
    heartbeat = {
        Enabled = true, Duration = 60, Intensity = 0.5, Volume = 0.9, Pulse = true,
    },
    breathing = {
        Enabled = true, Duration = 60, Intensity = 0.5, Volume = 0.8,
    },
    whispers_audio = {
        Enabled = true, Duration = 75, Intensity = 0.5, Volume = 0.8,
        Direction = 'around', Interval = { min = 5.0, max = 14.0 },
    },
    footsteps_behind = {
        Enabled = true, Duration = 60, Intensity = 0.5, Volume = 0.8,
        Direction = 'behind', Interval = { min = 10.0, max = 24.0 }, StopWhenTurn = true,
    },
    knocking = {
        Enabled = true, Duration = 60, Intensity = 0.5, Volume = 0.9,
        Direction = 'random', Interval = { min = 8.0, max = 20.0 },
    },
    phone_ring = {
        Enabled = true, Duration = 45, Intensity = 0.5, Volume = 0.8,
        Interval = { min = 12.0, max = 28.0 },
    },
    static_noise = {
        Enabled = true, Duration = 45, Intensity = 0.5, Volume = 0.6,
    },
    drone = {
        Enabled = true, Duration = 75, Intensity = 0.5, Volume = 0.7,
    },
    music_box = {
        Enabled = true, Duration = 60, Intensity = 0.5, Volume = 0.7,
        Direction = 'around',
    },
    tinnitus = {
        Enabled = true, Duration = 30, Intensity = 0.5, Volume = 0.5,
    },
    distant_gunshots = {
        Enabled = true, Duration = 60, Intensity = 0.5, Volume = 0.8,
        Direction = 'random', Interval = { min = 6.0, max = 18.0 },
    },

    -- ------------------------------------------------------------------
    -- (د) الجسد / Body
    -- ------------------------------------------------------------------
    weapon_tremor = {  -- اهتزاز السلاح عند حمله/التصويب
        Enabled = true, Duration = 90, Intensity = 0.6,
        Amplitude = 0.35,            -- قوة رعشة الكاميرا 0-1 (تُضرب بالشدة)
        Shake = 'HAND_SHAKE',
        OnlyWhenArmed = true,        -- لا يعمل إلا عند حمل سلاح
        AimSway = 0.6,               -- انحراف التصويب العشوائي (درجات تقريبية) تُضرب بالشدة
        UnarmedAmplitude = 0.0,      -- رعشة اليد عند عدم حمل سلاح 0-1
    },
    hand_tremor = {    -- رعشة مستمرة في الكاميرا
        Enabled = true, Duration = 60, Intensity = 0.4,
        Shake = 'HAND_SHAKE', Amplitude = 0.25,
    },
    dizzy = {          -- دوخة: مشية مترنحة
        Enabled = true, Duration = 60, Intensity = 0.5,
        ClipsetMale = 'move_m@drunk@verydrunk',
        ClipsetFemale = 'move_m@drunk@verydrunk',  -- غيّرها إذا لديك مشية أنثوية
        Shake = 'DRUNK_SHAKE',
        StumbleEvery = { min = 10.0, max = 25.0 }, -- سقطة خفيفة (لا تعمل إلا إذا AllowRagdoll = true)
    },

    -- ------------------------------------------------------------------
    -- (هـ) رؤية الآخرين / People visibility (محلية: تغيّر ما يراه الهدف فقط)
    -- ------------------------------------------------------------------
    hide_player = {    -- المشاهد لا يرى شخصاً معيناً (أو الجميع)
        Enabled = true, Duration = 120, Intensity = 1.0,
    },
    solo_visible = {   -- شخص يراه المشاهد (أو مشاهدين) فقط ولا يراه غيرهم (مثل: ريسبون يراه شخص واحد)
        Enabled = true, Duration = 120, Intensity = 1.0,
    },
    possess = {        -- السيطرة: الهدف يرى بعين المتحكم (الإداري) ويتجمد ويصمت (يُبدأ بـ /hpossess)
        Enabled = true, Duration = 120, Intensity = 1.0,
    },
    takeover = {       -- (داخلي) مبارزة اللاعب ضد المتحكم بالميني جيم: يبدأها /hseize ولا تُشغَّل يدوياً
        Enabled = true, Duration = 40, Intensity = 1.0,
    },
    world_frozen = {   -- (داخلي) اللاعب المنقول إلى عالم/مكان آخر: يرى فقط ولا يتحرك حتى يُرجَع
        Enabled = true, Duration = 600, Intensity = 1.0,
    },
    takeover_ghost = { -- (داخلي) حالة المسيطَر عليه بعد التبديل: يرى ويسمع الجميع، لا يراه ولا يسمعه إلا المتحكم، ولا يتحرك
        Enabled = true, Duration = 300, Intensity = 1.0,
    },
    ghost_vision = {   -- المشاهد يرى اللاعبين الآخرين شفافين
        Enabled = true, Duration = 120, Intensity = 1.0,
        Alpha = 110,                 -- 0-255
        Range = 120.0,               -- متر
    },

    -- ------------------------------------------------------------------
    -- (هـ) واقعية / Realism: بيدات حقيقية، إطلاق نار، موت، مشاهد، حشرات، سكر، غرق
    -- مجموعات البيدات والأسلحة والحشرات في قسم Config.Realism أدناه، والمشاهد في Config.Scenes
    -- ------------------------------------------------------------------
    gunfight = {   -- معركة بالرصاص حوله: مطلقو نار ببيدات حقيقية، رصاص يمر بجانب رأسه ويضرب الأرض والجدران (بدون أي ضرر)
        Enabled = true, Duration = 40, Intensity = 0.7,
        Mode = 'ambush',              -- 'ambush' = من جهة واحدة | 'crossfire' = من جهتين | 'distant' = معركة بعيدة
        Count = { min = 2, max = 4 }, -- عدد المطلقين (يُضرب بالشدة) | 1-8
        Distance = { min = 14.0, max = 30.0 },
        BurstGap = { min = 1.2, max = 3.5 },   -- ثواني بين الرشقات
        WhizChance = 0.6,             -- احتمال رصاصة تمر بجانب رأسك
        ImpactChance = 0.55,          -- احتمال رصاصة تضرب الأرض/الجدار قربك (غبار وتشققات)
        Shake = 0.4,                  -- رعشة الكاميرا مع كل رشقة 0-1
        Panic = true,                 -- نبض + طنين + حواف حمراء مع الاشتباك
        DuckReaction = true,          -- هزة كاميرا انحناء عند مرور رصاصة قريبة
        Alpha = 255,
    },
    death_feeling = {  -- إحساس الموت (بدون موت حقيقي أبداً): إصابة، رؤية تخبو، ذكريات، كلمات أخيرة، إغماء ثم استيقاظ
        Enabled = true, Duration = 45, Intensity = 0.85,
        Hits = { min = 1, max = 3 },  -- عدد "الإصابات" في البداية
        Ragdoll = true,               -- يسقط أرضاً لثوانٍ عند الإصابة (فقط وهو ماشٍ على الأرض)
        RagdollSeconds = 2.5,
        SlowMotion = true,            -- إبطاء الزمن (يحكمه Safety.TimeScaleMin)
        LifeFlash = {                 -- ومضات من الذكريات قبل الإغماء (مشاهد من Config.Scenes)
            Enabled = true,
            Scenes = { 'memory_family_table', 'memory_old_friend_goodbye' },
            Seconds = 7,
        },
        LastWords = true,             -- كلمات أخيرة على الشاشة (Config.Texts.LastWords)
        Blackout = 4.0,               -- ثواني السواد
        Faint = true,                 -- يبقى ملقى على الأرض أثناء السواد (لا يموت)
        WakeUp = true,                -- يستيقظ بلهاث ورؤية تعود تدريجياً
    },
    scene = {   -- مشهد من الماضي أو الحاضر من Config.Scenes (ممثلون ببيدات حقيقية يمشون ويتحدثون ويطلقون ويسقطون)
        Enabled = true, Duration = 60, Intensity = 0.7,
        Default = 'memory_family_table',   -- المشهد عند عدم تحديد اسم | يمكن تحديده بالأمر/اللوحة
        Subtitles = true,             -- حوار الممثلين على الشاشة
        EndWhenDone = true,           -- تنتهي الهلوسة عند انتهاء المشهد
        Environment = true,           -- يغيّر الوقت والطقس محلياً أثناء المشهد (قد يتعارض مع سكربتات الطقس)
    },
    self_zombie = {  -- يشعر أنه يتحول لزومبي: عدوى، مشية زومبي، سقوط في الشارع، رؤية متعفنة
        Enabled = true, Duration = 90, Intensity = 0.7,
        InfectionSeconds = 18,        -- مرحلة المرض قبل التحول
        Clipset = 'move_m@drunk@verydrunk',     -- مشية الزومبي
        FallEvery = { min = 12.0, max = 26.0 }, -- كل كم ثانية يسقط
        FallSeconds = { min = 2.5, max = 5.0 },
        Wounds = true,                -- جروح وكدمات على شخصيته (تُنظّف عند النهاية)
        Groans = true,
        Tint = '#4A5A2A',
    },
    collapse = {  -- يسقط في الشارع (إغماء/تعثر) مرة أو أكثر
        Enabled = true, Duration = 45, Intensity = 0.6,
        Falls = { min = 1, max = 3 },
        FallSeconds = { min = 2.5, max = 5.0 },
        PreludeSeconds = 3.0,         -- دوخة قبل السقوط
        GapSeconds = { min = 8.0, max = 18.0 },
    },
    insects = {   -- حشرات: ذباب وصراصير وفئران وطيور حقيقية + جزيئات + شاشة + صوت + حكّة
        Enabled = true, Duration = 75, Intensity = 0.6,
        Layers = {                    -- أي طبقة تريدها
            Screen = true,            -- حشرات تزحف على الشاشة
            Particles = true,         -- جزيئات ذباب/حشرات حول الجسم (من Config.Realism.Insects.Particles)
            Creatures = true,         -- فئران وغربان حقيقية تتحرك حولك (Config.Realism.Insects.Creatures)
            Props = true,             -- مجسمات حشرات تضيفها أنت (Config.Realism.Insects.PropModels) تزحف على جسمك
            Sound = true,             -- طنين وخربشة
            Itch = true,              -- حكّة: ارتعاش كاميرا وحركة نفض
        },
        ItchEvery = { min = 6.0, max = 14.0 },
    },
    fake_lag = {   -- "لاق" وهمي: يتجمد الشخص لحظة وقد يرجع للخلف خطوات كأن السيرفر سحبه
        Enabled = true, Duration = 90, Intensity = 0.5,
        Interval = { min = 10.0, max = 24.0 },  -- بين كل لاق ولاق (ثانية)، تقل مع الشدة
        MinSpeed = 1.5,              -- لا يحدث إلا وهو يمشي بهذه السرعة (م/ث)
        Lag = { min = 0.6, max = 1.1 },   -- كم يكمل المشي قبل السحب (ثانية)
        Freeze = { min = 0.3, max = 0.6 },-- مدة التجمد (ثانية)
        RubberChance = 0.6,          -- احتمال الرجوع للخلف
        MaxBack = 8.0,               -- أقصى مسافة رجوع (متر)
    },
    fake_wounds = {   -- جروح وكدمات تظهر على جسده واحدة بعد الأخرى مع عرج (بصري فقط، لا ينقص دمه)
        Enabled = true, Duration = 90, Intensity = 0.5,
        Count = 4,                   -- عدد الجروح (يتأثر بالشدة)
        GapSeconds = 5.0,            -- بين كل جرح وجرح
        Packs = { 'BigHitByVehicle', 'Explosion_Med', 'Skin_Melee_0', 'Splashback_Torso_0', 'Burnt_Ped_0' },
        Limp = true,                 -- عرج بعد ثاني جرح
        Clipset = 'move_m@injured',
    },
    drunk = {   -- سكران: مشية سكران وترنح ورؤية مزدوجة وتعثر
        Enabled = true, Duration = 90, Intensity = 0.6,
        Clipset = 'move_m@drunk@verydrunk',
        Timecycle = 'drug_drive_blend01',
        Shake = 'DRUNK_SHAKE',
        StumbleChance = 0.3,          -- احتمال التعثر عند كل محاولة
        StumbleEvery = { min = 14.0, max = 32.0 },
    },
    underwater = {  -- إحساس الغرق/تحت الماء: ألوان زرقاء، ترنح، أنفاس مكتومة
        Enabled = true, Duration = 40, Intensity = 0.7,
        Timecycle = 'underwater',
        Shake = 'SKY_DIVING_SHAKE',
        Bubbles = true,
    },
}

-- ======================================================================
-- 5b) REALISM / مجموعات البيدات والأسلحة والحشرات (كلها قابلة للتعديل)
-- ======================================================================
-- أي موديل غير موجود في سيرفرك يُتخطى تلقائياً ولا يسبب خطأ. أضف موديلات سيرفرك الخاصة بحرية.
Config.Realism = {
    Zombies = {
        -- بيدات الزومبي: كل ظهور يأخذ موديلاً عشوائياً من القائمة + جروح ودم ومظهر عشوائي
        Models = {
            'u_m_y_zombie_01', 'a_m_m_tramp_01', 'a_m_o_tramp_01', 'a_f_m_tramp_01', 'a_m_m_skidrow_01',
            'a_m_m_trampbeac_01', 'a_m_y_methhead_01', 'a_m_m_hillbilly_01', 'a_m_m_hillbilly_02',
            'a_f_y_hippie_01', 'u_m_y_burgerdrug_01', 'u_f_m_corpse_01', 'u_f_y_corpse_01', 'a_m_m_farmer_01',
            's_m_y_garbage', 's_m_m_gardener_01', 'a_m_o_beach_01', 'a_f_o_soucent_01',
        },
        -- الأنماط: Weight = نسبة الظهور. Speed = سرعة الحركة (1.0 مشي، 2.0 ركض). Clipset = شكل المشية.
        Variants = {
            walker  = { Weight = 28, Speed = 1.0, Clipset = 'move_m@drunk@verydrunk' },
            limper  = { Weight = 20, Speed = 1.0, Clipset = 'move_m@injured' },
            runner  = { Weight = 14, Speed = 2.6, Clipset = '' },
            faller  = { Weight = 16, Speed = 1.8, Clipset = 'move_m@drunk@moderatedrunk', FallChance = 0.8, FallSeconds = { min = 1.8, max = 3.4 } },
            crawler = { Weight = 10, Speed = 0.9, Anim = { dict = 'combat@damage@writhe', name = 'writhe_loop', flag = 1 } },
            lurker  = { Weight = 12, Speed = 1.2, Clipset = 'move_m@drunk@slightlydrunk', Scenario = 'WORLD_HUMAN_STUPOR', WakeDistance = 11.0 },
        },

        -- ==================================================================
        -- أشكال الزومبي المسماة (16 شكل). كل ظهور يختار شكلاً بحسب Weight.
        -- Named zombie forms: each spawn picks one by Weight. Every field is optional:
        --   Models      موديلات هذا الشكل (تحدد الشعر/الجنس/اللبس)     Variant  نمط الحركة من Variants أعلاه
        --   Speed       مضاعِف السرعة (1.0 عادي)                         Alpha    الشفافية 0-255 (للأشباح)
        --   Wounds / WoundCount / BloodSplats   جروح ودم خاصة بالشكل      Mood     تعبير الوجه
        --   Ptfx        جزيئات على الجسم { Asset, Name, Bone, Scale }     Enabled  false لإيقافه
        -- لإجبار شكل معين: أرسل params.look = 'ghost_girl' (من اللوحة/exports)
        -- أسماء الموديلات من الذاكرة: تحقق منها في تبويب التشخيص، وعدّلها لحزمة الملابس عندك
        -- ==================================================================
        Looks = {
            ghost_girl  = { Weight = 9,  Models = { 'a_f_y_hippie_01', 'u_f_y_corpse_01', 'a_f_m_tramp_01' }, Variant = 'walker', Speed = 1.0, Alpha = 225, Mood = 'mood_stressed_1', Wounds = { 'Skin_Melee_0' }, BloodSplats = { min = 3, max = 6 } },   -- بنت الشعر الطويل (وجهها مخفي بالشعر)
            ghost_bride = { Weight = 6,  Models = { 'a_f_y_hippie_01', 'u_f_m_corpse_01', 'a_f_o_soucent_01' }, Variant = 'walker', Speed = 0.9, Alpha = 235, Wounds = { 'Skin_Melee_0', 'Splashback_Torso_0' } },                                       -- العروس الميتة
            rot         = { Weight = 12, Models = { 'u_m_y_zombie_01', 'a_m_m_tramp_01' }, Wounds = { 'Skin_Melee_0', 'BigHitByVehicle' }, BloodSplats = { min = 3, max = 6 } },                                                 -- زومبي متعفن
            jaw         = { Weight = 7,  Models = { 'a_m_o_tramp_01', 'a_m_m_skidrow_01' }, Variant = 'limper', Wounds = { 'MTD_melee_face_jaw', 'Explosion_Med' }, BloodSplats = { min = 4, max = 7 }, Mood = 'mood_injured_1' },      -- فك مخلوع/ممزق
            screamer    = { Weight = 7,  Models = { 'a_m_y_methhead_01', 'a_f_y_hippie_01' }, Variant = 'runner', Speed = 1.15, Mood = 'mood_angry_1' },                                                               -- صارخ سريع
            drowned     = { Weight = 7,  Models = { 'a_m_m_trampbeac_01', 'a_m_o_beach_01' }, Variant = 'walker', Speed = 0.9, BloodSplats = { min = 0, max = 1 } },                                                  -- غريق
            burnt       = { Weight = 6,  Models = { 'u_m_y_burgerdrug_01', 'a_m_m_hillbilly_01' }, Wounds = { 'Burnt_Ped_0', 'Explosion_Med' }, WoundCount = { min = 2, max = 4 }, Ptfx = { Asset = 'core', Name = 'fire_wrecked_plane_cockpit', Bone = 24818, Scale = 0.5 } },  -- محروق متوهج
            shadow      = { Weight = 4,  Models = { 'a_m_m_farmer_01', 's_m_m_gardener_01' }, Variant = 'lurker', Alpha = 130, BloodSplats = { min = 0, max = 0 }, Mood = 'mood_angry_1' },                              -- ظل (شبه شفاف يتربص)
            infected    = { Weight = 10, Models = { 'a_m_m_hillbilly_02', 'a_m_m_tramp_01' }, Variant = 'walker', Wounds = { 'Skin_Melee_0' }, BloodSplats = { min = 4, max = 8 } },                                     -- مصاب
            long_face   = { Weight = 4,  Models = { 'a_m_o_beach_01', 'a_f_o_soucent_01' }, Variant = 'limper', Speed = 1.1, Mood = 'mood_stressed_1' },                                                        -- الوجه الطويل (عجوز نحيل)
            crawler     = { Weight = 7,  Models = { 'u_f_y_corpse_01', 'u_m_y_zombie_01' }, Variant = 'crawler', Speed = 1.2, BloodSplats = { min = 3, max = 6 } },                                                    -- زاحف على الأرض
            possessed   = { Weight = 6,  Models = { 'a_f_y_hippie_01', 'a_m_y_methhead_01' }, Variant = 'faller', Speed = 1.1, Mood = 'mood_angry_1' },                                                          -- ممسوس يتخبط
            toxic       = { Weight = 5,  Models = { 's_m_y_garbage', 'a_m_m_skidrow_01' }, Speed = 1.0, Ptfx = { Asset = 'core', Name = 'ent_amb_smoke_factory_white', Bone = 24818, Scale = 0.4 } },               -- سام (دخان أخضر/رمادي)
            faceless    = { Weight = 4,  Models = { 'u_m_y_zombie_01', 'a_m_m_farmer_01' }, Variant = 'lurker', Alpha = 245, BloodSplats = { min = 0, max = 1 }, Wounds = { 'Skin_Melee_0' } },                         -- بلا ملامح
            bloated     = { Weight = 6,  Models = { 'a_m_m_trampbeac_01', 'a_m_m_hillbilly_01' }, Variant = 'walker', Speed = 0.8, Wounds = { 'BigHitByVehicle' }, BloodSplats = { min = 1, max = 3 } },              -- منتفخ بطيء
            hound       = { Weight = 4,  Models = { 'a_c_rottweiler', 'a_c_shepherd' }, Variant = 'runner', Speed = 1.0, BloodSplats = { min = 1, max = 3 } },                                                       -- كلب مصاب سريع
        },
        Wounds = { 'BigHitByVehicle', 'Explosion_Med', 'Skin_Melee_0', 'Splashback_Torso_0', 'Burnt_Ped_0' },   -- جروح بصرية (للأشكال بدون Wounds خاصة)
        WoundCount = { min = 1, max = 3 },
        BloodSplats = { min = 2, max = 5 },   -- بقع دم على الوجه والجسم
        SickFace = true,              -- تعابير وجه مريضة/غاضبة
        RandomLook = true,            -- مظهر ولبس عشوائي لكل زومبي
    },

    -- المطلقون (للـ gunfight والمشاهد): كل واحد ببيد وسلاح ومعدل إطلاق (ms بين الطلقة والتي بعدها)
    Shooters = {
        { Model = 'g_m_y_mexgoon_01',  Weapon = 'WEAPON_PISTOL',        Rate = 420, Burst = { min = 1, max = 3 } },
        { Model = 'g_m_y_lost_01',     Weapon = 'WEAPON_MICROSMG',      Rate = 95,  Burst = { min = 4, max = 9 } },
        { Model = 's_m_y_swat_01',     Weapon = 'WEAPON_CARBINERIFLE',  Rate = 110, Burst = { min = 3, max = 8 } },
        { Model = 'g_m_m_chigoon_01',  Weapon = 'WEAPON_PUMPSHOTGUN',   Rate = 900, Burst = { min = 1, max = 2 } },
        { Model = 's_m_y_cop_01',      Weapon = 'WEAPON_COMBATPISTOL',  Rate = 380, Burst = { min = 1, max = 4 } },
        { Model = 'g_m_y_ballasout_01', Weapon = 'WEAPON_SMG',          Rate = 100, Burst = { min = 3, max = 7 } },
        { Model = 'g_m_y_famca_01',    Weapon = 'WEAPON_ASSAULTRIFLE',  Rate = 115, Burst = { min = 3, max = 8 } },
        { Model = 'a_m_y_stbla_01',    Weapon = 'WEAPON_PISTOL50',      Rate = 520, Burst = { min = 1, max = 3 } },
    },

    Gunfire = {
        Sound = 'both',        -- 'game' = صوت اللعبة الأصلي للرصاصة | 'sample' = صوت السكربت المصنوع | 'both' = الاثنان
        MinMiss = 1.2,         -- أقل مسافة (متر) بين مسار أي رصاصة وجسمك | 1.0-6.0 (لا يمكن أقل من 1.0 حفاظاً على الأمان)
        MuzzleFlash = true,    -- وميض فوهة السلاح (جزيئات اللعبة)
        Casings = false,       -- مقذوفات فارغة (إن توفر)
    },

    -- الحشرات الحقيقية: ملاحظة: لا توجد حشرات كموديلات في اللعبة الأصلية، لذلك تُستخدم هذه الطبقات
    Insects = {
        -- جزيئات (Asset = ملف الجزيئات، Name = اسم التأثير). يُجرَّب بالترتيب ويُستخدم أول ما يعمل.
        Particles = {
            { Asset = 'core', Name = 'ent_amb_insect_swarm' },
            { Asset = 'core', Name = 'ent_amb_fly_swarm' },
        },
        -- مخلوقات حقيقية تتحرك حولك (موديلات اللعبة)
        Creatures = { 'a_c_rat', 'a_c_crow', 'a_c_pigeon' },
        CreatureCount = { min = 3, max = 8 },
        -- مجسمات حشرات من سيرفرك (قم بتشغيل موارد تحتوي موديلات مثل ذباب/صرصور/عنكبوت وضع أسماءها هنا)
        PropModels = {},
        PropCount = { min = 6, max = 16 },
        Bones = { 31086, 24818, 57005, 18905, 14201, 52301 },   -- أماكن الزحف: رأس، صدر، يد، قدم...
        SwatAnim = { dict = 'gestures@m@standing@casual', name = 'gesture_no_way', flag = 49 },
    },
}

-- ======================================================================
-- 6) TEXTS / نصوص الهلوسات (أضف ما تشاء بالعربية والإنجليزية)
-- ======================================================================
Config.Texts = {
    Whispers = {
        ar = { 'إنهم يراقبونك', 'لا تلتفت', 'خلفك', 'هم هنا', 'اهرب', 'أنت لست وحدك', 'اسمعهم؟', 'لا أحد سيصدقك', 'قريباً', 'ما زلت هنا' },
        en = { 'they are watching', 'do not turn around', 'behind you', 'they are here', 'run', 'you are not alone', 'can you hear them?', 'no one will believe you', 'soon', 'still here' },
    },
    LastWords = {   -- كلمات أخيرة في إحساس الموت
        ar = { 'أمي...', 'لا أريد أن أموت', 'الجو بارد...', 'لم أودّع أحداً', 'أين الجميع؟', 'أرجوكم...' },
        en = { 'mom...', 'I do not want to die', 'it is so cold...', 'I never said goodbye', 'where is everyone?', 'please...' },
    },
    FakeNotify = {
        ar = { 'رقم مجهول: أراك', 'رسالة جديدة: لا تثق بأحد', 'مكالمة فائتة: (بدون رقم)', 'تنبيه: يوجد شخص خلفك', 'رسالة: اخرج الآن' },
        en = { 'Unknown number: I see you', 'New message: trust no one', 'Missed call: (no number)', 'Alert: someone is behind you', 'Message: get out now' },
    },
}

-- ======================================================================
-- 7) DIALOGUES / الحوارات (للشخص الوهمي friend عندما لا يوجد متحكم حي)
-- ======================================================================
-- كل Node: Text (نص الشخصية) | Choices = { { Text = , Next = 'اسم_node' } ... } حتى 4 اختيارات | Next = انتقال تلقائي | End = true ينهي الحديث
-- Delay = ثواني بقاء النص قبل الانتقال التلقائي. نصوص بالعربية والإنجليزية { ar = , en = }.
Config.Dialogues = {
    imaginary_friend = {
        Speaker = { ar = 'صديقي', en = 'My friend' },
        Start = 'hello',
        Nodes = {
            hello = {
                Text = { ar = 'مرحباً... أخيراً أراك. كيف حالك؟', en = 'Hey... finally. How are you holding up?' },
                Choices = {
                    { Text = { ar = 'بخير', en = 'I am fine' }, Next = 'fine' },
                    { Text = { ar = 'لست بخير', en = 'Not good' }, Next = 'notfine' },
                    { Text = { ar = 'من أنت؟', en = 'Who are you?' }, Next = 'who' },
                },
            },
            fine = {
                Text = { ar = 'جيد. فقط ابقَ قريباً مني، لا تلتفت كثيراً.', en = 'Good. Just stay close to me, do not look around too much.' },
                Next = 'end', Delay = 5,
            },
            notfine = {
                Text = { ar = 'أعرف. هم يتكلمون عنك دائماً... لكن أنا معك.', en = 'I know. They keep talking about you... but I am with you.' },
                Choices = {
                    { Text = { ar = 'من هم؟', en = 'Who are they?' }, Next = 'they' },
                    { Text = { ar = 'اتركني', en = 'Leave me alone' }, Next = 'leave' },
                },
            },
            who = {
                Text = { ar = 'كيف نسيتني؟ أنا الذي لم يتركك أبداً.', en = 'How could you forget me? I am the one who never left.' },
                Next = 'hello', Delay = 5,
            },
            they = {
                Text = { ar = 'الذين خلف الجدران. لا تفكر بهم الآن.', en = 'The ones behind the walls. Do not think about them now.' },
                Next = 'end', Delay = 5,
            },
            leave = {
                Text = { ar = 'حسناً... سأبقى بعيداً قليلاً.', en = 'Fine... I will stay a little further away.' },
                End = true, Delay = 4,
            },
            ['end'] = {
                Text = { ar = 'سنتكلم لاحقاً.', en = 'We will talk later.' },
                End = true, Delay = 3,
            },
        },
    },

    lost_loved_one = {
        Speaker = { ar = 'هو/هي', en = 'Them' },
        Start = 'a',
        Nodes = {
            a = {
                Text = { ar = 'لماذا لم تأتِ؟ كنت أنتظرك.', en = 'Why did you not come? I was waiting for you.' },
                Choices = {
                    { Text = { ar = 'آسف... لم أستطع', en = 'I am sorry... I could not' }, Next = 'b' },
                    { Text = { ar = 'أنت لست حقيقياً', en = 'You are not real' }, Next = 'c' },
                },
            },
            b = { Text = { ar = 'لا بأس. أنا هنا الآن.', en = 'It is alright. I am here now.' }, End = true, Delay = 5 },
            c = { Text = { ar = 'ربما... لكنك تراني، أليس كذلك؟', en = 'Maybe... but you can see me, can you not?' }, End = true, Delay = 5 },
        },
    },
}

-- ======================================================================
-- 7b) SCENES / مشاهد من الماضي والحاضر (تعدّلها وتضيف مشاهدك كما تشاء)
-- ======================================================================
-- الهلوسة النوع `scene` تعرض مشهداً بممثلين ببيدات حقيقية يراهم الهدف فقط. التشغيل: /halluc <id> scene 60 0.7 (الاسم من اللوحة) أو Scenarios Params = { scene = 'الاسم' }.
--
-- Mode  : 'past'    = ذكرى (ألوان باهتة، حبيبات، الوقت يتغير)  |  'present' = واقع يراه الآن (ألوان طبيعية)
-- Look  : Timecycle / Strength / Tint (لون وهمي بالشاشة) / Grain / Clock = { h, m } / Weather = 'FOGGY' ...
-- Actors: { Model = 'اسم موديل' | 'self' (يشبهك) | 'subject' (يشبه لاعب محدد),
--           At = { fwd = أمام, right = يمين, up = ارتفاع } بالنسبة لموضعك وقت بداية المشهد (متر),
--           Heading = 'face' (ينظر إليك) | رقم, Scenario / Anim = { dict, name, flag },
--           Weapon = 'WEAPON_*' (شكل فقط، بلا ذخيرة), Alpha = 0-255,
--           Lines = { { t = ثانية, text = { ar = '', en = '' } } },
--           Timeline = { { t = ثانية, Do = 'walk'|'face'|'anim'|'scenario'|'aim'|'shoot'|'fall'|'rise'|'vanish', ... } } }
-- Events: أحداث عامة: { t = ثانية, Do = 'flash'|'shake'|'sound'|'cue'|'blood', ... }
-- كل ما يخص الرصاص آمن: يخطئ دائماً وبدون ضرر.
Config.Scenes = {
    memory_family_table = {
        Label = { ar = 'ذكرى: مائدة العائلة', en = 'Memory: family table' },
        Mode = 'past', Duration = 36,
        Look = { Timecycle = 'NG_filmic05', Strength = 0.7, Tint = '#B8873A', TintStrength = 0.28, Grain = true, Clock = { h = 18, m = 30 }, Weather = 'EXTRASUNNY', Sound = 'music_box', SoundVolume = 0.35 },
        Actors = {
            { Id = 'mother', Name = { ar = 'أمي', en = 'Mother' }, Model = 'a_f_o_soucent_01', At = { fwd = 3.2, right = -1.1 }, Heading = 'face',
              Scenario = 'WORLD_HUMAN_HANG_OUT_STREET',
              Lines = { { t = 2, text = { ar = 'تأخرت يا بني... العشاء بردَ', en = 'You are late, my dear... dinner got cold' } },
                        { t = 9, text = { ar = 'كنتُ أنتظرك طوال اليوم', en = 'I waited for you all day' } },
                        { t = 18, text = { ar = 'تعال اجلس معنا', en = 'Come sit with us' } } },
              Timeline = { { t = 22, Do = 'walk', to = { fwd = 1.6, right = -0.6 }, speed = 0.8 }, { t = 31, Do = 'vanish' } } },
            { Id = 'father', Name = { ar = 'أبي', en = 'Father' }, Model = 'a_m_o_soucent_01', At = { fwd = 3.4, right = 1.3 }, Heading = 'face',
              Scenario = 'WORLD_HUMAN_STAND_IMPATIENT',
              Lines = { { t = 5, text = { ar = 'اتركوه، المهم أنه جاء', en = 'Leave him, what matters is he came' } } },
              Timeline = { { t = 31, Do = 'vanish' } } },
        },
    },
    memory_old_friend_goodbye = {
        Label = { ar = 'ذكرى: وداع صديق قديم', en = 'Memory: old friend goodbye' },
        Mode = 'past', Duration = 28,
        Look = { Timecycle = 'NG_filmic02', Strength = 0.6, Tint = '#7A8FA6', TintStrength = 0.22, Grain = true, Clock = { h = 6, m = 10 }, Weather = 'FOGGY' },
        Actors = {
            { Id = 'friend', Name = { ar = 'صديقي القديم', en = 'Old friend' }, Model = 'a_m_y_vinewood_01', At = { fwd = 5.0, right = 0.0 }, Heading = 'face',
              Anim = { dict = 'friends@frj@ig_1', name = 'wave_a', flag = 49 },
              Lines = { { t = 3, text = { ar = 'سأراك قريباً... أعدك', en = 'See you soon... I promise' } },
                        { t = 12, text = { ar = 'لا تنسني', en = 'Do not forget me' } } },
              Timeline = { { t = 15, Do = 'walk', to = { fwd = 14.0, right = 2.0 }, speed = 1.0 }, { t = 24, Do = 'vanish' } } },
        },
    },
    memory_shooting_night = {
        Label = { ar = 'ذكرى: ليلة إطلاق النار', en = 'Memory: the shooting night' },
        Mode = 'past', Duration = 34,
        Look = { Timecycle = 'NG_filmic02', Strength = 0.65, Tint = '#6A1B1B', TintStrength = 0.25, Grain = true, Clock = { h = 2, m = 15 }, Weather = 'CLEAR' },
        Actors = {
            { Id = 'victim', Name = { ar = 'هو', en = 'Him' }, Model = 'a_m_y_business_02', At = { fwd = 7.0, right = -1.0 }, Heading = 'face', Scenario = 'WORLD_HUMAN_STAND_MOBILE',
              Timeline = { { t = 14, Do = 'fall' }, { t = 26, Do = 'vanish' } } },
            { Id = 'shooter1', Model = 'g_m_y_mexgoon_01', At = { fwd = 14.0, right = 4.0 }, Heading = 'face', Weapon = 'WEAPON_PISTOL',
              Timeline = { { t = 8, Do = 'aim', at = 'victim' }, { t = 12, Do = 'shoot', at = 'victim', shots = 3, gap = 380 }, { t = 22, Do = 'vanish' } } },
            { Id = 'shooter2', Model = 'g_m_y_lost_01', At = { fwd = 13.0, right = -5.0 }, Heading = 'face', Weapon = 'WEAPON_MICROSMG',
              Timeline = { { t = 9, Do = 'aim', at = 'victim' }, { t = 13, Do = 'shoot', at = 'victim', shots = 6, gap = 110 }, { t = 22, Do = 'vanish' } } },
        },
        Events = { { t = 12, Do = 'shake', amount = 0.35 }, { t = 14, Do = 'flash', color = '#FFFFFF' }, { t = 16, Do = 'cue', name = 'heartbeat_rush', seconds = 8 } },
    },
    present_ambush = {
        Label = { ar = 'الحاضر: كمين مسلح', en = 'Present: armed ambush' },
        Mode = 'present', Duration = 30,
        Actors = {
            { Id = 'a', Name = { ar = 'مجهول', en = 'Unknown' }, Model = 'g_m_y_mexgoon_01', At = { fwd = 15.0, right = -6.0 }, Heading = 'face', Weapon = 'WEAPON_PISTOL',
              Timeline = { { t = 2, Do = 'aim', at = 'me' }, { t = 5, Do = 'shoot', at = 'me', shots = 4, gap = 420 }, { t = 22, Do = 'vanish' } } },
            { Id = 'b', Model = 'g_m_y_lost_01', At = { fwd = 17.0, right = 7.0 }, Heading = 'face', Weapon = 'WEAPON_MICROSMG',
              Timeline = { { t = 3, Do = 'aim', at = 'me' }, { t = 6, Do = 'shoot', at = 'me', shots = 8, gap = 100 }, { t = 22, Do = 'vanish' } } },
            { Id = 'c', Model = 's_m_y_swat_01', At = { fwd = 20.0, right = 0.0 }, Heading = 'face', Weapon = 'WEAPON_CARBINERIFLE',
              Timeline = { { t = 4, Do = 'aim', at = 'me' }, { t = 8, Do = 'shoot', at = 'me', shots = 7, gap = 110 }, { t = 22, Do = 'vanish' } } },
        },
        Events = { { t = 5, Do = 'shake', amount = 0.4 }, { t = 6, Do = 'cue', name = 'heartbeat_rush', seconds = 10 } },
    },
    present_hospital_staff = {
        Label = { ar = 'الحاضر: طاقم المستشفى حولك', en = 'Present: hospital staff around you' },
        Mode = 'present', Duration = 32,
        Look = { Timecycle = 'hud_def_blur', Strength = 0.6 },
        Actors = {
            { Id = 'doc', Name = { ar = 'الطبيب', en = 'Doctor' }, Model = 's_m_m_doctor_01', At = { fwd = 2.2, right = 0.7 }, Heading = 'face', Scenario = 'WORLD_HUMAN_CLIPBOARD',
              Lines = { { t = 2, text = { ar = 'اهدأ... أنت في مكان آمن', en = 'Calm down... you are safe here' } },
                        { t = 9, text = { ar = 'هل تسمعني؟ ما اسمك؟', en = 'Can you hear me? What is your name?' } },
                        { t = 19, text = { ar = 'أعطوه المهدئ', en = 'Give him the sedative' } } },
              Timeline = { { t = 28, Do = 'vanish' } } },
            { Id = 'nurse', Name = { ar = 'الممرضة', en = 'Nurse' }, Model = 's_f_y_scrubs_01', At = { fwd = 2.0, right = -1.0 }, Heading = 'face', Scenario = 'WORLD_HUMAN_STAND_IMPATIENT',
              Lines = { { t = 14, text = { ar = 'ضغطه ينخفض يا دكتور', en = 'His pressure is dropping, doctor' } } },
              Timeline = { { t = 28, Do = 'vanish' } } },
        },
    },
    present_dead_relative = {
        Label = { ar = 'الحاضر: قريب متوفى يقف أمامك', en = 'Present: a deceased relative stands before you' },
        Mode = 'present', Duration = 30,
        Look = { Timecycle = 'NG_filmic02', Strength = 0.4 },
        Actors = {
            { Id = 'rel', Name = { ar = 'هو', en = 'Him' }, Model = 'a_m_m_business_01', At = { fwd = 4.5, right = 0.0 }, Heading = 'face', Alpha = 150, Scenario = 'WORLD_HUMAN_STAND_IMPATIENT',
              Lines = { { t = 3, text = { ar = 'لا تحزن... أنا بخير', en = 'Do not grieve... I am fine' } },
                        { t = 11, text = { ar = 'اعتنِ بنفسك', en = 'Take care of yourself' } } },
              Timeline = { { t = 18, Do = 'walk', to = { fwd = 12.0, right = 1.0 }, speed = 0.7 }, { t = 25, Do = 'vanish' } } },
        },
        Events = { { t = 2, Do = 'cue', name = 'whispers', seconds = 6 } },
    },
}

-- ======================================================================
-- 8) SCENARIOS / سيناريوهات رول بلاي جاهزة (سلسلة هلوسات بتوقيت)
-- ======================================================================
-- Steps: At = متى تبدأ (ثانية من بداية السيناريو) | Type = نوع من Config.Types | Duration = مدة الخطوة
--        Intensity = شدة | Chance = احتمال التنفيذ 0-1 (اختياري) | Repeat = { Every = ثانية, Times = عدد } (اختياري)
--        Params = إعدادات إضافية للنوع (مثل Dialogue / Source) (اختياري)
-- يُشغَّل بـ /hscenario <id> <name> أو exports.universal_hallucination:RunScenario(src, 'name')
Config.Scenarios = {
    zombie_outbreak = {
        Label = { ar = 'تفشي الزومبي', en = 'Zombie outbreak' }, Duration = 170,
        Steps = {
            { At = 0,  Type = 'distant_gunshots', Duration = 60,  Intensity = 0.6 },
            { At = 4,  Type = 'zombie_horde',     Duration = 110, Intensity = 0.7 },
            { At = 30, Type = 'insects',          Duration = 50,  Intensity = 0.4, Chance = 0.6 },
            { At = 60, Type = 'self_zombie',      Duration = 90,  Intensity = 0.7 },
            { At = 120, Type = 'collapse',        Duration = 40,  Intensity = 0.6 },
        },
    },
    near_death = {
        Label = { ar = 'اشتباك وإحساس موت', en = 'Firefight and near-death' }, Duration = 90,
        Steps = {
            { At = 0,  Type = 'gunfight',      Duration = 40, Intensity = 0.8, Params = { mode = 'ambush' } },
            { At = 30, Type = 'death_feeling', Duration = 45, Intensity = 0.9 },
        },
    },
    memory_lane = {
        Label = { ar = 'شريط الذكريات', en = 'Memory lane' }, Duration = 110,
        Steps = {
            { At = 0,  Type = 'scene', Duration = 38, Intensity = 0.7, Params = { scene = 'memory_family_table' } },
            { At = 42, Type = 'scene', Duration = 30, Intensity = 0.7, Params = { scene = 'memory_old_friend_goodbye' } },
            { At = 76, Type = 'scene', Duration = 36, Intensity = 0.7, Params = { scene = 'memory_shooting_night' } },
        },
    },
    insect_nightmare = {
        Label = { ar = 'كابوس الحشرات', en = 'Insect nightmare' }, Duration = 100,
        Steps = {
            { At = 0,  Type = 'insects',        Duration = 95, Intensity = 0.7 },
            { At = 8,  Type = 'whispers_audio', Duration = 60, Intensity = 0.4 },
            { At = 40, Type = 'dizzy',          Duration = 50, Intensity = 0.4 },
        },
    },
    drug_trip = {
        Label = { ar = 'رحلة مخدرات', en = 'Drug trip' }, Duration = 150,
        Steps = {
            { At = 0,  Type = 'distortion', Duration = 150, Intensity = 0.5 },
            { At = 3,  Type = 'acid_trip',  Duration = 140, Intensity = 0.6 },
            { At = 10, Type = 'whispers_audio', Duration = 120, Intensity = 0.4 },
            { At = 20, Type = 'bugs',       Duration = 60,  Intensity = 0.4 },
            { At = 40, Type = 'dizzy',      Duration = 90,  Intensity = 0.5 },
            { At = 60, Type = 'double',     Duration = 40,  Intensity = 0.5, Chance = 0.7 },
        },
    },
    psychosis = {
        Label = { ar = 'ذهان', en = 'Psychosis' }, Duration = 240,
        Steps = {
            { At = 0,   Type = 'whispers_audio', Duration = 240, Intensity = 0.7 },
            { At = 0,   Type = 'words',          Duration = 240, Intensity = 0.6 },
            { At = 5,   Type = 'friend',         Duration = 230, Intensity = 0.6, Params = { Dialogue = 'imaginary_friend' } },
            { At = 30,  Type = 'shadow',         Duration = 180, Intensity = 0.6 },
            { At = 60,  Type = 'crowd',          Duration = 90,  Intensity = 0.5 },
            { At = 90,  Type = 'flicker',        Duration = 120, Intensity = 0.5 },
            { At = 120, Type = 'tunnel_vision',  Duration = 80,  Intensity = 0.6 },
        },
    },
    paranoia = {
        Label = { ar = 'بارانويا', en = 'Paranoia' }, Duration = 180,
        Steps = {
            { At = 0,  Type = 'footsteps_behind', Duration = 180, Intensity = 0.6 },
            { At = 0,  Type = 'heartbeat',        Duration = 180, Intensity = 0.5 },
            { At = 10, Type = 'stalker',          Duration = 150, Intensity = 0.6 },
            { At = 30, Type = 'fake_notify',      Duration = 140, Intensity = 0.5 },
            { At = 50, Type = 'knocking',         Duration = 100, Intensity = 0.5 },
            { At = 80, Type = 'crowd',            Duration = 80,  Intensity = 0.4 },
        },
    },
    ptsd_flashback = {
        Label = { ar = 'ذكريات صدمة (PTSD)', en = 'PTSD flashback' }, Duration = 90,
        Steps = {
            { At = 0,  Type = 'tinnitus',         Duration = 40, Intensity = 0.7 },
            { At = 0,  Type = 'tunnel_vision',    Duration = 90, Intensity = 0.8 },
            { At = 2,  Type = 'distant_gunshots', Duration = 70, Intensity = 0.7 },
            { At = 5,  Type = 'heartbeat',        Duration = 85, Intensity = 0.8 },
            { At = 8,  Type = 'weapon_tremor',    Duration = 80, Intensity = 0.8 },
            { At = 14, Type = 'gunman',           Duration = 50, Intensity = 0.7 },
            { At = 20, Type = 'flicker',          Duration = 60, Intensity = 0.7 },
            { At = 30, Type = 'blood',            Duration = 40, Intensity = 0.5 },
        },
    },
    haunted = {
        Label = { ar = 'مكان مسكون', en = 'Haunted' }, Duration = 200,
        Steps = {
            { At = 0,  Type = 'drone',            Duration = 200, Intensity = 0.6 },
            { At = 0,  Type = 'ghost',            Duration = 190, Intensity = 0.6 },
            { At = 10, Type = 'footsteps_behind', Duration = 150, Intensity = 0.5 },
            { At = 20, Type = 'knocking',         Duration = 150, Intensity = 0.6 },
            { At = 30, Type = 'music_box',        Duration = 120, Intensity = 0.5 },
            { At = 45, Type = 'whispers_audio',   Duration = 140, Intensity = 0.5 },
            { At = 60, Type = 'flicker',          Duration = 120, Intensity = 0.5 },
        },
    },
    zombie_delusion = {
        Label = { ar = 'وهم الزومبي', en = 'Zombie delusion' }, Duration = 120,
        Steps = {
            { At = 0,  Type = 'heartbeat',    Duration = 120, Intensity = 0.7 },
            { At = 0,  Type = 'tint',         Duration = 120, Intensity = 0.4, Params = { Color = '#5A0000' } },
            { At = 3,  Type = 'zombie_horde', Duration = 110, Intensity = 0.7 },
            { At = 10, Type = 'breathing',    Duration = 100, Intensity = 0.6 },
            { At = 25, Type = 'blood',        Duration = 60,  Intensity = 0.4 },
        },
    },
    grief = {
        Label = { ar = 'حزن وفقد', en = 'Grief' }, Duration = 300,
        Steps = {
            { At = 0, Type = 'friend', Duration = 290, Intensity = 0.5, Params = { Dialogue = 'lost_loved_one' } },
            { At = 5, Type = 'music_box', Duration = 200, Intensity = 0.4 },
            { At = 30, Type = 'whispers_audio', Duration = 200, Intensity = 0.3 },
        },
    },
    fever_dream = {
        Label = { ar = 'حمّى وهذيان', en = 'Fever dream' }, Duration = 150,
        Steps = {
            { At = 0,  Type = 'double_vision', Duration = 150, Intensity = 0.6 },
            { At = 0,  Type = 'tint',          Duration = 150, Intensity = 0.4, Params = { Color = '#FF6A00' } },
            { At = 5,  Type = 'camera_sway',   Duration = 140, Intensity = 0.5 },
            { At = 15, Type = 'double',        Duration = 100, Intensity = 0.5 },
            { At = 30, Type = 'time_slow',     Duration = 60,  Intensity = 0.5 },
            { At = 45, Type = 'bugs',          Duration = 80,  Intensity = 0.4 },
        },
    },
    withdrawal = {
        Label = { ar = 'انسحاب مخدرات', en = 'Withdrawal' }, Duration = 180,
        Steps = {
            { At = 0,  Type = 'hand_tremor', Duration = 180, Intensity = 0.7 },
            { At = 0,  Type = 'bugs',        Duration = 180, Intensity = 0.7 },
            { At = 10, Type = 'dizzy',       Duration = 150, Intensity = 0.5 },
            { At = 20, Type = 'whispers_audio', Duration = 120, Intensity = 0.4 },
            { At = 40, Type = 'weapon_tremor', Duration = 120, Intensity = 0.7 },
        },
    },
    stalked = {
        Label = { ar = 'مُطارَد', en = 'Stalked' }, Duration = 150,
        Steps = {
            { At = 0,  Type = 'stalker',          Duration = 150, Intensity = 0.7 },
            { At = 0,  Type = 'footsteps_behind', Duration = 150, Intensity = 0.7 },
            { At = 15, Type = 'heartbeat',        Duration = 120, Intensity = 0.6 },
            { At = 30, Type = 'fake_notify',      Duration = 100, Intensity = 0.5 },
        },
    },
    alcohol_blackout = {
        Label = { ar = 'سُكر شديد', en = 'Blackout drunk' }, Duration = 120,
        Steps = {
            { At = 0,  Type = 'dizzy',         Duration = 120, Intensity = 0.8 },
            { At = 0,  Type = 'double_vision', Duration = 120, Intensity = 0.7 },
            { At = 10, Type = 'camera_sway',   Duration = 100, Intensity = 0.6 },
            { At = 30, Type = 'flicker',       Duration = 80,  Intensity = 0.5 },
        },
    },
    sleep_deprivation = {
        Label = { ar = 'قلة نوم', en = 'Sleep deprivation' }, Duration = 180,
        Steps = {
            { At = 0,  Type = 'flicker',       Duration = 180, Intensity = 0.4 },
            { At = 0,  Type = 'tunnel_vision', Duration = 180, Intensity = 0.4 },
            { At = 15, Type = 'shadow',        Duration = 150, Intensity = 0.4 },
            { At = 30, Type = 'whispers_audio', Duration = 140, Intensity = 0.3 },
            { At = 60, Type = 'time_slow',     Duration = 60,  Intensity = 0.4 },
        },
    },
    imaginary_friend = {
        Label = { ar = 'صديق وهمي', en = 'Imaginary friend' }, Duration = 600,
        Steps = {
            { At = 0, Type = 'friend', Duration = 600, Intensity = 0.5, Params = { Dialogue = 'imaginary_friend' } },
        },
    },
}

-- ======================================================================
-- 9) DIRECTOR / التحكم الحي بالشخص الوهمي (رول بلاي: طبيب نفسي، حدث، ظاهرة...)
-- ======================================================================
-- /hdirect <id> يربطك بشخص وهمي: كل ما تكتبه بـ /hsay يظهر كحديث الشخصية للهدف، والهدف يرد بـ /hr.
Config.Director = {
    Enabled       = true,    -- true/false | true
    LineSeconds   = 6.0,     -- مدة بقاء السطر على الشاشة | 2-30 | 6.0
    MaxLineLength = 160,     -- أقصى طول لما تكتبه | 20-400 | 160
    ReplyMaxLength = 120,    -- أقصى طول لرد الهدف | 10-300 | 120
    MustStayOnline = true,   -- تنتهي الهلوسة إذا خرج المتحكم | true/false | true
    MaxDistance   = 0,       -- 0 = بدون قيد، أو أقصى بعد (متر) بين المتحكم والهدف لاستمرار الحديث | 0-5000 | 0
}

-- ======================================================================
-- 9b) VOICE / الصوت الحقيقي من مايك لمايك
-- ======================================================================
-- عند تفعيله يسمع الهدف صوتك الحقيقي من المايك (ويسمعك أنت صوته حسب الإعداد) وأنت تتحدث كالشخص الوهمي.
-- يحتاج نظام صوت. يتم الربط عبر قناة مكالمة خاصة (يعمل على pma-voice و mumble-voip) أو عبر دوال custom.
Config.Voice = {
    Enabled   = false,            -- true/false | false (فعّله بعد التأكد من اسم نظام الصوت عندك)
    Provider  = 'pma-voice',      -- 'pma-voice' | 'mumble-voip' | 'custom' (Custom.Voice.* في bridge/custom.lua)
    ChannelBase = 9000,           -- رقم قناة المكالمة الأساسي (يُجمع معه رقم الجلسة) | تجنب أرقام قنوات سيرفرك
    Use = {
        Director = true,          -- في /hdirect: المتحكم والهدف يتحدثان صوتياً
        Appear   = true,          -- في /happear: الإداري يظهر للاعب ويتحدثان صوتياً
        Possess  = 'speak_as',    -- في /hpossess: 'speak_as' = اللاعبون قرب الهدف يسمعونك أنت (كأنك هو) | 'call' = الهدف فقط | 'off'
    },
    SpeakAsRange = 12.0,          -- مدى سماع الآخرين لك وأنت تتحدث بصوت الهدف (متر)
    MuteTargetWhenPossessed = true, -- يكتم مايك الهدف أثناء السيطرة (يكمل Config.Possess.MuteTarget)
}

-- ======================================================================
-- 9.8) TAKEOVER / السيطرة بالتبديل (مثل الفيديو)
-- ======================================================================
-- المراحل: /htake <id> تظهر للاعب وحده وتتحدث معه وتهدده  ->  /hseize مبارزة ميني جيم
--   * إن فاز اللاعب: تُطرد (تختفي) قبل أن تسيطر.
--   * إن خسر: تدخل شخصيته (تتحرك وتتكلم بها والكل يراك ويسمعك كأنك هو) ويُنقل هو لمكانك القديم بشخصيتك:
--     لا أحد يراه ولا يسمعه إلا أنت، يرى ويسمع الجميع، ولا يستطيع التحرك.
--   * عند /hrelease أو انتهاء المدة: كل واحد يرجع لشخصيته (والمتحكم لمكانه القديم، واللاعب لمكان جسده).
Config.Takeover = {
    Enabled      = true,     -- true/false | true
    MaxDistance  = 30.0,     -- أقصى مسافة بينك وبين اللاعب لبدء المرحلة 1 (متر) | 3-200 | 30
    TalkSeconds  = 300,      -- أقصى مدة للمرحلة 1 (الحديث) | 10-1800 | 300
    MaxSeconds   = 300,      -- أقصى مدة للتبديل نفسه | 10-3600 | 300
    RequireLooks = true,     -- يشترط نظام ملابس لتبديل الملامح (بدونه لا يبدو التبديل حقيقياً) | true/false | true
    Contest = {
        Seconds   = 45,      -- مهلة المبارزة | 10-180 | 45
        WinsNeeded = 2,      -- كم جولة يجب أن يفوز بها اللاعب ليطردك | 1-6 | 2
        LossesToLose = 1,    -- كم جولة يخسرها اللاعب ليخسر المبارزة (أو تنتهي المهلة) | 1-6 | 1
        -- ضغطك على اللاعب = صعوبة المقاومة: 'easy' ضغط خفيف (يقاوم بسهولة) | 'normal' | 'hard' | 'nightmare' ضغط ساحق (يفشل غالباً).
        -- تختاره من تبويب "السيطرة" في اللوحة لكل عملية، وهذه القيمة الافتراضية. (مستويات الصعوبة نفسها في Config.Resist.Levels)
        -- Your pressure on the player = how hard the resist games are. Picked per takeover in the panel; this is the default.
        Pressure  = 'hard',
    },
    Ghost = {
        Freeze     = true,   -- المسيطَر عليه لا يتحرك (true) أو يستطيع المشي (false). تغيّره لكل عملية من اللوحة ("المراقب يتحرك") | true/false | true
        Invincible = true,   -- محميّ من الأذى أثناء التبديل (المراقب لا يُصاب) | true/false | true
        MaxRoam    = 25.0,   -- لو سمحت له بالحركة: أقصى بعد يبتعده عن مكانه (متر) ثم يُعاد | 3-200 | 25
    },
    -- قواعد المتحكم وهو داخل شخصية اللاعب: يتكلم ويتحرك فقط، لا يخرّب الرول بلاي.
    -- Rules for the controller while he plays the player's character: he can talk and move, nothing that could ruin the scene.
    Controller = {
        BlockInventory = true,  -- لا يفتح الحقيبة ولا يستخدم الأغراض (ox_inventory / qb / esx + Custom.Takeover في bridge/custom.lua) | true/false | true
        BlockWeapons   = true,  -- لا يُخرج سلاحاً: يُسحب السلاح من يده ويُقفل إطلاق النار وعجلة الأسلحة | true/false | true
        BlockMelee     = true,  -- لا يضرب بيده | true/false | true
        BlockKill      = true,  -- السيرفر يلغي أي ضرر يسببه (حماية مضاعفة حتى لو تجاوز أحد قفل الكلاينت) | true/false | true
        BlockVehicles  = true,  -- لا يركب مركبة (حتى لا يدهس أحداً) | true/false | true
        Notice         = true,  -- يُعلمه بالقيود عند بدء السيطرة | true/false | true
    },
    -- عند الإنهاء: 'body' = اللاعب يستيقظ في مكان جسده (حيث انتهى المتحكم)، المتحكم يعود لمكانه القديم
    --              'origin' = الاثنان يعودان بالضبط لمكانهما قبل التبديل
    -- أمر /hback أو زر "إرجاع الأماكن" يُرجع الاثنين لأماكنهما الأصلية دائماً ويُنهي التبديل.
    ReturnTo     = 'body',   -- 'body' | 'origin' | body
    Teleport     = true,     -- ينقل كل واحد لمكان الآخر (بدونه يبقى كل واحد مكانه) | true/false | true
}

-- ======================================================================
-- 9ب) WORLD / عالم موازٍ: نقل لاعب إلى مكان آخر وإحضار إداريين حقيقيين إليه ثم إرجاع الجميع
-- ======================================================================
-- كل شيء يُدار من تبويب "العالم" في اللوحة: اختر اللاعب ← اختر المكان ← اختر الإداريين ← إرسال. زر "إرجاع الكل" يعيد الجميع.
Config.World = {
    Enabled       = true,    -- true/false | true
    UseBucket     = true,    -- true = عالم منفصل تماماً (Routing Bucket): لا يراهم أحد من خارجه (يحتاج OneSync) | true/false | true
    BucketBase    = 7000,    -- أول رقم bucket يُستخدم (يُختار أول رقم فارغ بعده) | 100-60000 | 7000
    Fade          = true,    -- شاشة سوداء قبل وبعد النقل | true/false | true
    FadeMs        = 700,     -- مدة التعتيم | 100-3000 | 700
    MaxSeconds    = 1800,    -- أقصى مدة قبل الإرجاع التلقائي | 10-7200 | 1800
    StaffOnly     = true,    -- يُسمح بإحضار من لديه صلاحية Use فقط (الإداريون) | true/false | true
    MaxStaff      = 8,       -- أقصى عدد إداريين في العالم | 0-30 | 8
    RefuseInVehicle = true,  -- يرفض النقل والمستهدف داخل مركبة | true/false | true
    TargetFrozen  = true,    -- المستهدف لا يتحرك: ينظر فقط | true/false | true
    TargetInvincible = true, -- ومحميّ من أي أذى | true/false | true
}

-- أماكن جاهزة. يمكنك أيضاً حفظ مكانك الحالي من اللوحة (تبويب العالم ← "حفظ موقعي") فيُخزَّن في data/user_data.json
Config.Places = {
    { key = 'hospital_room', label = { ar = 'غرفة مستشفى', en = 'Hospital room' },  x = 349.5,  y = -586.0, z = 28.8,  h = 70.0 },
    { key = 'empty_lot',     label = { ar = 'أرض فارغة',   en = 'Empty lot' },       x = 1693.0, y = 3760.0, z = 34.7,  h = 0.0 },
    { key = 'cemetery',      label = { ar = 'المقبرة',      en = 'Cemetery' },        x = -1731.0, y = -194.0, z = 58.4, h = 0.0 },
}

-- ======================================================================
-- 9ج) ZONES / المناطق المسكونة
-- ======================================================================
-- تُنشأ من اللوحة (تبويب المناطق): وأنت واقف في المكان اضغط "إنشاء منطقة هنا". كل من يدخلها تبدأ له هلوسة تلقائياً.
Config.Zones = {
    Enabled    = true,    -- true/false | true
    CheckMs    = 3000,    -- كل كم مللي ثانية يفحص دخول اللاعبين | 1000-30000 | 3000
    MaxZones   = 40,      -- أقصى عدد مناطق محفوظة | 1-100 | 40
    Defaults = {          -- القيم الابتدائية في نموذج الإنشاء
        Radius = 25.0, Type = 'ghost', Intensity = 0.6, Duration = 60, Chance = 0.35, Cooldown = 180,
    },
}

-- ======================================================================
-- 9هـ) MAP / الخريطة داخل اللوحة
-- ======================================================================
-- تبويب «الخريطة» في اللوحة: يعرض اللاعبين والمناطق المسكونة والأماكن والهلوسات النشطة مباشرة،
-- وتضغط على أي نقطة لإنشاء منطقة مسكونة هناك. تحتاج OneSync (موجود).
--
-- لوضع خريطة GTA V الأصلية (أطلس أو ساتلايت):
--   1) ضع صورة الخريطة في المجلد  html/assets/map/  (مثال: atlas.jpg ، jpg/png/webp ، يفضّل مربعة 4096 أو 8192).
--      صورة الخريطة ملك Rockstar وليست مرفقة بالمورد: استخدم صورة يحق لك استخدامها.
--   2) اكتب مسارها في Image.   3) عدّل Bounds ليطابق الصورة (إحداثيات اللعبة لحواف الصورة).
--   معايرة سريعة: قف على نقطة معروفة في اللعبة وانظر أين تظهر نقطتك على الخريطة، ثم عدّل الحدود حتى تنطبق.
-- بدون صورة: يرسم المورد شبكة كيلومترات مع أسماء المناطق الرئيسية (بدون أي ملف).
Config.Map = {
    Enabled = true,
    Image   = '',                                   -- مثال: 'assets/map/atlas.jpg'  (فارغ = الشبكة)
    Bounds  = { MinX = -4000.0, MaxX = 4500.0, MinY = -4300.0, MaxY = 8000.0 },  -- حدود الصورة بإحداثيات اللعبة (معيارية للأطلس الشائع)
    Pois = {                                        -- أسماء تظهر على الشبكة (الاسم + الإحداثيات)
        { 'Los Santos', 200.0, -900.0 },        { 'Vinewood', 300.0, 200.0 },          { 'Airport', -1100.0, -2900.0 },
        { 'Vespucci', -1200.0, -1000.0 },       { 'Port', 1000.0, -3100.0 },           { 'Sandy Shores', 1850.0, 3700.0 },
        { 'Grapeseed', 1700.0, 4800.0 },        { 'Paleto Bay', -150.0, 6200.0 },      { 'Mt. Chiliad', 450.0, 5600.0 },
        { 'Fort Zancudo', -2350.0, 3100.0 },    { 'Chumash', -3100.0, 450.0 },         { 'Prison', 1700.0, 2600.0 },
        { 'Alamo Sea', 800.0, 4000.0 },         { 'Zancudo River', -1500.0, 4300.0 }, { 'Great Ocean Hwy', -2000.0, 1500.0 },
    },
}

-- ======================================================================
-- 9د) MIND / الحالة الذهنية
-- ======================================================================
-- عداد توتر لكل شخصية (0-100) يُحفظ. كلما ارتفع زادت احتمالية هلوسات تلقائية. تخفضه الأدوية والعلاج (من اللوحة أو بالـ exports).
Config.Mind = {
    Enabled      = true,    -- true/false | true
    Persist      = true,    -- يحفظ العداد في data/user_data.json بين الجلسات | true/false | true
    CheckSeconds = 30,      -- كل كم ثانية يُحدَّث العداد ويُفحص | 5-300 | 30
    Max          = 100,     -- أعلى قيمة | 10-1000 | 100
    Decay = { PerMinute = 1.0, OnlyWhenCalm = true },   -- النزول التدريجي كل دقيقة (OnlyWhenCalm = لا ينزل أثناء هلوسة نشطة)
    Gain = {                -- ما يرفع التوتر تلقائياً
        Death       = 15,   -- عند الموت
        Hallucination = 1,  -- عند بدء أي هلوسة عليه (نصف القيمة لهلوسات التوتر نفسه) | 0 = معطل
        LowHealth   = { Below = 0.3, PerCheck = 2 },    -- عندما تنزل صحته تحت هذه النسبة (0-1) يزيد كل فحص
    },
    -- المستويات: عندما يصل التوتر لـ at يُفحص احتمال chance كل فحص ثم تبدأ هلوسة عشوائية من types
    Levels = {
        { at = 30, chance = 0.04, intensity = { min = 0.2, max = 0.4 }, duration = { min = 15, max = 30 }, types = { 'heartbeat', 'whispers_audio', 'footsteps_behind', 'tinnitus' } },
        { at = 55, chance = 0.08, intensity = { min = 0.3, max = 0.6 }, duration = { min = 20, max = 50 }, types = { 'ghost', 'shadow', 'flicker', 'knocking', 'bugs', 'hand_tremor' } },
        { at = 80, chance = 0.14, intensity = { min = 0.5, max = 0.85 }, duration = { min = 30, max = 70 }, types = { 'stalker', 'insects', 'zombie_horde', 'death_feeling', 'distortion', 'blood' } },
    },
}

-- ======================================================================
-- 10) APPEARANCE / ربط نظام الملابس (يحدده المبرمج من هنا)
-- ======================================================================
-- أي نسخة "قرين" (double/friend/ghost/gunman بمصدر self/subject) تُنسخ بـ ClonePed (تنسخ الملامح واللبس تلقائياً)
-- ولا تحتاج أي نظام ملابس. النظام يُستخدم فقط في /hswap (تبديل الملامح فعلياً للاعبين) لقراءة وتطبيق اللبس.
-- Provider:
--   'auto'               = يبحث عن illenium-appearance ثم fivem-appearance
--   'illenium-appearance' | 'fivem-appearance'
--   'custom_exports'     = تحدد أسماء الـ exports أدناه (Custom)
--   'custom'             = تكتب Custom.Appearance.Get/Apply في bridge/custom.lua
--   'none'               = بدون (التبديل غير متاح)
Config.Appearance = {
    Provider = 'auto',
    -- لوضع custom_exports: اسم المورد واسم الدالتين. ترتيب الوسائط: 'ped,data' أو 'data,ped'
    Custom = {
        Resource    = '',               -- مثال 'my_clothing'
        GetExport   = '',               -- دالة تعيد جدول المظهر لـ ped | مثال 'getPedAppearance'
        ApplyExport = '',               -- دالة تطبّق مظهراً على ped | مثال 'setPedAppearance'
        ApplyArgs   = 'ped,data',       -- 'ped,data' | 'data,ped'
    },
    AllowModelChange = false,   -- السماح بتبديل بين موديلين مختلفين (ذكر/أنثى): يحتاج دعم من نظام الملابس | false
    ResponseTimeoutMs = 4000,   -- مهلة انتظار رد اللاعب عند قراءة مظهره | 1000-15000 | 4000
}

-- ======================================================================
-- 11) SWAP / تبديل الملامح والأغراض بين الشخصيات (حساس: معطل حيث يلزم)
-- ======================================================================
Config.Swap = {
    Enabled = true,

    Looks = {
        Enabled        = true,   -- /hswap يبدّل الملامح واللبس بين لاعبين (يحتاج Config.Appearance) | true/false | true
        MaxSeconds     = 900,    -- أقصى مدة للتبديل قبل الرجوع تلقائياً | 10-7200 | 900
        RestoreOnDeath = true,   -- يرجع للشكل الأصلي عند الموت | true/false | true
        PersistBackup  = true,   -- يحفظ الشكل الأصلي في data/swap_backup.json لاسترجاعه لو خرج اللاعب أثناء التبديل | true/false | true
    },

    -- الأغراض: لا ينتقل أي غرض ما لم تضفه إلى القائمة البيضاء. هذا يمنع ثغرات النسخ والنقل غير المقصود.
    Items = {
        Enabled   = false,       -- /hswap ينقل الأغراض أيضاً | true/false | false
        Provider  = 'auto',      -- 'auto' | 'ox_inventory' | 'qbcore' | 'esx' | 'custom' | 'none'
        Whitelist = {},          -- مثال { 'phone', 'id_card', 'lockpick', 'bread' }
        MaxStacks = 12,          -- أقصى عدد أنواع تنقل دفعة واحدة | 1-100 | 12
        MaxPerItem = 50,         -- أقصى كمية لكل غرض | 1-1000 | 50
        Revert    = true,        -- إرجاع الأغراض عند انتهاء التبديل (/hrestore أو انتهاء الوقت) | true/false | true
    },

    -- "حقيبة النقل": عند تبديل شخصية اللاعب (multichar) تنتقل الأغراض المسموحة معه للشخصية الجديدة.
    -- LeaveEvents / JoinEvents = أسماء أحداث السيرفر في سكربت اختيار الشخصيات عندك (تُمرَّر فيها رقم اللاعب كأول وسيط).
    -- إن لم تضبطها استخدم exports.universal_hallucination:StashItems(src) و DeliverItems(src) يدوياً.
    Carry = {
        Enabled     = false,     -- true/false | false
        LeaveEvents = {},        -- مثال { 'qb-multicharacter:server:logout' }  (يُستدعى عند ترك الشخصية)
        JoinEvents  = {},        -- مثال { 'QBCore:Server:PlayerLoaded' }       (يُستدعى بعد تحميل الشخصية الجديدة)
        Whitelist   = {},        -- أغراض تنتقل مع اللاعب بين شخصياته
        ExpireHours = 72,        -- ساعات صلاحية الحقيبة المحفوظة | 1-720 | 72
        File        = 'data/carry_pouch.json',
    },
}

-- ======================================================================
-- 12) NOTIFICATIONS / الإشعارات
-- ======================================================================
Config.Notifications = {
    Enabled  = true,         -- false = لا إشعارات إطلاقاً (لا رسائل نجاح/خطأ للإداري) | true/false | true
    Provider = 'internal',   -- 'internal' | 'auto' | 'ox_lib' | 'esx' | 'qbcore' | 'custom' | 'none'
    Duration = 5000,         -- ms | 1000-30000 | 5000
    OxPosition = 'top-right',
}

-- ======================================================================
-- 13) UI / الواجهة (Overlay بدون Focus ولا تستبدل الـ HUD)
-- ======================================================================
Config.UI = {
    Enabled    = true,
    Direction  = 'auto',     -- 'auto' (حسب اللغة) | 'ltr' | 'rtl'
    Font       = 'Cairo',    -- اسم الخط | 'Cairo' = الخط المرفق مع السكربت (يدعم العربية والإنجليزية) | أو اسم خط مثبت عند اللاعبين
    FontSize   = 17,         -- px | 10-40 | 17
    Dialogue = {
        Position  = 'bottom-center', -- 'bottom-center' | 'top-center' | 'bottom-left' | 'bottom-right'
        OffsetY   = 110,             -- px
        Width     = 560,             -- px
        Radius    = 16,
        TypeSpeed = 28,              -- ms لكل حرف (0 = فوري) | 0-200 | 28
        ShowSpeaker = true,
    },
    Bubble = { Enabled = true },     -- فقاعة نص فوق الشخص الوهمي عندما يتكلم | true/false | true
    TalkHint = true,                 -- تلميح [E] تحدث عند الاقتراب من الصديق الوهمي | true/false | true
    BloodColor = '#7A0000',
}

-- ======================================================================
-- 9.5) RESIST / ميني قيم المقاومة (لكل هلوسة)
-- ======================================================================
-- اللاعب يقاوم الهلوسة بميني قيم: يضغط زر المقاومة (أو تظهر له دعوة تلقائية). النجاح يضعف الهلوسة أو ينهيها، والفشل يقويها.
-- أنواع الميني قيم: mash (ضغط متكرر) | hold (تحكم بالتنفس: اضغط باستمرار لإبقاء المؤشر بالمنطقة) | timing (اضغط وقت المنطقة) | sequence (أزرار بالترتيب)
-- لتعطيل المقاومة لنوع معين: Config.Types.<type>.Resist = false  |  أو تحديد نوع اللعبة: Resist = { Game = 'timing', Difficulty = 0.8 }
Config.Resist = {
    Enabled    = true,       -- true/false | true
    Key        = 47,         -- زر المقاومة (47 = G) https://docs.fivem.net/docs/game-references/controls/
    KeyLabel   = 'G',        -- الحرف الظاهر في التلميح
    Games      = { 'mash', 'hold', 'timing', 'sequence' },  -- الألعاب المسموحة (تُختار عشوائياً)
    -- مستوى الصعوبة: 'easy' سهل | 'normal' عادي | 'hard' صعب (الافتراضي) | 'nightmare' كابوس
    -- Difficulty level: easy | normal | hard (default) | nightmare  (edit the numbers below to taste)
    Level      = 'hard',
    Levels = {
        -- Difficulty: صرامة الألعاب 0.0-1.0   Seconds: مهلة كل لعبة   Mistakes: أخطاء مسموحة قبل الفشل
        -- Chain: كم لعبة متتالية يجب الفوز بها (كل مرة لعبة مختلفة)   Spikes: كم "رعب مفاجئ" يضربك أثناء اللعبة (وجه + عقوبة)
        easy      = { Difficulty = 0.30, Seconds = 9, Mistakes = 3, Chain = 1, Spikes = 0 },
        normal    = { Difficulty = 0.55, Seconds = 7, Mistakes = 2, Chain = 1, Spikes = 0 },
        hard      = { Difficulty = 0.85, Seconds = 6, Mistakes = 1, Chain = 2, Spikes = 2 },
        nightmare = { Difficulty = 1.00, Seconds = 6, Mistakes = 0, Chain = 3, Spikes = 4 },
    },
    GameSeconds = 7,         -- يُستخدم فقط إذا حذفت Levels
    Difficulty = 0.5,        -- يُستخدم فقط إذا حذفت Levels
    Cooldown   = 12,         -- ثواني بين محاولة وأخرى | 2-300 | 12
    OnSuccess  = { Reduce = 0.35, EndBelow = 0.18 },  -- الشدة تنقص بهذه النسبة، وتنتهي الهلوسة إذا نزلت تحت EndBelow
    OnFail     = { Increase = 0.12, Max = 1.0 },      -- الفشل يزيد الشدة
    Prompt     = { Enabled = true, FirstAfter = 4, Every = { min = 35.0, max = 80.0 }, Seconds = 8 },  -- دعوة تلقائية "قاوم!" (FirstAfter = أول دعوة بعد كم ثانية من دخول اللاعب)
    -- مرحلة التحذير قبل الهلوسة: لما تبدأ هلوسة، يظهر "قاوم!" مع نبض قلب وتعتيم خفيف ويُعطى اللاعب هذه المهلة ليقاومها
    -- قبل أن تبدأ فعلاً. إذا فاز بالمقاومة تُلغى أو تضعف؛ وإلا تبدأ. لا تُقتطع من مدة الهلوسة.
    -- Warning phase: when a hallucination is about to begin the player sees RESIST! first (heartbeat + dark edges) and gets
    -- `Seconds` to fight it BEFORE it starts. Win = cancelled / weaker, otherwise it begins. It does not eat the duration.
    Onset      = { Enabled = true, Seconds = 5, MinIntensity = 0.30, Exclude = { 'heartbeat', 'breathing', 'tinnitus', 'fake_notify', 'words' } },
    MinMs      = 1200,       -- أقل زمن مقبول للميني قيم الواحدة (يُضرب في عدد السلسلة Chain) (يرفض السيرفر نتائج أسرع من ذلك) | 300-10000 | 1200
    -- أنواع لا تُقاوَم لأنها ليست "هلوسة" على اللاعب نفسه (مثل إخفاء لاعب)
    Exclude    = { 'hide_player', 'solo_visible', 'possess', 'takeover', 'takeover_ghost', 'world_frozen' },
}

-- ======================================================================
-- 9.6) CUES / مؤثرات استعراضية فورية (تُفعَّل من اللوحة أو /hcue أو exports)
-- ======================================================================
-- كل مؤثر قصير ومحلي عند اللاعب فقط، بدون ضرر. Duration بالثواني.
Config.Cues = {
    Enabled = true,
    Items = {
        jumpscare      = { Enabled = true, Duration = 5.0 },   -- بيد/NPC مرعب يظهر فجأة (أقصى مدة بالثواني) مع وميض وصرخة
        blackout       = { Enabled = true, Duration = 3.0 },   -- انقطاع الإضاءة (شاشة سوداء قصيرة)
        heartbeat_rush = { Enabled = true, Duration = 8.0 },   -- تسارع القلب مع رعشة
        glitch         = { Enabled = true, Duration = 2.2 },   -- تشويش/تقطع الصورة
        quake          = { Enabled = true, Duration = 4.0 },   -- هزة أرضية وهمية
        whispers       = { Enabled = true, Duration = 6.0 },   -- همسات حوله
        blood_rain     = { Enabled = true, Duration = 5.0 },   -- دم يغمر الشاشة
        freeze         = { Enabled = true, Duration = 3.0 },   -- برد: نفَس وتجمّد للشاشة
        eye_blink      = { Enabled = true, Duration = 6.0 },   -- العين: الشاشة تتحول إلى عين تفتح وتغلق
    },
}

-- ======================================================================
-- 9.7) JUMPSCARE / الجمب سكير = بيد (NPC) حقيقي داخل اللعبة وليس صورة
-- ======================================================================
-- يظهر بيد محلي (زومبي/شبح بنفس أشكال الزومبي: جروح ودم وتعبير وجه) لهذا اللاعب فقط، مع وميض أبيض وصرخة وهزة كاميرا، ثم يختفي عند وصوله إليه.
-- لا يؤذي ولا يعيق ولا يراه أحد غيره. إن لم يوجد مكان/موديل يظهر الوميض والصرخة والهزة بدون صمت أو خطأ.
-- Mode     : 'ped' (الافتراضي: بيد/NPC حقيقي) | 'image' (الصور والوجوه المرسومة القديمة على الشاشة) | 'both' (الاثنان)
-- Looks    : أسماء أشكال من Config.Realism.Zombies.Looks تُستخدم للجمب سكير. فارغة {} = أي شكل
-- Styles   : نمط الظهور (Weight = نسبة | Distance = المسافة بالأمتار | Enabled = false لإيقافه)
--              pop    : يظهر أمامك مباشرة على بعد 2-4 م يحدّق بك (Stay = ثواني التحديق | 0.1-6 | 0.8) ثم ينقض
--              rush   : يظهر بعيداً أمامك ويركض نحوك بأقصى سرعة
--              behind : يظهر خلفك مباشرة، والصدمة تقع عندما تلتفت (أو بعد Wait ثانية)
-- VanishDistance : يختفي عند هذه المسافة منك بالأمتار | 0.8-3.0 | 1.3
-- Fallback : عند تعذر وضع البيد: 'flash' (وميض وصرخة وهزة فقط) | 'image' (يضيف صورة قديمة)
-- Images / ImageChance / Faces : تُستعمل فقط في Mode = 'image' أو 'both' (صور html/assets/scare/ ووجوه html/faces.js)
Config.Jumpscare = {
    Mode = 'ped',            -- 'ped' | 'image' | 'both' | ped
    Looks = { 'screamer', 'rot', 'jaw', 'ghost_girl', 'ghost_bride', 'burnt', 'possessed', 'faceless', 'drowned', 'infected' },
    Styles = {
        pop    = { Weight = 4, Distance = { min = 2.4, max = 3.6 }, Stay = 0.8, Speed = 3.0 },       -- أمامك يحدّق ثم ينقض
        rush   = { Weight = 4, Distance = { min = 12.0, max = 20.0 }, Speed = 3.0 },                  -- يركض نحوك
        behind = { Weight = 3, Distance = { min = 1.8, max = 2.6 }, Wait = 2.5, Speed = 3.0 },        -- خلفك، والصدمة عند الالتفات
    },
    VanishDistance = 1.3,    -- متر | 0.8-3.0 | 1.3
    Fallback = 'flash',      -- 'flash' | 'image' | flash
    -- ---- للوضع 'image' / 'both' فقط ----
    Images = {
        'assets/scare/ghost_girl.jpg',   'assets/scare/ghost_bride.jpg', 'assets/scare/zombie_rot.jpg',
        'assets/scare/zombie_jaw.jpg',   'assets/scare/screamer.jpg',    'assets/scare/drowned.jpg',
        'assets/scare/burnt.jpg',        'assets/scare/shadow_grim.jpg', 'assets/scare/infected.jpg',
        'assets/scare/tong_face.jpg',    'assets/scare/crawler.jpg',     'assets/scare/possessed.jpg',
        'assets/scare/toxic.jpg',        'assets/scare/faceless.jpg',    'assets/scare/drowned_2.jpg',
    },
    ImageChance = 1.0,
    Faces = {},
}

-- ======================================================================
-- 9.7) POSSESS / السيطرة (الإداري يدخل بشخصية اللاعب)
-- ======================================================================
-- /hpossess <id>: اللاعب يرى العالم بعيني الإداري (كاميرا الإداري)، يتجمد، ولا يتكلم. الإداري يتكلم ويتحرك بملامح اللاعب (عبر تبديل الملامح).
Config.Possess = {
    Enabled       = true,    -- true/false | true
    SwapLooks     = true,    -- يبدّل الملامح فعلياً (يحتاج Config.Appearance) وإلا يكتفي بالكاميرا | true/false | true
    MaxSeconds    = 300,     -- أقصى مدة | 10-3600 | 300
    FreezeTarget  = true,    -- تجميد جسد اللاعب ومنعه من الحركة | true/false | true
    MuteTarget    = true,    -- منع اللاعب من الحديث (الصوت) أثناء السيطرة | true/false | true
    CamHz         = 12,      -- عدد تحديثات الكاميرا بالثانية | 4-20 | 12
    ShowHud       = true,    -- شريط "أنت ترى بعين فلان" | true/false | true
    BlockRespawnDeath = true, -- تنتهي السيطرة إذا مات أحدهما | true/false | true
}

-- لوحة التحكم /hmenu: اختيار اللاعب والنوع والشدة والمدة، السيناريوهات، التحكم الحي، التبديل، والجلسات النشطة.
-- كل أمر من اللوحة يمر على نفس فحوصات الصلاحيات في السيرفر (الواجهة لا تُصدَّق).
Config.Panel = {
    Enabled = true,          -- true/false | true
    Key     = nil,           -- زر فتح اللوحة (مثل 'F7') | nil = بدون زر، الأمر فقط
    RefreshMs = 2000,        -- ms: سرعة تحديث الجلسات النشطة والأسماء أثناء فتح اللوحة | 1000-10000 | 2000
}

-- ======================================================================
-- 14) SOUNDS / الأصوات
-- ======================================================================
Config.Sounds = {
    Enabled = true,          -- true/false | true
    Master  = 0.9,           -- مستوى عام 0.0-1.0 | 0.9
    Layered = true,          -- طبقات أقوى للرعب (صرخة فوق الضربة، ضربة قوية عند فشل المقاومة، نبض ثقيل) | true/false | true
    -- كل صوت = ملف html/assets/sounds/<الاسم>.ogg (استبدله بنفس الاسم لتغيير الصوت)
}

-- ======================================================================
-- 14b) HEALTH / فحص الأداء: لماذا لم تعمل هلوسة؟
-- ======================================================================
-- بعد بدء أي هلوسة يراقبها السكربت: إن لم يظهر أي أثر (لا شخصيات ولا مؤثرات ولا أصوات) يُسجّل السبب
-- (داخل مركبة / لم يجد مكاناً / موديل غير موجود / خطأ ...) ويظهر للإداري في تبويب "التشخيص" ولسجل الكونسول،
-- ويشغّل بديلاً مخيفاً بسيطاً حتى لا يمر الأمر بلا شيء. زر "اختبار شامل" في تبويب التشخيص يجرّب كل الأنواع عليك ويعطيك تقريراً.
-- After a hallucination starts it is watched: if nothing visible happened the reason is logged (in a vehicle / no spot found /
-- missing model / script error ...), shown to admins in the Diagnostics tab, and a simple fallback scare runs so it never
-- passes silently. The "Run full test" button in Diagnostics tries every type on you and gives a report.
Config.Health = {
    Enabled           = true,    -- true/false | true
    CheckAfter        = 6,       -- ثواني بعد بدء الأثر قبل الحكم عليه | 3-30 | 6
    Fallback          = true,    -- بديل مخيف بسيط عند عدم ظهور أي أثر | true/false | true
    Keep              = 60,      -- كم سطراً يحفظ في السجل | 10-300 | 60
    AutoRegisterAfter = 45,      -- ثواني بعد دخول لاعب لم يُعلن عن نفسه: يُسجّل تلقائياً (حل لمشكلة "لا شيء يعمل") | 10-300 | 45
}

-- ======================================================================
-- 15) SECURITY / الحماية
-- ======================================================================
Config.Security = {
    RateLimits = {
        reply   = { max = 6,  window = 10 },
        ended   = { max = 30, window = 10 },
        ready   = { max = 4,  window = 10 },
        optout  = { max = 4,  window = 10 },
        appear  = { max = 6,  window = 10 },
        command = { max = 20, window = 10 },
        panel   = { max = 60, window = 10 },
        resist  = { max = 6,  window = 10 },
        cam     = { max = 40, window = 2 },
        cue     = { max = 20, window = 10 },
        health  = { max = 40, window = 10 },
    },
    MaxStrikes   = 12,
    KickOnAbuse  = false,
    LogSuspicious = true,
}

-- ======================================================================
-- 16) INTEGRATION / التكامل مع السكربتات الأخرى
-- ======================================================================
Config.Integration = {
    StateBags  = true,       -- Player(src).state.halluc_active (bool) و halluc_count (رقم) | true
    EmitEvents = true,       -- إطلاق أحداث السيرفر (universal_halluc:started / ended / scenario...) | true
    -- أحداث/أوامر من سكربتات أخرى (مخدرات...) تقدر تستدعي exports.universal_hallucination:Start(...)
}
