/* =========================================
   Diari Minecraft (Llibre amb pàgines) — Valencià
   - Navegació per pàgines (Pròleg + Actes)
   - Actes es desbloquegen per ordre
   - So (WebAudio) sense arxius
   - Toast + animacions
   - Confeti pixel en completar actes i al 100%
   - Recompensa 100% + localStorage
   ========================================= */

const STORAGE_KEY = "guardiana_book_v1_va";

const TAG = { MAIN: "main", DANGER: "danger", HOME: "home" };

const DATA = [
  {
    id: "acto1",
    title: "ACTE I — La Forjadora de Vida",
    desc: "Cuina i Natura. Converteix allò salvatge en una llar fèrtil.",
    titleUnlock: "Druida de l’Overworld",
    unlockHint: "Completa l’Acte I per a desbloquejar l’Acte II.",
    missions: [
      { id: "a1_m1", text: "Fundar l’Hort dels Sis Aliments Sagrats", note: "Pastanagues, patates, síndria, carabassa, blat i remolatxa.", tag: TAG.HOME },
      { id: "a1_m2", text: "Construir la Granja de l’Alba", note: "Pollastres (ous) i vaques (llet).", tag: TAG.HOME },
      { id: "a1_m3", text: "Fer un pastís", note: "Fes-me un pastiset no noia?🍰", tag: TAG.MAIN },
      { id: "a1_m4", text: "Crear una plantació de bolets", note: "El Jardí Ombrívol", tag: TAG.HOME },
      { id: "a1_m5", text: "Cuinar sopa de bolets", note: "Sopeta reconfortant pal Adri 🍲", tag: TAG.MAIN },
    ],
  },
  {
    id: "acto2",
    title: "ACTE II — La Supervivent",
    desc: "Combat i Exploració. Demostra que pots sobreviure al caos.",
    titleUnlock: "Defensora del Refugi",
    unlockHint: "Completa l’Acte II per a desbloquejar l’Acte III.",
    missions: [
      { id: "a2_m1", text: "Fer-te un escut i aprendre a utilitzar-lo", note: "El temps val més que la força.", tag: TAG.DANGER },
      { id: "a2_m2", text: "Eliminar cada monstre bàsic", note: "Esquelet, aranya, aranya de cova, zombi i enderman.", tag: TAG.DANGER },
      { id: "a2_m3", text: "Aconseguir almenys 16 perles d’Ender", note: "Ves amb calma, costarà.", tag: TAG.DANGER },
      { id: "a2_m4", text: "Fer un arc i moltes fletxes", note: "No dispares als enderman (no funciona).", tag: TAG.DANGER },
      { id: "a2_m5", text: "Trobar una mina abandonada i saquejar-la", note: "Busca teranyines, rails i cofres.", tag: TAG.MAIN },
      { id: "a2_m6", text: "Enfrontar-te als ofegats i saquejar ruïnes submergides", note: "Extra: trident (molt difícil).", tag: TAG.DANGER },
      { id: "a2_m7", text: "Trobar un vaixell enfonsat i saquejar-lo", note: "Important: aconseguir el mapa del tresor.", tag: TAG.MAIN },
      { id: "a2_m8", text: "Seguir el mapa i trobar el cofre", note: "Porta una pala.", tag: TAG.MAIN },
      { id: "a2_m9", text: "Aconseguir un llop i posar-li nom amb una etiqueta", note: "Cal trobar l’etiqueta ;)", tag: TAG.HOME },
      { id: "a2_m10", text: "Aconseguir un gat i posar-li nom", note: "Els creepers tenen por dels gatets.", tag: TAG.HOME },
    ],
  },
  {
    id: "acto3",
    title: "ACTE III — La Mestra del Progrés",
    desc: "Farmeig i Preparació. Et prepares per a l’impossible.",
    titleUnlock: "Arquitecta del Destí",
    unlockHint: "Completa l’Acte III per a desbloquejar l’Acte IV.",
    missions: [
      { id: "a3_m1", text: "Fer-te tot l’equip de diamant i les armes", note: "Equip complet + eines/armes principals.", tag: TAG.MAIN },
      { id: "a3_m2", text: "Explorar portals del Nether destruïts i saquejar-los", note: "Compte amb la lava.", tag: TAG.DANGER },
      { id: "a3_m3", text: "Fer-te unes botes d’or", note: "Ho agrairàs ;)", tag: TAG.MAIN },
      { id: "a3_m4", text: "Aconseguir almenys 18 d’obsidiana i guardar-la bé", note: "No la perdes.", tag: TAG.MAIN },
      { id: "a3_m5", text: "Aconseguir molts llibres", note: "Robar o crear. Necessitaràs cuir i paper.", tag: TAG.MAIN },
      { id: "a3_m6", text: "Fer un encenedor i guardar-lo", note: "Molt important.", tag: TAG.MAIN },
      { id: "a3_m7", text: "Aconseguir molt lapislàtzuli", note: "Per a encantar sense límits.", tag: TAG.MAIN },
    ],
  },
  {
    id: "acto4",
    title: "ACTE IV — La Llar de l’Ànima",
    desc: "Construcció i Detalls. Que el món també siga bonic.",
    titleUnlock: "Guardiana de la Llar",
    unlockHint: "Completa l’Acte IV per a acabar la campanya.",
    missions: [
      { id: "a4_m1", text: "Construir una gran sala de cofres", note: "La pots fer sota terra.", tag: TAG.HOME },
      { id: "a4_m2", text: "Fer un llit rosa", note: "Perquè mola.", tag: TAG.HOME },
      { id: "a4_m3", text: "Fer un quadre i penjar-lo", note: "Que siga ben bonic 🖼️", tag: TAG.HOME },
    ],
  },
];

