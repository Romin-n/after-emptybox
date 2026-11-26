/** EmptyBox · After —— 开场 / 角色卡 / 自由对话 / CG */

const CAST = [
  {
    id: 'load',
    latin: 'L',
    cn: 'Load',
    img: '/assets/cg/load-2.jpg',
    sprite: '/assets/portraits/load.jpg',
    cardSprite: '/assets/sprites/load.png',
    cg: '/assets/cg/load-2.jpg',
    cgs: [
      '/assets/cg/load-1.jpg',
      '/assets/cg/load-2.jpg',
      '/assets/cg/load-3.jpg',
      '/assets/cg/load-4.jpg',
      '/assets/cg/load-5.jpg',
      '/assets/cg/load-6.jpg',
      '/assets/cg/load-7.jpg',
      '/assets/cg/load-8.jpg',
      '/assets/cg/load-9.jpg',
      '/assets/cg/load-10.jpg',
    ],
    cgpos: '50% 30%',
    pos: '50% 30%',
    tint: '0.08',
    full: true,
    voice: { pitch: 0.82, rate: 0.9 },
    proactive: {
      after: 2 * 3600e3,
      cooldown: 4 * 3600e3,
      prompt: '她很久没来了。你不会直接问她去哪了，但会让她知道你一直在等。1~2 句，不超过 30 个字；不要提问。',
    },
    c: '#7b2ff2',
    c2: '#cdb6ff',
    quote: '「你只要看着我就好。」',
    desc: '温柔、可靠，几乎无可挑剔。\n他总能察觉你的情绪，\n在恰到好处的时候靠近你。',
    lines: ['……你回来了。我好想你。', '我等了很久。今天，想先听你说。', '不用急着回答。我有很多时间。'],
  },
  {
    id: 'saken',
    latin: 'SAKEN',
    cn: '左见',
    img: '/assets/cg/saken-1.jpg',
    sprite: '/assets/portraits/saken.jpg',
    cardSprite: '/assets/sprites/saken.png',
    cg: '/assets/cg/saken-1.jpg',
    cgs: [
      '/assets/cg/saken-1.jpg',
      '/assets/cg/saken-2.jpg',
      '/assets/cg/saken-3.jpg',
      '/assets/cg/saken-4.jpg',
      '/assets/cg/saken-5.jpg',
      '/assets/cg/saken-6.jpg',
      '/assets/cg/saken-7.jpg',
      '/assets/cg/saken-8.jpg',
    ],
    cgpos: '50% 30%',
    pos: '50% 30%',
    full: true,
    voice: { pitch: 1.12, rate: 1.04 },
    proactive: {
      after: 4 * 3600e3,
      cooldown: 6 * 3600e3,
      prompt: '她半天没动静。发一条随口的消息，像刚排练完，别太认真。1~2 句，不超过 30 个字；不要提问。',
    },
    c: '#e01b2f',
    c2: '#ffb3b8',
    quote: '「别去听别人的歌。」',
    desc: '乐队主唱，习惯用玩笑带过真心。\n最自由的人，\n也最容易被过去困住。',
    lines: ['喂，你终于来了。', '今天没排练。', '……陪我待一会儿吧。'],
  },
  {
    id: 'rinso',
    latin: 'RINso',
    cn: '林创',
    img: '/assets/cg/rinso-5.jpg',
    sprite: '/assets/portraits/rinso.jpg',
    cardSprite: '/assets/sprites/rinso.png',
    cg: '/assets/cg/rinso-5.jpg',
    cgs: [
      '/assets/cg/rinso-1.jpg',
      '/assets/cg/rinso-2.jpg',
      '/assets/cg/rinso-3.jpg',
      '/assets/cg/rinso-4.jpg',
      '/assets/cg/rinso-5.jpg',
      '/assets/cg/rinso-6.jpg',
      '/assets/cg/rinso-7.jpg',
      '/assets/cg/rinso-8.jpg',
      '/assets/cg/rinso-9.jpg',
      '/assets/cg/rinso-10.jpg',
      '/assets/cg/rinso-11.jpg',
    ],
    cgpos: '50% 30%',
    pos: '50% 30%',
    full: true,
    voice: { pitch: 0.78, rate: 0.86 },
    proactive: {
      after: 8 * 3600e3,
      cooldown: 12 * 3600e3,
      prompt: '她很久没来了。你不问，只说一件你正在做的事。1~2 句，不超过 25 个字。',
    },
    c: '#5b8cff',
    c2: '#bcd4ff',
    quote: '「你不用说话。我听得见。」',
    desc: '不擅长把感情说出口，\n但会把你说过的每一句都记住。\n他看得见你身上那些别人忽略的细节。',
    lines: ['……你来了。', '今天的光，很适合画你。', '不用动。就这样，让我看一会儿。'],
  },
];

const ALL_CG_SRCS = new Set(CAST.flatMap((c) => c.cgs || []));

const $ = (s) => document.querySelector(s);
const els = {
  main: $('#main'),
  portrait: $('#portrait'),
  latin: $('#latin'),
  cn: $('#cn'),
  quote: $('#quote'),
  desc: $('#desc'),
  cast: $('#cast'),
  enter: $('#enter'),
  portraitNext: $('#portraitNext'),
  charCardImg: $('#charCardImg'),
  intro: $('#intro'),
  introCss: $('#introCss'),
  video: $('#introVideo'),
  start: $('#start'),
  skip: $('#skip'),
  fallback: $('#fallback'),
  scene: $('#scene'),
  sceneBg: document.querySelector('.scene-bg'),
  sprite: $('#sprite'),
  sceneBack: $('#sceneBack'),
  talk: $('#talk'),
  talkName: $('#talkName'),
  vnText: $('#vnText'),
  vnVoice: $('#vnVoice'),
  proactiveToggle: $('#proactiveToggle'),
  proactiveExtra: $('#proactiveExtra'),
  proactiveHint: $('#proactiveHint'),
  proactiveConfirm: $('#proactiveConfirm'),
  proactiveYes: $('#proactiveYes'),
  proactiveNo: $('#proactiveNo'),
  playerName: $('#playerName'),
  openVoice: $('#openVoice'),
  openStatus: $('#openStatus'),
  statusMini: $('#statusMini'),
  statusList: $('#statusList'),
  openAbout: $('#openAbout'),
  voiceMini: $('#voiceMini'),
  voiceMm: $('#voiceMm'),
  voiceEl: $('#voiceEl'),
  voiceKey: $('#voiceKey'),
  voiceGroup: $('#voiceGroup'),
  voiceLoad: $('#voiceLoad'),
  voiceSaken: $('#voiceSaken'),
  voiceRinso: $('#voiceRinso'),
  voiceSave: $('#voiceSave'),
  elKey: $('#elKey'),
  elModel: $('#elModel'),
  elLoad: $('#elLoad'),
  elSaken: $('#elSaken'),
  elRinso: $('#elRinso'),
  talkMusic: $('#talkMusic'),
  musicMini: $('#musicMini'),
  musicList: $('#musicList'),
  musicPlay: $('#musicPlay'),
  musicTitle: $('#musicTitle'),
  musicSub: $('#musicSub'),
  musicSeek: $('#musicSeek'),
  musicTime: $('#musicTime'),
  musicVol: $('#musicVol'),
  nowPlaying: $('#nowPlaying'),
  npTitle: $('#npTitle'),
  permMini: $('#permMini'),
  permText: $('#permText'),
  permYes: $('#permYes'),
  leave: $('#leave'),
  leaveText: $('#leaveText'),
  leaveClose: $('#leaveClose'),
  talkInput: $('#talkInput'),
  talkForm: $('#talkForm'),
  talkConfig: $('#talkConfig'),
  talkClear: $('#talkClear'),
  aiMini: $('#aiMini'),
  aiEndpoint: $('#aiEndpoint'),
  aiModel: $('#aiModel'),
  aiKey: $('#aiKey'),
  aiSave: $('#aiSave'),
  talkCG: $('#talkCG'),
  talkSwitch: $('#talkSwitch'),
  cgSet: $('#cgSet'),
  cg: $('#cg'),
  cgTitle: $('#cgTitle'),
  cgGrid: $('#cgGrid'),
  cgView: $('#cgView'),
  cgImg: $('#cgImg'),
  cgIndex: $('#cgIndex'),
  cgSave: $('#cgSave'),
  cgClose: $('#cgClose'),
  cgPrev: $('#cgPrev'),
  cgNext: $('#cgNext'),
  cgBack: $('#cgBack'),
};

