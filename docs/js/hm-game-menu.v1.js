/*
 * Healing Mart Common Game Menu v1.0.0
 * 외부 라이브러리 없음
 */
(() => {
  "use strict";

  const STYLE_ID = "hmCommonGameMenuStyle";
  const ROOT_ID = "hmCommonGameMenuRoot";
  const HOME_URL = "https://www.healing-mart.com/";
  const GAME_HOME_URL = "https://www.healing-mart.com/search/label/%EB%AF%B8%EB%8B%88%EA%B2%8C%EC%9E%84";

  const state = { open: false, currentGameId: "" };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  function getCurrentGameId() {
    const explicit = document.querySelector("[data-current-game]");
    if (explicit?.dataset.currentGame) return explicit.dataset.currentGame.trim();

    const app = document.querySelector("[data-game-id]");
    if (app?.dataset.gameId) return app.dataset.gameId.trim();

    return "";
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}, #${ROOT_ID} * { box-sizing:border-box; }
      #${ROOT_ID} {
        --hm-bg:#f5f7fb;
        --hm-card:#fff;
        --hm-ink:#20263a;
        --hm-muted:#737d91;
        --hm-line:#e3e7ef;
        --hm-brand:#5b5ce2;
        --hm-brand-soft:#efefff;
        font-family:Pretendard,"Noto Sans KR","Apple SD Gothic Neo",system-ui,-apple-system,"Segoe UI",sans-serif;
        color:var(--hm-ink);
      }
      .hm-menu-backdrop {
        position:fixed; inset:0; z-index:2147483300;
        background:rgba(20,26,42,.48);
        opacity:0; visibility:hidden; pointer-events:none;
        transition:opacity .22s ease,visibility .22s ease;
      }
      .hm-menu-backdrop.is-open {
        opacity:1; visibility:visible; pointer-events:auto;
      }
      .hm-menu-sheet {
        position:fixed; left:0; right:0; bottom:0; z-index:2147483310;
        max-height:min(86dvh,760px);
        padding:8px 14px max(15px,env(safe-area-inset-bottom));
        border:1px solid var(--hm-line); border-bottom:0;
        border-radius:24px 24px 0 0;
        background:var(--hm-card);
        box-shadow:0 -24px 70px rgba(23,31,54,.24);
        transform:translateY(104%);
        visibility:hidden;
        transition:transform .28s cubic-bezier(.22,.82,.31,1),visibility .28s;
        overflow:hidden;
      }
      .hm-menu-sheet.is-open { transform:translateY(0); visibility:visible; }
      .hm-menu-handle {
        width:42px; height:5px; margin:0 auto 8px;
        border-radius:999px; background:#d9dee8;
      }
      .hm-menu-head {
        min-height:56px; display:flex; align-items:center; justify-content:space-between;
        gap:12px; padding:4px 2px 11px; border-bottom:1px solid #edf0f4;
      }
      .hm-menu-brand small {
        display:block; color:var(--hm-brand);
        font-size:10px; font-weight:900;
      }
      .hm-menu-brand h2 {
        margin:2px 0 0; font-size:18px; line-height:1.25; letter-spacing:-.025em;
      }
      .hm-menu-close {
        flex:0 0 40px; width:40px; height:40px;
        border:1px solid var(--hm-line); border-radius:12px;
        background:#f8f9fc; color:#4c566c; cursor:pointer; font-size:18px;
      }
      .hm-menu-scroll {
        max-height:calc(min(86dvh,760px) - 76px);
        padding:14px 1px 4px; overflow:auto; overscroll-behavior:contain;
      }
      .hm-menu-section + .hm-menu-section { margin-top:20px; }
      .hm-menu-section-title {
        display:flex; align-items:center; gap:7px;
        margin:0 0 9px; font-size:13px; font-weight:950;
      }
      .hm-menu-grid {
        display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px;
      }
      .hm-menu-card {
        position:relative; min-width:0; min-height:92px;
        padding:13px; display:flex; align-items:flex-start; gap:10px;
        color:var(--hm-ink); text-decoration:none;
        border:1px solid var(--hm-line); border-radius:15px;
        background:#fff; box-shadow:0 5px 16px rgba(35,48,85,.055);
        transition:transform .16s ease,border-color .16s ease,background .16s ease;
      }
      .hm-menu-card:hover {
        transform:translateY(-1px); border-color:#bfc1f4; background:#fbfbff;
      }
      .hm-menu-card.is-current {
        border-color:#8c8ded; background:var(--hm-brand-soft); pointer-events:none;
      }
      .hm-menu-icon {
        flex:0 0 38px; width:38px; height:38px;
        display:grid; place-items:center; border-radius:12px;
        background:#f1f2f7; font-size:20px;
      }
      .hm-menu-copy { min-width:0; }
      .hm-menu-copy strong {
        display:block; overflow:hidden; font-size:12px; line-height:1.35;
        font-weight:950; text-overflow:ellipsis; white-space:nowrap;
      }
      .hm-menu-copy small {
        display:-webkit-box; margin-top:5px; overflow:hidden;
        color:var(--hm-muted); font-size:9px; line-height:1.4;
        -webkit-line-clamp:2; -webkit-box-orient:vertical;
      }
      .hm-menu-badge {
        position:absolute; right:8px; top:8px;
        padding:3px 6px; border-radius:999px;
        color:#fff; background:var(--hm-brand);
        font-size:8px; font-weight:950;
      }
      .hm-menu-links {
        display:grid; grid-template-columns:1fr 1fr; gap:8px;
        margin-top:20px; padding-top:14px; border-top:1px solid #edf0f4;
      }
      .hm-menu-link {
        min-height:46px; display:flex; align-items:center; justify-content:center;
        gap:6px; color:#424c62; text-decoration:none;
        border:1px solid var(--hm-line); border-radius:13px;
        background:#f8f9fc; font-size:11px; font-weight:900;
      }
      .hm-menu-empty {
        padding:30px 15px; color:var(--hm-muted); text-align:center; font-size:12px;
      }
      body.hm-game-menu-open { overflow:hidden !important; }

      @media (min-width:720px) {
        .hm-menu-sheet {
          left:50%; right:auto; width:min(620px,100%);
          transform:translate(-50%,104%);
        }
        .hm-menu-sheet.is-open { transform:translate(-50%,0); }
        .hm-menu-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
      }
      @media (max-width:380px) {
        .hm-menu-grid { grid-template-columns:1fr; }
      }
      @media (prefers-reduced-motion:reduce) {
        .hm-menu-backdrop,.hm-menu-sheet,.hm-menu-card { transition:none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function getPublishedGames() {
    const games = Array.isArray(window.HM_GAMES) ? window.HM_GAMES : [];
    return games
      .filter((game) => game && game.status === "published" && game.id && game.title && game.url)
      .slice()
      .sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999));
  }

  function getCategories() {
    return Array.isArray(window.HM_GAME_CATEGORIES) ? window.HM_GAME_CATEGORIES : [];
  }

  function createCard(game) {
    const isCurrent = game.id === state.currentGameId;
    const badge = isCurrent
      ? '<span class="hm-menu-badge">현재 게임</span>'
      : game.isNew
        ? '<span class="hm-menu-badge">NEW</span>'
        : "";

    return `
      <a class="hm-menu-card${isCurrent ? " is-current" : ""}"
         href="${escapeHtml(game.url)}"
         ${isCurrent ? 'aria-current="page" tabindex="-1"' : ""}>
        ${badge}
        <span class="hm-menu-icon" aria-hidden="true">${escapeHtml(game.icon || "🎮")}</span>
        <span class="hm-menu-copy">
          <strong>${escapeHtml(game.shortTitle || game.title)}</strong>
          <small>${escapeHtml(game.description || "")}</small>
        </span>
      </a>
    `;
  }

  function render() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;

    const games = getPublishedGames();
    const categories = getCategories();

    const sections = categories.map((category) => {
      const categoryGames = games.filter((game) => game.category === category.id);
      if (!categoryGames.length) return "";

      return `
        <section class="hm-menu-section">
          <h3 class="hm-menu-section-title">
            <span aria-hidden="true">${escapeHtml(category.icon || "🎮")}</span>
            <span>${escapeHtml(category.title)}</span>
          </h3>
          <div class="hm-menu-grid">${categoryGames.map(createCard).join("")}</div>
        </section>
      `;
    }).join("");

    root.innerHTML = `
      <div class="hm-menu-backdrop" data-hm-menu-close></div>
      <section class="hm-menu-sheet" role="dialog" aria-modal="true"
               aria-labelledby="hmCommonGameMenuTitle">
        <div class="hm-menu-handle" aria-hidden="true"></div>
        <header class="hm-menu-head">
          <div class="hm-menu-brand">
            <small>Healing-mart.com</small>
            <h2 id="hmCommonGameMenuTitle">다른 미니게임</h2>
          </div>
          <button class="hm-menu-close" type="button"
                  data-hm-menu-close aria-label="게임 목록 닫기">×</button>
        </header>

        <div class="hm-menu-scroll">
          ${sections || '<div class="hm-menu-empty">등록된 게임이 없습니다.</div>'}
          <div class="hm-menu-links">
            <a class="hm-menu-link" href="${GAME_HOME_URL}">🎮 게임 모음</a>
            <a class="hm-menu-link" href="${HOME_URL}">🏠 Healing Mart</a>
          </div>
        </div>
      </section>
    `;
  }

  function getParts() {
    const root = document.getElementById(ROOT_ID);
    return {
      backdrop: root?.querySelector(".hm-menu-backdrop"),
      sheet: root?.querySelector(".hm-menu-sheet"),
      closeButton: root?.querySelector(".hm-menu-close")
    };
  }

  function openMenu() {
    const { backdrop, sheet, closeButton } = getParts();
    if (!backdrop || !sheet) return;

    state.open = true;
    backdrop.classList.add("is-open");
    sheet.classList.add("is-open");
    document.body.classList.add("hm-game-menu-open");
    window.setTimeout(() => closeButton?.focus(), 50);
  }

  function closeMenu() {
    const { backdrop, sheet } = getParts();
    if (!backdrop || !sheet) return;

    state.open = false;
    backdrop.classList.remove("is-open");
    sheet.classList.remove("is-open");
    document.body.classList.remove("hm-game-menu-open");
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-hm-game-menu-open]");
      if (openButton) {
        event.preventDefault();
        openMenu();
        return;
      }

      if (event.target.closest("[data-hm-menu-close]")) {
        event.preventDefault();
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.open) closeMenu();
    });
  }

  function init() {
    if (document.getElementById(ROOT_ID)) return;

    state.currentGameId = getCurrentGameId();
    injectStyle();

    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("data-hm-common-menu", "v1");
    document.body.appendChild(root);

    render();
    bind();
  }

  window.HMGameMenu = Object.freeze({
    open: openMenu,
    close: closeMenu,
    refresh() {
      state.currentGameId = getCurrentGameId();
      render();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