const RANKS = [
  { min: 0,   name: "Aprenenta" },
  { min: 15,  name: "Exploradora" },
  { min: 35,  name: "Aventurera" },
  { min: 60,  name: "Heroïna" },
  { min: 85,  name: "Llegenda" },
  { min: 100, name: "L’Escollida del Minecraft" },
];

/* =========================
   DOM
   ========================= */
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const pageFlip = document.getElementById("pageFlip");

const pageTitle = document.getElementById("pageTitle");
const pageIndicator = document.getElementById("pageIndicator");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

const totalText = document.getElementById("totalText");
const totalBar = document.getElementById("totalBar");
const countText = document.getElementById("countText");
const rankText = document.getElementById("rankText");

const btnReward = document.getElementById("btnReward");
const rewardHint = document.getElementById("rewardHint");

const btnReset = document.getElementById("btnReset");
const btnToggleSound = document.getElementById("btnToggleSound");
const toast = document.getElementById("toast");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");
const modalBody = document.getElementById("modalBody");

// Confeti layer (necessita <div id="confettiLayer"> en l’HTML)
const confettiLayer = document.getElementById("confettiLayer");

/* =========================
   State
   ========================= */
let state = loadState();       // { missionId: boolean }
let settings = loadSettings(); // { sound: boolean }
let currentIndex = loadPageIndex(); // 0 = pròleg, 1..n = actes

applySoundButton();

/* =========================
   Audio (sense arxius)
   ========================= */
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(()=>{});
}