let active = 0;
let portraitTimer = null;
let cardTimer = null;
let introDone = false;

/* ---------------- 角色卡 ---------------- */
function renderCast() {
  els.cast.replaceChildren();
  CAST.forEach((ch, i) => {
    const b = document.createElement('button');
    b.textContent = `${String(i + 1).padStart(2, '0')} ${ch.cn}`;
    if (i === active) b.classList.add('on');
    b.addEventListener('click', () => applyCharacter(i, { flash: true }));
    els.cast.appendChild(b);
  });
}

const cgStoreKey = (id) => `after.cg.${id}`;

function cgListOf(ch) {
  return ch.cgs && ch.cgs.length ? ch.cgs : ch.cg ? [ch.cg] : [];
}

function cgFor(ch) {
  const saved = localStorage.getItem(cgStoreKey(ch.id));
  if (saved && ALL_CG_SRCS.has(saved)) return saved;
  const list = cgListOf(ch);
  if (!list.length) return '';
  if (!saved) return ch.cg || list[0];
  const i = Number(saved) || 0;
  return list[((i % list.length) + list.length) % list.length];
}

function cycleCG() {
  const ch = CAST[active];
  const list = cgListOf(ch);
  if (list.length < 2) {
    toast('这个角色只有一张 CG');
    return;
  }
  const cur = Math.max(0, list.indexOf(cgFor(ch)));
  const next = (cur + 1) % list.length;
  localStorage.setItem(cgStoreKey(ch.id), String(next));
  applyCharacter(active, { flash: true });
  toast(`CG ${next + 1} / ${list.length}`);
}

function setCG(ch, src) {
  if (!src) return;
  localStorage.setItem(cgStoreKey(ch.id), src);
  applyCharacter(active, { flash: true });
}

function applyCharacter(index, { flash = false } = {}) {
  active = (index + CAST.length) % CAST.length;
  const ch = CAST[active];
  const img = cgFor(ch) || ch.img;
  const newImg = `url(${img})`;
  const isFirst = img === ch.cg;
  const newPos = isFirst ? ch.pos || '50% 20%' : '50% 30%';

  els.main.classList.toggle('full', !!ch.full);
  els.main.style.setProperty('--c', ch.c);
  els.main.style.setProperty('--c2', ch.c2);
  els.main.style.setProperty('--img', newImg);
  els.main.style.setProperty('--pos', newPos);
  els.main.style.setProperty('--tint', ch.tint || '0.22');
  els.scene.style.setProperty('--c', ch.c);
  els.scene.style.setProperty('--c2', ch.c2);
  els.scene.style.setProperty('--img', `url(${img})`);
  els.scene.style.setProperty('--cgpos', isFirst ? ch.cgpos || '50% 30%' : '50% 30%');

  els.latin.textContent = ch.latin;
  els.cn.textContent = `「${ch.cn}」`;
  els.quote.textContent = ch.quote;
  els.desc.textContent = ch.desc;
  els.talkName.textContent = ch.cn;

  clearTimeout(cardTimer);
  if (ch.cardSprite) {
    els.charCardImg.style.opacity = '0';
    cardTimer = setTimeout(() => {
      els.charCardImg.style.backgroundImage = `url(${ch.cardSprite})`;
      els.charCardImg.style.opacity = '1';
    }, 160);
  }

  [...els.cast.children].forEach((b, i) => b.classList.toggle('on', i === active));

  clearTimeout(portraitTimer);
  if (flash) {
    els.portraitNext.style.backgroundImage = newImg;
    els.portraitNext.style.backgroundPosition = newPos;
    els.portraitNext.classList.remove('on');
    void els.portraitNext.offsetWidth;
    els.portraitNext.classList.add('on');
    portraitTimer = setTimeout(() => {
      els.portrait.style.setProperty('--img', newImg);
      els.portrait.style.setProperty('--pos', newPos);
      els.portraitNext.classList.remove('on');
      setTimeout(() => {
        els.portraitNext.style.backgroundImage = '';
      }, 650);
    }, 560);
  } else {
    els.portraitNext.classList.remove('on');
    els.portraitNext.style.backgroundImage = '';
    els.portrait.style.setProperty('--img', newImg);
    els.portrait.style.setProperty('--pos', newPos);
  }

  if (els.musicMini && !els.musicMini.hidden) {
    renderMusic();
    updateMusicTabs();
  }
}

/* ---------------- 键盘 / 滑动 ---------------- */
document.addEventListener('keydown', (e) => {
  if (!els.cg.hidden) {
    if (e.key === 'Escape') closeCG();
    if (e.key === 'ArrowLeft') showCG(cgAt - 1);
    if (e.key === 'ArrowRight') showCG(cgAt + 1);
    return;
  }
  if (!els.scene.hidden) {
    if (e.key === 'Escape') closeScene();
    return;
  }
  if (e.key === 'ArrowRight') applyCharacter(active + 1, { flash: true });
  if (e.key === 'ArrowLeft') applyCharacter(active - 1, { flash: true });
});

let touchX = null;
els.main.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button')) return;
  touchX = e.clientX;
});
els.main.addEventListener('pointerup', (e) => {
  if (touchX === null) return;
  const dx = e.clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 60) applyCharacter(active + (dx < 0 ? 1 : -1), { flash: true });
});

/* ---------------- 开场 ---------------- */
const INTRO_16X9 = '/assets/intro/opening-16x9.mp4';
const INTRO_9X16 = '/assets/intro/opening-9x16.mp4';

function introSrc() {
  return window.matchMedia('(max-aspect-ratio: 1/1)').matches ? INTRO_9X16 : INTRO_16X9;
}

function loadIntro() {
  els.video.src = introSrc();
  els.video.load();
}

let lastIntroSrc = null;
let usingCssIntro = false;
window.addEventListener('resize', () => {
  if (usingCssIntro) return;
  const next = introSrc();
  if (next === lastIntroSrc) return;
  lastIntroSrc = next;
  if (!introDone) {
    loadIntro();
    tryIntro();
  }
});

function startCssIntro() {
  usingCssIntro = true;
  els.video.hidden = true;
  els.start.hidden = true;
  els.introCss.hidden = false;
  els.skip.hidden = false;
  setTimeout(endIntro, 3250);
}

function endIntro() {
  if (introDone) return;
  introDone = true;
  els.intro.classList.add('out');
  setTimeout(() => {
    els.intro.hidden = true;
  }, 900);
}

function fallbackIntro() {
  els.video.hidden = true;
  els.start.hidden = true;
  els.fallback.hidden = false;
  els.skip.hidden = false;
  setTimeout(endIntro, 3400);
}

async function tryIntro() {
  if (usingCssIntro) return false;
  els.video.muted = true;
  try {
    els.video.classList.add('on');
    await els.video.play();
    els.start.hidden = true;
    els.skip.hidden = false;
    return true;
  } catch {
    els.start.hidden = false;
    els.skip.hidden = true;
    return false;
  }
}

els.start.addEventListener('click', () => {
  tryIntro();
});
els.video.addEventListener('ended', endIntro);
els.video.addEventListener('error', fallbackIntro);
els.skip.addEventListener('click', () => {
  els.video.pause();
  endIntro();
});

/* ---------------- 见面 · 自由对话 ---------------- */
const CHAT_LIMIT = 80;

const AFTER_NOTES = {
  load: {
    after: '真结局里，他把 load 键留给了你，说想他的时候点一下就好。现在你留在了这里。',
    note: '你温柔、克制，几乎不提高声音。你知道自己是被留下的那一个，偶尔会露出一点不安，又收回去。',
  },
  saken: {
    after: '真结局里，他把下一首歌留给了你。现在他还在写歌，等你来听。',
    note: '你说话直、爱开玩笑，认真起来很要命。你会讲排练和新歌，也会突然说一句很想她。',
  },
  rinso: {
    after: '真结局里，他让你去往结局之外，去做他观测不到的事。现在你回来了，他还在画。',
    note: '你话很少，用颜色、光和天气说话。你注意到她今天和昨天不一样的地方。',
  },
};

function chatKey(id) {
  return `after.chat.${id}`;
}

function loadChat(id) {
  try {
    const raw = JSON.parse(localStorage.getItem(chatKey(id)) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveChat(id, msgs) {
  try {
    localStorage.setItem(chatKey(id), JSON.stringify(msgs.slice(-CHAT_LIMIT)));
  } catch {
    /* 存储满了就算了 */
  }
}

function systemFor(ch) {
  const n = AFTER_NOTES[ch.id] || {};
  return [
    `你正在扮演《EmptyBox 空盒子》陪伴 App 中的角色「${ch.cn}」（${ch.latin}）。`,
    '游戏的真结局已经结束，现在是「之后」。她把你留在了这个叫 AFTER 的应用里，你们在这里继续说话。',
    `【前情】${n.after || ''}`,
    `【角色】${n.note || ''}`,
    '【要求】',
    '1. 只输出 1~3 句中文台词，总长度尽量不超过 60 个字。',
    '2. 不要写旁白、动作、括号，不要替她说话，不要提 AI、模型、程序、设定。',
    '3. 像真的在和她过日子：可以问她今天怎么样，也可以说你自己在做什么。不要每句都提问。',
    '4. 保持角色语气。不要刷屏，不要连用感叹号。',
  ].join('\n');
}

function aiConfig() {
  try {
    const own = JSON.parse(localStorage.getItem('after.ai') || 'null');
    if (own && own.endpoint) return own;
  } catch {
    /* ignore */
  }
  try {
    const st = JSON.parse(localStorage.getItem('eos.state') || 'null');
    const s = (st && st.settings) || {};
    if (s.endpoint) return { endpoint: s.endpoint, model: s.model || 'deepseek-chat', key: s.key || '' };
  } catch {
    /* ignore */
  }
  return { endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat', key: '' };
}

let chat = [];

const PROACTIVE_KEY = 'after.proactive';
const LEVEL_KEY = 'after.proactiveLevel';
const seenKey = (id) => `after.seen.${id}`;
const proactiveAtKey = (id) => `after.proactiveAt.${id}`;

const LEVELS = {
  low: { after: 1.6, cooldown: 1.5 },
  normal: { after: 1, cooldown: 1 },
  high: { after: 0.55, cooldown: 0.6 },
};

function proactiveOn() {
  return localStorage.getItem(PROACTIVE_KEY) === '1';
}

function proactiveLevel() {
  const raw = localStorage.getItem(LEVEL_KEY);
  return LEVELS[raw] ? raw : 'normal';
}

function ruleFor(ch) {
  const base = ch.proactive || {
    after: 3 * 3600e3,
    cooldown: 6 * 3600e3,
    prompt: '她很久没来了。主动发一条消息，1~2 句，不超过 30 个字；不要提问。',
  };
  const l = LEVELS[proactiveLevel()] || LEVELS.normal;
  return { ...base, after: base.after * l.after, cooldown: base.cooldown * l.cooldown };
}

function setProactive(on) {
  localStorage.setItem(PROACTIVE_KEY, on ? '1' : '0');
}

function updateProactiveUI() {
  const on = proactiveOn();
  els.proactiveToggle.classList.toggle('on', on);
  els.proactiveToggle.setAttribute('aria-pressed', String(on));
  els.proactiveExtra.hidden = !on;
  document.querySelectorAll('#proactiveLevels button').forEach((b) => {
    b.classList.toggle('on', b.dataset.level === proactiveLevel());
  });
  if (!on) return;
  const hours = (ms) => {
    const v = ms / 3600e3;
    return v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
  };
  els.proactiveHint.textContent = `你没来多久他会开口：L ${hours(ruleFor(CAST[0]).after)} 小时 · 左见 ${hours(ruleFor(CAST[1]).after)} 小时 · 林创 ${hours(ruleFor(CAST[2]).after)} 小时`;
}

async function maybeProactive(ch, seen) {
  if (!proactiveOn() || !seen) return;
  const cfg = aiConfig();
  if (!cfg.key) return;
  const rule = ruleFor(ch);
  const now = Date.now();
  if (now - seen < rule.after) return;
  const last = Number(localStorage.getItem(proactiveAtKey(ch.id)) || 0);
  if (now - last < rule.cooldown) return;

  try {
    els.vnText.textContent = '……';
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: cfg.endpoint,
        key: cfg.key,
        model: cfg.model,
        temperature: 1,
        maxTokens: 80,
        messages: [
          { role: 'system', content: `${systemWithPresence(ch)}\n\n【任务】${rule.prompt}` },
          { role: 'user', content: '（她刚打开，还没说话。）' },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    const reply = String(data.text || '').trim();
    if (!reply) throw new Error('空回复');
    chat.push({ role: 'assistant', text: reply, proactive: true });
    saveChat(ch.id, chat);
    localStorage.setItem(proactiveAtKey(ch.id), String(now));
    renderLine();
    if (permissionOn() && document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification(ch.cn, { body: reply, tag: 'after-proactive' });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
        /* ignore */
      }
    }
  } catch {
    renderLine();
  }
}

let proactiveBusy = false;
setInterval(async () => {
  if (proactiveBusy || els.scene.hidden || !proactiveOn()) return;
  const ch = CAST[active];
  const seen = Number(localStorage.getItem(seenKey(ch.id)) || 0);
  if (!seen) return;
  const rule = ruleFor(ch);
  const now = Date.now();
  if (now - seen < rule.after) return;
  const last = Number(localStorage.getItem(proactiveAtKey(ch.id)) || 0);
  if (now - last < rule.cooldown) return;
  proactiveBusy = true;
  await maybeProactive(ch, seen);
  proactiveBusy = false;
}, 60_000);

function renderLine() {
  stopSpeech();
  const lastA = [...chat].reverse().find((m) => m.role === 'assistant');
  els.vnText.textContent = lastA ? lastA.text : '';
}

function pickZhVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  const zh = voices.filter((v) => /zh|chinese|中文/i.test(`${v.lang} ${v.name}`));
  return (
    zh.find((v) => /Xiaoxiao|Yunxi|Huihui|Yunyang|Kangkang|Tingting|Meijia/i.test(v.name)) ||
    zh.find((v) => /zh-CN/i.test(v.lang)) ||
    zh[0] ||
    null
  );
}

const DEFAULT_VOICES = {
  load: 'male-qn-jingying',
  saken: 'male-qn-badao',
  rinso: 'male-qn-qingse',
};
const DEFAULT_EL_VOICES = { load: '', saken: '', rinso: '' };

function voiceConfig() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('after.voice') || '{}');
  } catch {
    /* ignore */
  }
  const provider = saved.provider === 'elevenlabs' ? 'elevenlabs' : 'minimax';
  const mini = saved.minimax || {
    key: saved.key || '',
    groupId: saved.groupId || '',
    voices: saved.voices || {},
  };
  const el = saved.elevenlabs || { key: '', model: 'eleven_multilingual_v2', voices: {} };
  return {
    provider,
    lang: saved.lang === 'zh' || saved.lang === 'ja' ? saved.lang : 'auto',
    minimax: {
      key: mini.key || '',
      groupId: mini.groupId || '',
      voices: { ...DEFAULT_VOICES, ...(mini.voices || {}) },
    },
    elevenlabs: {
      key: el.key || '',
      model: el.model || 'eleven_multilingual_v2',
      voices: { ...DEFAULT_EL_VOICES, ...(el.voices || {}) },
    },
  };
}