function beep({freq=880, dur=0.08, type="square", vol=0.06} = {}) {
  if (!settings.sound) return;
  try {
    ensureAudio();
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch {}
}

function completeSound() {
  beep({freq: 988, dur: 0.06, type:"square", vol: 0.06});
  setTimeout(() => beep({freq: 1319, dur: 0.07, type:"square", vol: 0.06}), 70);
}

function unlockSound() {
  beep({freq: 659, dur: 0.07, type:"square", vol: 0.06});
  setTimeout(() => beep({freq: 784, dur: 0.08, type:"square", vol: 0.06}), 85);
  setTimeout(() => beep({freq: 1047, dur: 0.09, type:"square", vol: 0.06}), 180);
}

/* =========================
   Unlock logic
   ========================= */
function isActComplete(act) {
  return act.missions.every(m => !!state[m.id]);
}

function isActUnlocked(actIndex1based) {
  if (actIndex1based === 1) return true;
  return isActComplete(DATA[actIndex1based - 2]);
}

/* =========================
   Pàgines
   ========================= */
function totalPages() {
  return 1 + DATA.length; // 0: pròleg, 1..n: actes
}

function clampPageIndex(i) {
  if (i < 0) return 0;
  const max = totalPages() - 1;
  if (i > max) return max;
  return i;
}

function getRankName(pct) {
  let current = RANKS[0].name;
  for (const r of RANKS) if (pct >= r.min) current = r.name;
  return current;
}

function getTotalProgress() {
  const all = DATA.flatMap(a => a.missions);
  const total = all.length;
  const done = all.filter(m => !!state[m.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

/* =========================
   Render del llibre
   ========================= */
function renderBook() {
  currentIndex = clampPageIndex(currentIndex);
  savePageIndex(currentIndex);

  const max = totalPages();
  pageIndicator.textContent = `${currentIndex + 1} / ${max}`;

  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = !canGoNext();

  if (currentIndex === 0) {
    pageTitle.textContent = "Pròleg";
    leftPage.innerHTML = renderPrologueLeft();
    rightPage.innerHTML = renderPrologueRight();
  } else {
    const act = DATA[currentIndex - 1];
    const unlocked = isActUnlocked(currentIndex);

    pageTitle.textContent = act.title;
    leftPage.innerHTML = renderActLeft(act, currentIndex, unlocked);
    rightPage.innerHTML = renderActRight(act, currentIndex, unlocked);

    wireMissionHandlers(unlocked);
  }

  updateHUD();
}

function renderPrologueLeft() {
  return `
    <h2>📜 Pròleg</h2>
    <p>
      En un món cúbic ple de perills i meravelles, naix una aventurera destinada a crear vida,
      protegir la llar i conquistar dimensions impossibles.
    </p>
    <hr />
    <p>
      Tu seràs el seu cronista… i la seua recompensa final. 💌
    </p>
    <hr />
    <p>
      <strong>Com funciona:</strong><br />
      • Marca missions per a avançar.<br />
      • Els actes es desbloquegen en ordre.<br />
      • Al 100% es desbloqueja la recompensa.
    </p>
  `;
}

function renderPrologueRight() {
  const t = getTotalProgress();
  return `
    <h2>🧭 Estat del viatge</h2>
    <p><strong>Missions completades:</strong> ${t.done} / ${t.total}</p>
    <p><strong>Progrés total:</strong> ${t.pct}%</p>
    <p><strong>Rang actual:</strong> ${escapeHtml(getRankName(t.pct))}</p>
    <hr />
    <p>
      <strong>Consell:</strong><br />
      Entra en l’Acte I i comença per l’hort. Una bona llar ho canvia tot.
    </p>
  `;
}

function renderActLeft(act, actIndex1based, unlocked) {
  const totalM = act.missions.length;
  const doneM = act.missions.filter(m => !!state[m.id]).length;
  const pct = totalM ? Math.round((doneM / totalM) * 100) : 0;

  if (!unlocked) {
    return `
      <h2>🔒 Acte bloquejat</h2>
      <div class="locked-box">
        <div class="lock-title">DESBLOQUEIG</div>
        <div>${escapeHtml(DATA[actIndex1based - 2]?.unlockHint ?? "Completa l’acte anterior.")}</div>
      </div>
      <hr />
      <p>
        Quan completes l’acte anterior, podràs llegir i marcar les missions ací.
      </p>
    `;
  }

  return `
    <h2>📘 ${escapeHtml(act.titleUnlock)}</h2>
    <p>${escapeHtml(act.desc)}</p>
    <hr />
    <p><strong>Progrés de l’acte:</strong> ${doneM} / ${totalM} (${pct}%)</p>
    <p><strong>Recompensa de l’acte:</strong> Si completes tot, obtens el títol.</p>
    <hr />
    <p>
      <strong>Nota del cronista:</strong><br />
      Marca cada missió quan la completes. Amb calma… però èpic.
    </p>
  `;
}

function renderActRight(act, actIndex1based, unlocked) {
  if (!unlocked) {
    return `
      <h2>📌 Pista</h2>
      <p>
        Completa l’acte anterior per a desbloquejar este capítol.
      </p>
      <hr />
      <p>
        Si vols, torna arrere amb ◀ i revisa què et falta.
      </p>
    `;
  }

  const items = act.missions.map(m => {
    const checked = !!state[m.id];
    const cls = [
      "mission",
      checked ? "done" : "",
      m.tag === TAG.DANGER ? "danger" : "",
      m.tag === TAG.HOME ? "home" : "",
    ].filter(Boolean).join(" ");

    return `
      <li class="${cls}" data-mission="${m.id}">
        <input class="chk" type="checkbox" id="${m.id}" ${checked ? "checked" : ""} />
        <div class="mission-text">
          <label for="${m.id}">${escapeHtml(m.text)}</label>
          ${m.note ? `<span class="note">${escapeHtml(m.note)}</span>` : ""}
        </div>
      </li>
    `;
  }).join("");

  return `
    <h2>✅ Missions</h2>
    <ul class="missions">${items}</ul>
  `;
}

function wireMissionHandlers(unlocked) {
  if (!unlocked) return;

  const checkboxes = rightPage.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(chk => {
    chk.addEventListener("change", () => {
      const missionId = chk.id;
      const li = rightPage.querySelector(`[data-mission="${CSS.escape(missionId)}"]`);

      const beforeActComplete = isActComplete(DATA[currentIndex - 1]);
      const beforeNextUnlocked = canGoToIndex(currentIndex + 1);

      state[missionId] = chk.checked;
      saveState(state);

      if (li) {
        li.classList.toggle("done", chk.checked);
        if (chk.checked) {
          li.classList.add("pop");
          setTimeout(() => li.classList.remove("pop"), 260);
        }
      }

      if (chk.checked) {
        completeSound();
        showToast("✅ Missió completada");
      } else {
        beep({freq: 220, dur: 0.05, type:"square", vol: 0.04});
        showToast("↩️ Missió desmarcada");
      }

      const afterActComplete = isActComplete(DATA[currentIndex - 1]);
      if (!beforeActComplete && afterActComplete) {
        unlockSound();
        showToast(`🎖️ Títol obtingut: ${DATA[currentIndex - 1].titleUnlock}`);
        fireConfetti({ amount: 110 });
      }

      const afterNextUnlocked = canGoToIndex(currentIndex + 1);
      if (!beforeNextUnlocked && afterNextUnlocked) {
        unlockSound();
        showToast("🔓 Acte següent desbloquejat");
      }

      const total = getTotalProgress();
      if (chk.checked && total.pct === 100) {
        unlockSound();
        showToast("🏆 Campanya completada! Recompensa desbloquejada.");
        fireConfetti({ amount: 180, durationMin: 1100, durationMax: 1900 });
      }

      renderBook();
    });
  });
}

function canGoToIndex(index) {
  const max = totalPages() - 1;
  if (index < 0 || index > max) return false;
  if (index === 0) return true;
  return isActUnlocked(index);
}

function canGoNext() {
  return canGoToIndex(currentIndex + 1);
}

/* =========================
   Navegació + animació
   ========================= */
function animateFlipAndRender(nextIndex) {
  pageFlip.classList.remove("flipping");
  void pageFlip.offsetWidth;
  pageFlip.classList.add("flipping");

  setTimeout(() => {
    currentIndex = nextIndex;
    renderBook();
  }, 210);

  setTimeout(() => {
    pageFlip.classList.remove("flipping");
  }, 450);
}

btnPrev.addEventListener("click", () => {
  if (currentIndex <= 0) return;
  animateFlipAndRender(currentIndex - 1);
});

btnNext.addEventListener("click", () => {
  const target = currentIndex + 1;
  if (!canGoToIndex(target)) {
    showToast("🔒 Encara no pots avançar");
    return;
  }
  animateFlipAndRender(target);
});

/* =========================
   HUD
   ========================= */
function updateHUD() {
  const t = getTotalProgress();
  totalText.textContent = `${t.pct}%`;
  totalBar.style.width = `${t.pct}%`;
  countText.textContent = `${t.done} / ${t.total}`;
  rankText.textContent = getRankName(t.pct);

  const unlocked = t.pct === 100;
  btnReward.disabled = !unlocked;
  btnReward.textContent = unlocked ? "🏆 Recompensa" : "🏆 Recompensa 🔒";
  rewardHint.textContent = unlocked
    ? "Desbloquejada! Obri-la quan vulgues 💌"
    : "Completa el 100% per a desbloquejar la recompensa final.";

  if (currentIndex > 0 && !isActUnlocked(currentIndex)) {
    let back = currentIndex;
    while (back > 0 && !isActUnlocked(back)) back--;
    currentIndex = back;
    savePageIndex(currentIndex);
  }

  btnNext.disabled = !canGoNext();
}

/* =========================
   Recompensa final (Modal)
   ========================= */
btnReward.addEventListener("click", () => {
  const t = getTotalProgress();
  if (t.pct !== 100) return;

  openModal(`
    <p class="big">🏆 Recompensa Final — “L’Escollida del Minecraft”</p>
    <p>
      Has completat tot el diari. El teu món és viu, la teua llar és preciosa
      i la teua aventura ja és llegenda.
    </p>
    <p>
      <strong>La teua recompensa:</strong><br>
      • Una cita especial, ja decidirem el que jujuju.<br>
      • Un missatge bonic escrit pel teu cronista<br>
      • I el dret a demanar una “Missió Extra” quan vulgues o altra campanya 😏
    </p>
    <p style="margin-top:12px;color:rgba(233,238,245,0.55);font-size:12px;">
    </p>
  `);
});

/* =========================
   Reinici
   ========================= */
btnReset.addEventListener("click", () => {
  openModal(`
    <p class="big">♻ Reiniciar progrés</p>
    <p>Segur que vols reiniciar totes les missions? S’esborrarà el progrés guardat en este dispositiu.</p>
    <div style="display:flex;gap:10px;margin-top:14px;">
      <button class="btn ghost" id="cancelReset" type="button">Cancel·lar</button>
      <button class="btn" id="confirmReset" type="button" style="border-color:rgba(255,107,107,0.35);">
        Sí, reinicia
      </button>
    </div>
  `);

  const cancel = document.getElementById("cancelReset");
  const confirm = document.getElementById("confirmReset");

  cancel.addEventListener("click", closeModal);
  confirm.addEventListener("click", () => {
    state = {};
    saveState(state);
    beep({freq: 180, dur: 0.08, type:"square", vol: 0.05});
    showToast("♻ Progrés reiniciat.");
    closeModal();
    currentIndex = 0;
    savePageIndex(currentIndex);
    renderBook();
  });
});

/* =========================
   Toggle so
   ========================= */
btnToggleSound.addEventListener("click", () => {
  settings.sound = !settings.sound;
  saveSettings(settings);
  applySoundButton();
  showToast(settings.sound ? "🔊 So activat" : "🔇 So desactivat");
  if (settings.sound) beep({freq: 660, dur: 0.07, type:"square", vol: 0.05});
});

function applySoundButton() {
  btnToggleSound.textContent = settings.sound ? "🔊 So: ACTIVAT" : "🔇 So: DESACTIVAT";
  btnToggleSound.setAttribute("aria-pressed", settings.sound ? "true" : "false");
}

/* =========================
   Toast
   ========================= */
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* =========================
   Modal
   ========================= */
function openModal(html) {
  modalBody.innerHTML = html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.dataset && t.dataset.close === "true") closeModal();
});

/* =========================
   Confeti pixel
   ========================= */
function fireConfetti({ amount = 90, durationMin = 900, durationMax = 1500 } = {}) {
  if (!confettiLayer) return;

  // Neteja confeti anterior
  confettiLayer.innerHTML = "";

  // Paleta “Minecraft-ish”
  const colors = [
    "#7bd88f", "#8ab4ff", "#ffcc66", "#ff6b6b",
    "#e9eef5", "#caa6ff", "#66ffd6"
  ];

  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";

    const size = randInt(8, 12);
    const left = Math.random() * vw;

    const dur = randInt(durationMin, durationMax) / 1000; // segons
    const delay = Math.random() * 0.25;

    const drift = randInt(-140, 140);
    const spin = randInt(180, 720) * (Math.random() > 0.5 ? 1 : -1);

    piece.style.left = `${left}px`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.background = colors[randInt(0, colors.length - 1)];
    piece.style.animationDuration = `${dur}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--spin", `${spin}deg`);

    confettiLayer.appendChild(piece);
  }

  // Auto-neteja quan acaba
  const totalMs = durationMax + 400;
  setTimeout(() => {
    if (confettiLayer) confettiLayer.innerHTML = "";
  }, totalMs);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* =========================
   Storage
   ========================= */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? parsed : {};
  } catch { return {}; }
}
function saveState(obj) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch {}
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + "_settings");
    if (!raw) return { sound: true };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { sound: true };
    return { sound: parsed.sound !== false };
  } catch { return { sound: true }; }
}
function saveSettings(obj) {
  try { localStorage.setItem(STORAGE_KEY + "_settings", JSON.stringify(obj)); } catch {}
}

function loadPageIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + "_page");
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch { return 0; }
}
function savePageIndex(n) {
  try { localStorage.setItem(STORAGE_KEY + "_page", String(n)); } catch {}
}

/* =========================
   Utils
   ========================= */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   Init
   ========================= */
renderBook();