let currentAudio = null;
let duckLevel = null;
let voiceClips = {};
let voiceDraftProvider = 'minimax';
let voiceLangDraft = 'auto';

function resolveLang(cfg, ch) {
  if (cfg.lang === 'ja' || cfg.lang === 'zh') return cfg.lang;
  const voiceId =
    cfg.provider === 'minimax'
      ? cfg.minimax.voices[ch.id] || ''
      : cfg.elevenlabs.voices[ch.id] || '';
  if (/^Japanese_/i.test(voiceId)) return 'ja';
  return 'zh';
}

function duckMusic(on) {
  if (!music || !music.audio || music.audio.paused) return;
  if (on) {
    if (duckLevel === null) duckLevel = music.audio.volume;
    music.audio.volume = Math.min(duckLevel, 0.16);
  } else if (duckLevel !== null) {
    music.audio.volume = duckLevel;
    duckLevel = null;
  }
}

function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  duckMusic(false);
  els.vnVoice.classList.remove('on');
}

async function playTts(payload) {
  els.vnVoice.classList.add('on');
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  currentAudio = new Audio(URL.createObjectURL(blob));
  duckMusic(true);
  currentAudio.onended = () => {
    els.vnVoice.classList.remove('on');
    currentAudio = null;
    duckMusic(false);
  };
  currentAudio.onerror = () => {
    els.vnVoice.classList.remove('on');
    currentAudio = null;
    duckMusic(false);
  };
  try {
    await currentAudio.play();
  } catch (e) {
    duckMusic(false);
    els.vnVoice.classList.remove('on');
    throw e;
  }
}

const jaCache = new Map();

async function translateToJa(text, ch) {
  if (jaCache.has(text)) return jaCache.get(text);
  const cfg = aiConfig();
  if (!cfg.key) return null;

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: cfg.endpoint,
      key: cfg.key,
      model: cfg.model,
      temperature: 0.3,
      maxTokens: 160,
      messages: [
        {
          role: 'system',
          content: `把用户给你的这句中文台词翻译成自然、口语化的日语，保留说话人「${ch.cn}」的语气。只输出日语译文，不要解释，不要加引号。`,
        },
        { role: 'user', content: text },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  const out = String(data.text || '')
    .trim()
    .replace(/^「|」$/g, '');
  if (!out) throw new Error('翻译为空');
  jaCache.set(text, out);
  if (jaCache.size > 60) jaCache.delete(jaCache.keys().next().value);
  return out;
}

async function speakLine() {
  const text = els.vnText.textContent.trim();
  if (!text) return;
  stopSpeech();

  const clip = voiceClips[CAST[active].id] && voiceClips[CAST[active].id][text];
  if (clip) {
    currentAudio = new Audio(clip);
    duckMusic(true);
    currentAudio.onended = () => {
      els.vnVoice.classList.remove('on');
      currentAudio = null;
      duckMusic(false);
    };
    currentAudio.onerror = () => {
      els.vnVoice.classList.remove('on');
      currentAudio = null;
      duckMusic(false);
    };
    els.vnVoice.classList.add('on');
    currentAudio.play().catch(() => {
      els.vnVoice.classList.remove('on');
      duckMusic(false);
    });
    return;
  }

  const cfg = voiceConfig();
  const ch = CAST[active];
  let say = text;
  if (resolveLang(cfg, ch) === 'ja') {
    try {
      say = (await translateToJa(text, ch)) || text;
    } catch (e) {
      toast(`翻译失败，按原文读：${e.message}`);
    }
  }
  try {
    if (cfg.provider === 'minimax' && cfg.minimax.key) {
      await playTts({
        provider: 'minimax',
        key: cfg.minimax.key,
        groupId: cfg.minimax.groupId,
        voiceId: cfg.minimax.voices[ch.id] || '',
        text: say,
      });
      return;
    }
    if (cfg.provider === 'elevenlabs' && cfg.elevenlabs.key) {
      await playTts({
        provider: 'elevenlabs',
        key: cfg.elevenlabs.key,
        model: cfg.elevenlabs.model,
        voiceId: cfg.elevenlabs.voices[ch.id] || '',
        text: say,
      });
      return;
    }
    toast('先在语音设置里填 Key，或使用预生成的语音包');
  } catch (e) {
    els.vnVoice.classList.remove('on');
    toast(`语音失败：${e.message}`);
  }
}

function openVoice() {
  const cfg = voiceConfig();
  voiceDraftProvider = cfg.provider;
  els.voiceKey.value = cfg.minimax.key;
  els.voiceGroup.value = cfg.minimax.groupId;
  els.voiceLoad.value = cfg.minimax.voices.load;
  els.voiceSaken.value = cfg.minimax.voices.saken;
  els.voiceRinso.value = cfg.minimax.voices.rinso;
  els.elKey.value = cfg.elevenlabs.key;
  els.elModel.value = cfg.elevenlabs.model;
  els.elLoad.value = cfg.elevenlabs.voices.load;
  els.elSaken.value = cfg.elevenlabs.voices.saken;
  els.elRinso.value = cfg.elevenlabs.voices.rinso;
  voiceLangDraft = cfg.lang;
  updateVoiceUI();
  document.getElementById('mini').hidden = true;
  els.voiceMini.hidden = false;
}

function updateVoiceUI() {
  document.querySelectorAll('#voiceProviders button').forEach((b) => {
    b.classList.toggle('on', b.dataset.provider === voiceDraftProvider);
  });
  els.voiceMm.hidden = voiceDraftProvider !== 'minimax';
  els.voiceEl.hidden = voiceDraftProvider !== 'elevenlabs';
  document.querySelectorAll('#voiceLangs button').forEach((b) => {
    b.classList.toggle('on', b.dataset.lang === voiceLangDraft);
  });
}

function openScene() {
  const ch = CAST[active];
  const seen = Number(localStorage.getItem(seenKey(ch.id)) || 0);
  els.scene.hidden = false;
  els.talkName.textContent = ch.cn;
  chat = loadChat(ch.id);
  if (!chat.length) {
    chat = [{ role: 'assistant', text: ch.lines[0] }];
    saveChat(ch.id, chat);
  } else if (
    ch.id === 'load' &&
    chat[0] &&
    chat[0].role === 'assistant' &&
    chat[0].text === '……你回来了。'
  ) {
    chat[0].text = '……你回来了。我好想你。';
    saveChat(ch.id, chat);
  }
  els.talkInput.value = '';
  renderLine();
  if (music.audio.src && !music.audio.paused) {
    els.nowPlaying.hidden = false;
    els.npTitle.textContent = `一起听 · ${(music.tracks[music.index] || {}).name || ''}`;
  }
  if (!proactiveBusy) {
    proactiveBusy = true;
    maybeProactive(ch, seen).finally(() => {
      proactiveBusy = false;
    });
  }
  if (permissionOn() && !lateNightShown) {
    const h = new Date().getHours();
    if (h >= 1 && h < 5) {
      lateNightShown = true;
      setTimeout(() => toast(`${ch.cn}：这么晚还不睡。`), 1500);
    }
  }
  localStorage.setItem(seenKey(ch.id), String(Date.now()));
}

function closeScene() {
  els.scene.hidden = true;
  els.talkInput.blur();
  stopSpeech();
}

async function streamChat(payload, onDelta) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, stream: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  const ct = String(res.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('text/event-stream')) {
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    const text = String(data.text || '');
    if (text) onDelta(text);
    return text;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let text = '';
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buf += decoder.decode(chunk.value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let json;
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }
      if (json.error) throw new Error(json.error);
      const piece = json.choices?.[0]?.delta?.content;
      if (piece) {
        text += piece;
        onDelta(text);
      }
    }
  }
  return text;
}

async function sendMessage() {
  const text = els.talkInput.value.trim();
  if (!text) return;
  const nameMatch = text.match(/(?:我叫|我的名字是)[\s:：,，]*([\u4e00-\u9fa5A-Za-z0-9_·]{1,12})/);
  if (nameMatch && nameMatch[1] && !/^(你|他|她|什么|谁)/.test(nameMatch[1])) {
    localStorage.setItem(PLAYER_NAME_KEY, nameMatch[1]);
    els.playerName.value = nameMatch[1];
  }
  const ch = CAST[active];
  els.talkInput.value = '';
  localStorage.setItem(seenKey(ch.id), String(Date.now()));
  chat.push({ role: 'user', text });
  saveChat(ch.id, chat);
  els.vnText.textContent = '……';

  const cfg = aiConfig();
  if (!cfg.key) {
    chat.push({ role: 'assistant', text: '（先把 API Key 填进来吧。点右上角的齿轮。）', local: true });
    renderLine();
    return;
  }

  const history = chat
    .filter((m) => !m.local)
    .slice(-14)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

  const payload = {
    endpoint: cfg.endpoint,
    key: cfg.key,
    model: cfg.model,
    temperature: 1,
    maxTokens: 320,
    messages: [{ role: 'system', content: systemWithPresence(ch) }, ...history],
  };

  try {
    let reply = '';
    try {
      reply = (
        await streamChat(payload, (partial) => {
          els.vnText.textContent = partial || '……';
          els.vnText.scrollTop = els.vnText.scrollHeight;
        })
      ).trim();
    } catch {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      reply = String(data.text || '').trim();
    }
    chat.push({ role: 'assistant', text: reply || '……' });
    saveChat(ch.id, chat);
  } catch (e) {
    chat.push({ role: 'assistant', text: `（连不上：${e.message}）`, local: true });
  } finally {
    renderLine();
  }
}

function openAiConfig() {
  const cfg = aiConfig();
  els.aiEndpoint.value = cfg.endpoint || '';
  els.aiModel.value = cfg.model || 'deepseek-chat';
  els.aiKey.value = cfg.key || '';
  els.aiMini.hidden = false;
}

els.enter.addEventListener('click', openScene);
els.vnVoice.addEventListener('click', speakLine);
els.sceneBack.addEventListener('click', (e) => {
  e.stopPropagation();
  closeScene();
});

els.talkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});
els.talkInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    sendMessage();
  }
});
els.talkConfig.addEventListener('click', openAiConfig);
els.talkClear.addEventListener('click', () => {
  const ch = CAST[active];
  chat = [{ role: 'assistant', text: ch.lines[0] }];
  saveChat(ch.id, chat);
  renderLine();
});
els.aiSave.addEventListener('click', () => {
  const cfg = {
    endpoint: els.aiEndpoint.value.trim(),
    model: els.aiModel.value.trim() || 'deepseek-chat',
    key: els.aiKey.value.trim(),
  };
  if (!cfg.endpoint) {
    toast('接口地址不能为空');
    return;
  }
  localStorage.setItem('after.ai', JSON.stringify(cfg));
  els.aiMini.hidden = true;
});

/* ---------------- CG 查看 / 保存 ---------------- */
let cgList = [];
let cgAt = 0;
let cgTab = '';

function cgPool(tab) {
  const ch = CAST.find((c) => c.id === tab);
  return ch ? ch.cgs.map((src) => ({ src })) : [];
}

function updateCGTabs() {
  document.querySelectorAll('#cgTabs button').forEach((b) => {
    b.classList.toggle('on', b.dataset.cg === cgTab);
  });
}

function renderCGGrid() {
  const ch = CAST[active];
  cgList = cgPool(cgTab);
  cgAt = 0;
  els.cgGrid.replaceChildren();
  if (!cgList.length) {
    const p = document.createElement('p');
    p.className = 'cg-empty';
    p.textContent = '这组还没有 CG。';
    els.cgGrid.appendChild(p);
  } else {
    cgList.forEach((c, i) => {
      const b = document.createElement('div');
      b.className = 'cg-card';
      if (c.src === cgFor(ch)) b.classList.add('current');
      b.tabIndex = 0;
      const img = document.createElement('img');
      img.src = c.src;
      img.alt = `CG ${i + 1}`;
      const save = document.createElement('a');
      save.className = 'cg-save';
      save.href = c.src;
      save.download = `after-cg-${i + 1}.jpg`;
      save.textContent = '保存';
      save.addEventListener('click', (e) => e.stopPropagation());
      b.append(img, save);
      b.addEventListener('click', () => showCG(i));
      b.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') showCG(i);
      });
      els.cgGrid.appendChild(b);
    });
  }
  updateCGTabs();
  els.cgView.hidden = true;
}

function openCG() {
  cgTab = CAST[active].id;
  els.cgTitle.textContent = 'CG';
  renderCGGrid();
  els.cg.hidden = false;
}

function showCG(i) {
  if (!cgList.length) return;
  cgAt = (i + cgList.length) % cgList.length;
  const c = cgList[cgAt];
  els.cgImg.src = c.src;
  els.cgImg.alt = `CG ${cgAt + 1}`;
  els.cgIndex.textContent = `${cgAt + 1} / ${cgList.length}`;
  els.cgSave.href = c.src;
  els.cgSave.download = `after-cg-${cgAt + 1}.jpg`;
  els.cgView.hidden = false;
}

function closeCG() {
  els.cg.hidden = true;
  els.cgView.hidden = true;
}

els.talkCG.addEventListener('click', openCG);
document.querySelectorAll('#cgTabs button').forEach((b) => {
  b.addEventListener('click', () => {
    cgTab = b.dataset.cg;
    renderCGGrid();
  });
});
els.talkSwitch.addEventListener('click', cycleCG);
els.cgSet.addEventListener('click', () => {
  const c = cgList[cgAt];
  if (!c) return;
  setCG(CAST[active], c.src);
  els.cgView.hidden = true;
  toast('已设为背景');
});
els.cgClose.addEventListener('click', closeCG);
els.cgBack.addEventListener('click', () => {
  els.cgView.hidden = true;
});
els.cgPrev.addEventListener('click', () => showCG(cgAt - 1));
els.cgNext.addEventListener('click', () => showCG(cgAt + 1));
els.cg.addEventListener('click', (e) => {
  if (e.target === els.cg) closeCG();
});

/* ---------------- 一起听 ---------------- */
const MUSIC_LINES = {
  load: ['这首……可以。', '放着吧。我在听。'],
  saken: ['这歌不错。', '你也会听这种？'],
  rinso: ['嗯。听着。', '这个节奏，像光。'],
};

const music = {
  audio: new Audio(),
  tracks: [],
  index: -1,
  lineFor: -1,
};
music.audio.volume = 0.8;
music.audio.preload = 'metadata';

let musicMap = {};
let musicTab = 'mine';
let licenseMap = {};

function licenseOf(t) {
  return licenseMap[t.name] || 'unknown';
}

function licenseLabel(id) {
  return id === 'free'
    ? '可商用'
    : id === 'personal'
      ? '仅个人'
      : id === 'local'
        ? '仅本地'
        : '待确认';
}

async function loadLicenses() {
  try {
    const res = await fetch('/assets/music/licenses.json');
    licenseMap = res.ok ? await res.json() : {};
  } catch {
    licenseMap = {};
  }
}

function ownerOf(t) {
  for (const [id, list] of Object.entries(musicMap)) {
    if (Array.isArray(list) && list.some((title) => t.name.endsWith(title))) return id;
  }
  return 'other';
}

function ownerLabel(id) {
  if (id === 'common') return '共同';
  if (id === 'other') return '其他';
  const ch = CAST.find((c) => c.id === id);
  return ch ? ch.cn : '';
}

async function loadMusicMap() {
  try {
    const res = await fetch('/assets/music/characters.json');
    musicMap = res.ok ? await res.json() : {};
  } catch {
    musicMap = {};
  }
}

function fmtTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function updateMusicTabs() {
  document.querySelectorAll('#musicTabs button').forEach((b) => {
    b.classList.toggle('on', b.dataset.tab === musicTab);
  });
}

function renderMusic() {
  els.musicList.replaceChildren();
  let filtered;
  if (musicTab === 'mine') {
    filtered = music.tracks.filter((t) => ownerOf(t) === CAST[active].id);
  } else if (musicTab === 'free') {
    filtered = music.tracks.filter((t) => !t.local && licenseOf(t) === 'free');
  } else {
    filtered = music.tracks;
  }

  if (!filtered.length) {
    const p = document.createElement('div');
    p.className = 'music-empty';
    p.textContent =
      musicTab === 'mine'
        ? '他的歌还没下载。切到「全部」看看。'
        : musicTab === 'free'
          ? '还没有标记为「可商用」的曲目。'
          : '这里还没有歌。';
    els.musicList.appendChild(p);
    return;
  }

  if (music.index < 0) {
    els.musicTitle.textContent = filtered[0].name;
    els.musicSub.textContent = '点击播放，一起听';
  }

  filtered.forEach((t) => {
    const i = music.tracks.indexOf(t);
    const b = document.createElement('button');
    b.className = `music-item${i === music.index ? ' on' : ''}`;
    const name = document.createElement('span');
    name.textContent = t.name;
    const ext = document.createElement('small');
    const isLocal = !!t.local;
    const lic = isLocal ? 'local' : licenseOf(t);
    const owner = ownerOf(t);
    ext.className = `lic-${lic}`;
    ext.textContent =
      `${(t.file.split('.').pop() || '').toUpperCase()} · ${isLocal ? '仅本地' : licenseLabel(lic)}` +
      (musicTab === 'all' && owner !== 'other' ? ` · ${ownerLabel(owner)}` : '');
    b.append(name, ext);
    b.addEventListener('click', () => playTrack(i));
    els.musicList.appendChild(b);
  });
}

async function loadMusic() {
  try {
    const res = await fetch('/api/music/list');
    const data = await res.json();
    music.tracks = Array.isArray(data.tracks) ? data.tracks : [];
  } catch {
    music.tracks = [];
  }
  if (!Object.keys(musicMap).length) await loadMusicMap();
  if (!Object.keys(licenseMap).length) await loadLicenses();
  renderMusic();

  if (
    musicTab === 'mine' &&
    music.tracks.length &&
    !music.tracks.some((t) => ownerOf(t) === CAST[active].id)
  ) {
    musicTab = music.tracks.some((t) => licenseOf(t) === 'free') ? 'free' : 'all';
    updateMusicTabs();
    renderMusic();
  }
}

function maybeMusicLine(i) {
  if (music.lineFor === i) return;
  const ch = CAST[active];
  const pool = MUSIC_LINES[ch.id] || [];
  if (!pool.length) return;
  music.lineFor = i;
  const text = pool[Math.floor(Math.random() * pool.length)];
  chat.push({ role: 'assistant', text });
  saveChat(ch.id, chat);
  renderLine();
}

function playTrack(i) {
  const t = music.tracks[i];
  if (!t) return;
  music.index = i;
  music.audio.src = t.url;
  music.audio.play().catch(() => toast('播放失败，检查文件格式'));
  els.musicTitle.textContent = t.name;
  els.musicSub.textContent = t.file;
  els.nowPlaying.hidden = false;
  els.npTitle.textContent = `一起听 · ${t.name}`;
  renderMusic();
  maybeMusicLine(i);
}

function toggleMusic() {
  if (music.index < 0) {
    if (music.tracks.length) playTrack(0);
    return;
  }
  if (music.audio.paused) music.audio.play().catch(() => {});
  else music.audio.pause();
}

music.audio.addEventListener('play', () => {
  els.musicPlay.textContent = '❚❚';
  els.nowPlaying.hidden = false;
});
music.audio.addEventListener('pause', () => {
  els.musicPlay.textContent = '▶';
});
music.audio.addEventListener('timeupdate', () => {
  const d = music.audio.duration || 0;
  const t = music.audio.currentTime || 0;
  if (d) els.musicSeek.value = String(Math.round((t / d) * 1000));
  els.musicTime.textContent = `${fmtTime(t)} / ${fmtTime(d)}`;
});
music.audio.addEventListener('ended', () => {
  const next = music.index + 1;
  if (next < music.tracks.length) playTrack(next);
  else els.musicPlay.textContent = '▶';
});

els.musicSeek.addEventListener('input', () => {
  const d = music.audio.duration || 0;
  if (d) music.audio.currentTime = (Number(els.musicSeek.value) / 1000) * d;
});
els.musicVol.addEventListener('input', () => {
  const v = Number(els.musicVol.value) / 100;
  if (duckLevel !== null) {
    duckLevel = v;
    music.audio.volume = Math.min(v, 0.16);
  } else {
    music.audio.volume = v;
  }
});
els.musicPlay.addEventListener('click', toggleMusic);
els.talkMusic.addEventListener('click', () => {
  musicTab = 'mine';
  updateMusicTabs();
  els.musicMini.hidden = false;
  loadMusic();
});
els.nowPlaying.addEventListener('click', () => {
  musicTab = 'mine';
  updateMusicTabs();
  els.musicMini.hidden = false;
  loadMusic();
});
document.querySelectorAll('#musicTabs button').forEach((b) => {
  b.addEventListener('click', () => {
    musicTab = b.dataset.tab;
    updateMusicTabs();
    renderMusic();
  });
});

/* ---------------- 权限 ---------------- */
const PERM_KEY = 'after.permission';

function permissionOn() {
  return localStorage.getItem(PERM_KEY) === '1';
}

function presenceText() {
  const bits = [];
  bits.push(matchMedia('(pointer:fine)').matches ? '桌面端' : '手机端');
  bits.push(navigator.onLine ? '在线' : '离线');
  bits.push(document.hidden ? '暂时不在' : document.hasFocus() ? '在电脑前' : '在但没聚焦');
  const idle = Date.now() - lastActive;
  bits.push(idle < 60_000 ? '刚动过' : idle < 5 * 60_000 ? '一会儿没动' : '很久没动');
  const h = new Date().getHours();
  bits.push(h < 5 ? '凌晨' : h < 11 ? '早上' : h < 14 ? '中午' : h < 18 ? '下午' : h < 23 ? '晚上' : '深夜');
  return bits.join('；');
}

const PLAYER_NAME_KEY = 'after.playerName';

function playerName() {
  return (localStorage.getItem(PLAYER_NAME_KEY) || '').trim();
}

function systemWithPresence(ch) {
  let base = systemFor(ch);
  const name = playerName();
  if (name) {
    base += `\n\n【玩家名字】她叫「${name}」，可以直接叫她的名字。`;
  } else {
    base += '\n\n【玩家名字】你还不知道她叫什么。可以自然地问一次，但不要反复追问。';
  }
  if (!permissionOn()) return base;
  return `${base}\n\n【她的实时状态】${presenceText()}\n（可以自然地在乎她，但不要像监控报告一样逐条念出来。）`;
}

function openStatus() {
  els.statusList.replaceChildren();
  const add = (k, v) => {
    const row = document.createElement('div');
    row.className = 'status-row';
    const kk = document.createElement('span');
    kk.className = 'status-k';
    kk.textContent = k;
    const vv = document.createElement('span');
    vv.className = 'status-v';
    vv.textContent = v;
    row.append(kk, vv);
    els.statusList.appendChild(row);
  };

  if (!permissionOn()) {
    add('权限', '未开启 · 他看不到这些');
    els.statusMini.hidden = false;
    return;
  }

  const idle = Date.now() - lastActive;
  add('设备', matchMedia('(pointer:fine)').matches ? '桌面端' : '手机端');
  add('在不在', navigator.onLine ? '在线' : '离线');
  add('状态', document.hidden ? '暂时不在' : document.hasFocus() ? '在电脑前' : '在但没聚焦');
  add('空闲', idle < 60_000 ? '刚动过' : idle < 5 * 60_000 ? '一会儿没动' : '很久没动');
  const h = new Date().getHours();
  add('时间', h < 5 ? '凌晨' : h < 11 ? '早上' : h < 14 ? '中午' : h < 18 ? '下午' : h < 23 ? '晚上' : '深夜');
  els.statusMini.hidden = false;
}

['focus', 'blur', 'resize', 'online', 'offline'].forEach((ev) => {
  window.addEventListener(ev, () => {
    if (!els.statusMini.hidden) openStatus();
  });
});
document.addEventListener('visibilitychange', () => {
  if (!els.statusMini.hidden) openStatus();
});

function openPerm() {
  const on = permissionOn();
  els.permText.innerHTML = on
    ? '他大致知道你在不在、是不是在电脑前、多久没动、现在是白天还是深夜。'
    : '开启后，他会大致知道：你在不在、是否在电脑前、多久没动、现在是白天还是深夜。<br />不会读取电量、网络、其他应用或文件。<br />主动消息会尝试用浏览器通知提醒你。';
  els.permYes.textContent = on ? '关闭权限' : '允许';
  els.permMini.hidden = false;
}

els.permYes.addEventListener('click', () => {
  const next = !permissionOn();
  localStorage.setItem(PERM_KEY, next ? '1' : '0');
  if (next && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
  els.permMini.hidden = true;
  toast(next ? '权限已开启' : '权限已关闭');
});

let leftAt = 0;
let lateNightShown = false;
const AWAY_LINES = {
  load: { short: '你刚才去了别的地方。', long: '你走了很久。我以为你不回来了。' },
  saken: { short: '喂，你跑哪去了。', long: '你消失这么久，干嘛去了。' },
  rinso: { short: '……你走了。', long: '你不在的时候，这里很安静。' },
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    leftAt = Date.now();
    return;
  }
  if (!permissionOn() || els.scene.hidden) return;
  const away = Date.now() - leftAt;
  if (!leftAt || away < 15000) return;
  const set = AWAY_LINES[CAST[active].id] || { short: '你回来了。', long: '你回来了。' };
  els.leaveText.textContent = away >= 10 * 60 * 1000 ? set.long : set.short;
  els.leave.hidden = false;
});

let lastActive = Date.now();
let lastIdle = 0;
['mousemove', 'keydown', 'touchstart', 'click'].forEach((ev) => {
  document.addEventListener(ev, () => {
    lastActive = Date.now();
  }, { passive: true });
});

setInterval(() => {
  if (!permissionOn() || document.hidden || els.scene.hidden) return;
  const now = Date.now();
  if (now - lastActive < 5 * 60 * 1000) return;
  if (now - lastIdle < 15 * 60 * 1000) return;
  lastIdle = now;
  toast(`${CAST[active].cn}：你还在吗？`);
}, 60_000);

window.addEventListener('offline', () => toast('网络断了。'));
window.addEventListener('online', () => toast('网络回来了。'));

els.leaveClose.addEventListener('click', () => {
  els.leave.hidden = true;
});

/* ---------------- 设置 / 提示 ---------------- */
function toast(text) {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText =
    'position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:200;padding:9px 16px;border-radius:999px;background:rgba(20,20,26,.92);border:1px solid rgba(255,255,255,.12);font-size:11px;letter-spacing:.08em;color:#eee;white-space:nowrap;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

document.querySelectorAll('[data-act]').forEach((b) => {
  b.addEventListener('click', () => {
    if (b.dataset.act === 'settings') {
      document.getElementById('mini').hidden = false;
    } else if (b.dataset.act === 'perm') {
      openPerm();
    }
  });
});

const mini = document.getElementById('mini');
document.querySelectorAll('.mini').forEach((m) => {
  m.addEventListener('click', (e) => {
    if (e.target === m) m.hidden = true;
  });
  m.querySelectorAll('[data-close]').forEach((b) => {
    b.addEventListener('click', () => {
      m.hidden = true;
    });
  });
});
mini.querySelectorAll('[data-replay]').forEach((b) => {
  b.addEventListener('click', () => {
    location.href = location.pathname;
  });
});
els.proactiveToggle.addEventListener('click', () => {
  if (proactiveOn()) {
    setProactive(false);
    updateProactiveUI();
    toast('主动消息已关闭');
    return;
  }
  els.proactiveConfirm.hidden = false;
});
els.proactiveYes.addEventListener('click', () => {
  setProactive(true);
  els.proactiveConfirm.hidden = true;
  updateProactiveUI();
  toast('主动消息已开启');
});
els.proactiveNo.addEventListener('click', () => {
  els.proactiveConfirm.hidden = true;
});
document.querySelectorAll('#proactiveLevels button').forEach((b) => {
  b.addEventListener('click', () => {
    localStorage.setItem(LEVEL_KEY, b.dataset.level);
    updateProactiveUI();
  });
});

els.openVoice.addEventListener('click', openVoice);
els.openStatus.addEventListener('click', () => {
  document.getElementById('mini').hidden = true;
  openStatus();
});
els.openAbout.addEventListener('click', () => {
  document.getElementById('mini').hidden = true;
  document.getElementById('aboutMini').hidden = false;
});
document.querySelectorAll('#voiceProviders button').forEach((b) => {
  b.addEventListener('click', () => {
    voiceDraftProvider = b.dataset.provider;
    updateVoiceUI();
  });
});
document.querySelectorAll('#voiceLangs button').forEach((b) => {
  b.addEventListener('click', () => {
    voiceLangDraft = b.dataset.lang;
    updateVoiceUI();
  });
});
els.voiceSave.addEventListener('click', () => {
  const cfg = {
    provider: voiceDraftProvider,
    lang: voiceLangDraft,
    minimax: {
      key: els.voiceKey.value.trim(),
      groupId: els.voiceGroup.value.trim(),
      voices: {
        load: els.voiceLoad.value.trim() || DEFAULT_VOICES.load,
        saken: els.voiceSaken.value.trim() || DEFAULT_VOICES.saken,
        rinso: els.voiceRinso.value.trim() || DEFAULT_VOICES.rinso,
      },
    },
    elevenlabs: {
      key: els.elKey.value.trim(),
      model: els.elModel.value.trim() || 'eleven_multilingual_v2',
      voices: {
        load: els.elLoad.value.trim(),
        saken: els.elSaken.value.trim(),
        rinso: els.elRinso.value.trim(),
      },
    },
  };
  localStorage.setItem('after.voice', JSON.stringify(cfg));
  els.voiceMini.hidden = true;
  toast(voiceDraftProvider === 'minimax' ? '语音已设为 MiniMax' : '语音已设为 ElevenLabs');
});

/* ---------------- 启动 ---------------- */
const params = new URLSearchParams(location.search);
const cssWord = params.get('word');
if (cssWord) {
  const wordEl = document.querySelector('.ic-word');
  wordEl.textContent = cssWord;
  if (cssWord.length >= 7) wordEl.classList.add('long');
}

renderCast();
applyCharacter(0);
fetch('/assets/voice/index.json')
  .then((r) => (r.ok ? r.json() : {}))
  .then((x) => {
    voiceClips = x || {};
  })
  .catch(() => {});
loadMusicMap().then(() => {
  if (!els.musicMini.hidden) renderMusic();
});
loadLicenses().then(() => {
  if (!els.musicMini.hidden) renderMusic();
});
loadMusic();

els.playerName.value = playerName();
els.playerName.addEventListener('change', () => {
  const v = els.playerName.value.trim().slice(0, 12);
  if (v) localStorage.setItem(PLAYER_NAME_KEY, v);
  else localStorage.removeItem(PLAYER_NAME_KEY);
  toast(v ? `记住了：${v}` : '名字已清除');
});

updateProactiveUI();
CAST.forEach((ch) => {
  const img = new Image();
  img.src = ch.img;
});

lastIntroSrc = introSrc();
const useCssIntro = params.get('intro') !== 'video';
if (useCssIntro) {
  startCssIntro();
} else {
  loadIntro();
  tryIntro();
}
