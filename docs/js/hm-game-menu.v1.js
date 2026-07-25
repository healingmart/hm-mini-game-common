/*
 * Healing Mart Common Game Menu v1.5.0
 * 빠른 하단 메뉴, 게임 찾기 바텀시트, SNS 공유 패널
 * 외부 UI 라이브러리 없음
 */
(() => {
  "use strict";

  const STYLE_ID = "hmCommonGameMenuStyle";
  const ROOT_ID = "hmCommonGameMenuRoot";
  const BODY_OPEN_CLASS = "hm-game-menu-open";

  const inputConfig =
    window.HM_GAME_MENU_CONFIG &&
    typeof window.HM_GAME_MENU_CONFIG === "object"
      ? window.HM_GAME_MENU_CONFIG
      : {};

  const CONFIG = Object.freeze({
    homeUrl:
      inputConfig.homeUrl ||
      "https://www.healing-mart.com/",

    gameHubUrl:
      inputConfig.gameHubUrl ||
      "https://www.healing-mart.com/search/label/%EB%AF%B8%EB%8B%88%EA%B2%8C%EC%9E%84",

    guideUrl:
      inputConfig.guideUrl ||
      "https://www.healing-mart.com/p/service-guide.html",

    qnaUrl:
      inputConfig.qnaUrl ||
      "https://www.healing-mart.com/p/qna.html",

    kakaoJavaScriptKey:
      inputConfig.kakaoJavaScriptKey ||
      "a6897bdb5b7785b0ffbe542d81886b93",

    kakaoSdkUrl:
      inputConfig.kakaoSdkUrl ||
      "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
  });

  const state = {
    panel: "",
    currentGameId: "",
    category: "all",
    query: "",
    onlyNew: false,
    returnFocus: null,
    kakaoPromise: null,
    moreShareOpen: false
  };

  const SVG_NS = "http://www.w3.org/2000/svg";

  const ICONS = Object.freeze({
    home: {
      viewBox: "0 0 24 24",
      shapes: [
        ["path", { d: "M3 11.5 12 4l9 7.5" }],
        ["path", { d: "M5.5 10.5V20h13v-9.5" }],
        ["path", { d: "M9.5 20v-6h5v6" }]
      ]
    },
    search: {
      viewBox: "0 0 24 24",
      shapes: [
        ["circle", { cx: "11", cy: "11", r: "7" }],
        ["path", { d: "m16.5 16.5 4 4" }]
      ]
    },
    sparkles: {
      viewBox: "0 0 24 24",
      shapes: [
        ["path", { d: "M12 3l1.2 3.2L16.5 7.5l-3.3 1.3L12 12l-1.2-3.2-3.3-1.3 3.3-1.3L12 3Z" }],
        ["path", { d: "M18.5 13l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" }],
        ["path", { d: "M6 13.5l.7 1.8 1.8.7-1.8.7L6 18.5l-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" }]
      ]
    },
    grid: {
      viewBox: "0 0 24 24",
      shapes: [
        ["rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }],
        ["rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }],
        ["rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }],
        ["rect", { x: "14", y: "14", width: "6", height: "6", rx: "1" }]
      ]
    },
    share: {
      viewBox: "0 0 24 24",
      shapes: [
        ["circle", { cx: "18", cy: "5", r: "3" }],
        ["circle", { cx: "6", cy: "12", r: "3" }],
        ["circle", { cx: "18", cy: "19", r: "3" }],
        ["path", { d: "m8.7 10.7 6.6-4.1M8.7 13.3l6.6 4.1" }]
      ]
    },
    close: {
      viewBox: "0 0 24 24",
      shapes: [["path", { d: "M6 6l12 12M18 6 6 18" }]]
    },
    chevron: {
      viewBox: "0 0 24 24",
      shapes: [["path", { d: "m9 6 6 6-6 6" }]]
    },
    flag: {
      viewBox: "0 0 24 24",
      shapes: [
        ["path", { d: "M5 21V4" }],
        ["path", { d: "M6 5c4-3 8 3 12 0v9c-4 3-8-3-12 0" }]
      ]
    },
    dice: {
      viewBox: "0 0 24 24",
      shapes: [
        ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "4" }],
        ["circle", { cx: "9", cy: "9", r: "1" }],
        ["circle", { cx: "15", cy: "15", r: "1" }],
        ["circle", { cx: "15", cy: "9", r: "1" }],
        ["circle", { cx: "9", cy: "15", r: "1" }]
      ]
    },
    quiz: {
      viewBox: "0 0 24 24",
      shapes: [
        ["circle", { cx: "12", cy: "12", r: "9" }],
        ["path", { d: "M9.7 9.2A2.7 2.7 0 0 1 12.2 7.5c1.7 0 3 1 3 2.5 0 2-2.6 2.2-2.6 4" }],
        ["path", { d: "M12.5 17.5h.01" }]
      ]
    },
    puzzle: {
      viewBox: "0 0 24 24",
      shapes: [
        ["path", { d: "M9 4h3a2.5 2.5 0 1 1 5 0h3v5a2.5 2.5 0 1 0 0 5v6h-6a2.5 2.5 0 1 1-5 0H4v-5a2.5 2.5 0 1 0 0-5V4h5Z" }]
      ]
    },
    bolt: {
      viewBox: "0 0 24 24",
      shapes: [["path", { d: "M13 2 5 14h6l-1 8 9-13h-6V2Z" }]]
    },
    copy: {
      viewBox: "0 0 24 24",
      shapes: [
        ["rect", { x: "8", y: "7", width: "12", height: "14", rx: "2" }],
        ["path", { d: "M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2" }]
      ]
    },
    report: {
      viewBox: "0 0 24 24",
      shapes: [
        ["path", { d: "M12 3 3 19h18L12 3Z" }],
        ["path", { d: "M12 9v4" }],
        ["path", { d: "M12 17h.01" }]
      ]
    },
    guide: {
      viewBox: "0 0 24 24",
      shapes: [
        ["path", { d: "M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" }],
        ["path", { d: "M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" }]
      ]
    }
  });

  const SOCIAL_ICONS = Object.freeze({
    kakao: {
      viewBox: "0 0 24 24",
      path: "M12 3C6.5 3 2 6.6 2 11c0 2.9 1.9 5.4 4.7 6.8-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.7.1 1.3.2 2 .2 5.5 0 10-3.6 10-8S17.5 3 12 3z"
    },
    naver: {
      viewBox: "0 0 24 24",
      path: "M16.3 12.6 7.7 0H0v24h7.7V11.4L16.3 24H24V0h-7.7v12.6z"
    },
    facebook: {
      viewBox: "0 0 24 24",
      path: "M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3.1V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"
    },
    x: {
      viewBox: "0 0 24 24",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },
    threads: {
      viewBox: "0 0 192 192",
      path: "M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202.195148 97.0695 0H96.9569C68.8816.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96l.0007.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192h.1126C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"
    },
    more: {
      viewBox: "0 0 24 24",
      circles: [["5", "12"], ["12", "12"], ["19", "12"]]
    },
    band: {
      viewBox: "0 0 24 24",
      path: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 12h-4v4h-2v-4H7v-2h4V8h2v4h4v2z"
    },
    telegram: {
      viewBox: "0 0 24 24",
      path: "M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
    }
  });

  function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined) {
      element.textContent = String(options.text);
    }

    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        if (value === undefined || value === null || value === false) {
          return;
        }

        element.setAttribute(key, value === true ? "" : String(value));
      });
    }

    if (options.dataset) {
      Object.entries(options.dataset).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          element.dataset[key] = String(value);
        }
      });
    }

    return element;
  }

  function append(parent, ...children) {
    children.flat().forEach((child) => {
      if (child) {
        parent.appendChild(child);
      }
    });
    return parent;
  }

  function makeIcon(name, className = "") {
    const definition = ICONS[name] || ICONS.grid;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", definition.viewBox);
    svg.setAttribute("aria-hidden", "true");

    if (className) {
      svg.setAttribute("class", className);
    }

    definition.shapes.forEach(([tag, attrs]) => {
      const shape = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([key, value]) => {
        shape.setAttribute(key, value);
      });
      svg.appendChild(shape);
    });

    return svg;
  }

  function makeSocialIcon(name) {
    const definition = SOCIAL_ICONS[name];
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", definition.viewBox);
    svg.setAttribute("aria-hidden", "true");

    if (definition.path) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", definition.path);
      svg.appendChild(path);
    }

    if (definition.circles) {
      definition.circles.forEach(([cx, cy]) => {
        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", "2");
        svg.appendChild(circle);
      });
    }

    return svg;
  }

  function normalizeUrl(value) {
    try {
      const parsed = new URL(value, window.location.href);
      parsed.hash = "";
      parsed.search = "";

      const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
      let path = decodeURIComponent(parsed.pathname).replace(/\/+$/, "");
      path = path.toLowerCase();

      return `${host}${path}`;
    } catch (error) {
      return String(value || "")
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split(/[?#]/)[0]
        .replace(/\/+$/, "")
        .toLowerCase();
    }
  }

  function appendQuery(url, values) {
    try {
      const parsed = new URL(url, window.location.href);
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          parsed.searchParams.set(key, String(value));
        }
      });
      return parsed.href;
    } catch (error) {
      return url;
    }
  }

  function getPublishedGames() {
    const games = Array.isArray(window.HM_GAMES)
      ? window.HM_GAMES
      : [];

    return games
      .filter((game) =>
        game &&
        game.status === "published" &&
        game.id &&
        game.title &&
        game.url
      )
      .slice()
      .sort((a, b) =>
        (Number(a.order) || 9999) -
        (Number(b.order) || 9999)
      );
  }

  function getCategories() {
    return Array.isArray(window.HM_GAME_CATEGORIES)
      ? window.HM_GAME_CATEGORIES
      : [];
  }

  function getCategoryMap() {
    return new Map(
      getCategories().map((category) => [category.id, category])
    );
  }

  function getCurrentGameId() {
    const explicit = document.querySelector("[data-current-game]");
    if (explicit?.dataset.currentGame) {
      return explicit.dataset.currentGame.trim();
    }

    const app = document.querySelector("[data-game-id]");
    if (app?.dataset.gameId) {
      return app.dataset.gameId.trim();
    }

    const currentUrl = normalizeUrl(window.location.href);
    const match = getPublishedGames().find(
      (game) => normalizeUrl(game.url) === currentUrl
    );

    return match?.id || "";
  }

  function getCurrentGame() {
    return getPublishedGames().find(
      (game) => game.id === state.currentGameId
    ) || null;
  }

  function getQnaUrl() {
    const game = getCurrentGame();
    return appendQuery(CONFIG.qnaUrl, {
      type: "game",
      game: state.currentGameId,
      title:
        game?.title ||
        game?.shortTitle ||
        document.title ||
        "",
      page: window.location.href
    });
  }

  function updateExternalLinks() {
    document.querySelectorAll("[data-hm-game-qna]").forEach((link) => {
      link.href = getQnaUrl();
    });
  }

  function updateTitleCaptions() {
    document
      .querySelectorAll("[data-hm-game-menu-open]")
      .forEach((trigger) => {
        const caption =
          trigger.querySelector("[data-hm-game-menu-caption]") ||
          trigger.querySelector("small");

        if (caption) {
          caption.textContent = "게임 더보기 · 공유";
        }
      });
  }

  function categoryIconName(categoryId) {
    if (categoryId === "party-random") {
      return "dice";
    }
    if (categoryId === "word-quiz") {
      return "quiz";
    }
    if (categoryId === "puzzle-strategy") {
      return "puzzle";
    }
    if (categoryId === "reaction-timing") {
      return "bolt";
    }
    return "grid";
  }

  function getFilteredGames() {
    const query = state.query
      .trim()
      .toLocaleLowerCase("ko-KR");

    return getPublishedGames().filter((game) => {
      if (state.onlyNew && !game.isNew) {
        return false;
      }

      if (
        state.category !== "all" &&
        game.category !== state.category
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text = [
        game.title,
        game.shortTitle,
        game.description
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko-KR");

      return text.includes(query);
    });
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID},
      #${ROOT_ID} * {
        box-sizing:border-box;
      }

      #${ROOT_ID} {
        --hm-bg:#ffffff;
        --hm-surface:#f7f9fc;
        --hm-line:#dfe6ef;
        --hm-text:#17233b;
        --hm-muted:#6c788d;
        --hm-brand:#2f75df;
        --hm-brand-dark:#1f5ebc;
        --hm-brand-soft:#eaf3ff;
        --hm-danger:#d74b61;
        --hm-shadow:0 18px 54px rgba(15,23,42,.22);

        color:var(--hm-text);
        font-family:
          Pretendard,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          "Noto Sans KR",
          Arial,
          sans-serif;
        font-size:16px;
        line-height:1.5;
        word-break:keep-all;
        -webkit-font-smoothing:antialiased;
        text-rendering:optimizeLegibility;
      }

      #${ROOT_ID} button,
      #${ROOT_ID} input {
        font:inherit;
      }

      #${ROOT_ID} button,
      #${ROOT_ID} a {
        -webkit-tap-highlight-color:transparent;
      }

      .hm-game-backdrop {
        position:fixed;
        inset:0;
        z-index:2147483200;
        background:rgba(15,23,42,.48);
        -webkit-backdrop-filter:blur(3px);
        backdrop-filter:blur(3px);
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        transition:opacity .2s ease,visibility .2s ease;
      }

      .hm-game-backdrop.is-open {
        opacity:1;
        visibility:visible;
        pointer-events:auto;
      }

      .hm-game-sheet,
      .hm-share-sheet {
        position:fixed;
        left:50%;
        bottom:0;
        z-index:2147483210;
        width:min(760px,100%);
        max-height:min(88dvh,780px);
        display:grid;
        grid-template-rows:auto minmax(0,1fr);
        overflow:hidden;
        border:1px solid rgba(203,213,225,.95);
        border-bottom:0;
        border-radius:26px 26px 0 0;
        background:rgba(255,255,255,.98);
        -webkit-backdrop-filter:blur(18px);
        backdrop-filter:blur(18px);
        box-shadow:var(--hm-shadow);
        transform:translate(-50%,104%);
        visibility:hidden;
        transition:
          transform .28s cubic-bezier(.22,.82,.31,1),
          visibility .28s;
      }

      .hm-game-sheet.is-open,
      .hm-share-sheet.is-open {
        transform:translate(-50%,0);
        visibility:visible;
      }

      .hm-sheet-top {
        min-width:0;
        padding:8px 14px 0;
        background:rgba(255,255,255,.96);
      }

      .hm-sheet-handle {
        width:48px;
        height:5px;
        margin:0 auto 7px;
        border-radius:999px;
        background:#d3dce8;
      }

      .hm-sheet-head {
        min-height:61px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:3px 2px 11px;
      }

      .hm-sheet-title-wrap {
        min-width:0;
        display:flex;
        align-items:center;
        gap:11px;
      }

      .hm-sheet-title-icon {
        flex:0 0 42px;
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        color:#ffffff;
        border-radius:14px;
        background:linear-gradient(145deg,#5b9df2,#2f75df);
        box-shadow:0 7px 18px rgba(47,117,223,.22);
      }

      .hm-sheet-title-icon svg {
        width:23px;
        height:23px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-sheet-title-copy {
        min-width:0;
      }

      .hm-sheet-title-copy h2 {
        margin:0;
        overflow:hidden;
        color:var(--hm-text);
        font-size:19px;
        line-height:1.2;
        font-weight:850;
        letter-spacing:-.035em;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .hm-sheet-title-copy p {
        margin:3px 0 0;
        overflow:hidden;
        color:var(--hm-muted);
        font-size:11px;
        line-height:1.35;
        font-weight:650;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .hm-sheet-close {
        flex:0 0 42px;
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        padding:0;
        color:#526078;
        border:1px solid var(--hm-line);
        border-radius:13px;
        background:#f7f9fc;
        cursor:pointer;
      }

      .hm-sheet-close:hover {
        color:#2e425f;
        border-color:#c7d4e4;
        background:#ffffff;
      }

      .hm-sheet-close svg {
        width:20px;
        height:20px;
        fill:none;
        stroke:currentColor;
        stroke-width:2;
        stroke-linecap:round;
      }

      .hm-game-controls {
        padding:0 1px 12px;
        border-bottom:1px solid #e8edf4;
      }

      .hm-game-search-wrap {
        position:relative;
        margin-bottom:10px;
      }

      .hm-game-search-icon {
        position:absolute;
        left:14px;
        top:50%;
        width:18px;
        height:18px;
        transform:translateY(-50%);
        fill:none;
        stroke:#7790aa;
        stroke-width:2;
        pointer-events:none;
      }

      .hm-game-search {
        width:100%;
        height:47px;
        padding:0 42px;
        color:var(--hm-text);
        border:1px solid #d8e1ec;
        border-radius:15px;
        background:#ffffff;
        outline:none;
        font-size:15px;
        font-weight:650;
      }

      .hm-game-search:focus {
        border-color:#75aaf0;
        box-shadow:0 0 0 3px rgba(47,117,223,.12);
      }

      .hm-game-search-clear {
        position:absolute;
        right:7px;
        top:50%;
        width:33px;
        height:33px;
        display:grid;
        place-items:center;
        padding:0;
        transform:translateY(-50%);
        color:#718096;
        border:0;
        border-radius:10px;
        background:transparent;
        cursor:pointer;
      }

      .hm-game-search-clear:hover {
        background:#edf2f7;
      }

      .hm-game-search-clear svg {
        width:17px;
        height:17px;
        fill:none;
        stroke:currentColor;
        stroke-width:2;
        stroke-linecap:round;
      }

      .hm-game-tabs {
        display:flex;
        align-items:center;
        gap:7px;
        padding:1px 1px 2px;
        overflow-x:auto;
        overflow-y:hidden;
        scrollbar-width:none;
        overscroll-behavior-x:contain;
      }

      .hm-game-tabs::-webkit-scrollbar {
        display:none;
      }

      .hm-game-tab {
        flex:0 0 auto;
        min-height:39px;
        padding:0 13px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        color:#58677d;
        border:1px solid #dce4ee;
        border-radius:999px;
        background:#ffffff;
        cursor:pointer;
        font-size:12px;
        font-weight:800;
        white-space:nowrap;
      }

      .hm-game-tab svg {
        width:15px;
        height:15px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-game-tab:hover {
        color:#326fae;
        border-color:#aac9e9;
      }

      .hm-game-tab.is-active {
        color:#ffffff;
        border-color:var(--hm-brand);
        background:linear-gradient(135deg,var(--hm-brand),#5a9cf0);
        box-shadow:0 6px 14px rgba(47,117,223,.2);
      }

      .hm-game-tab-count {
        min-width:20px;
        height:20px;
        padding:0 6px;
        display:inline-grid;
        place-items:center;
        color:#708096;
        border-radius:999px;
        background:#edf2f7;
        font-size:10px;
      }

      .hm-game-tab.is-active .hm-game-tab-count {
        color:#2969b5;
        background:#ffffff;
      }

      .hm-game-scroll,
      .hm-share-scroll {
        min-height:0;
        height:100%;
        padding:14px 15px max(18px,env(safe-area-inset-bottom));
        overflow-y:auto;
        overflow-x:hidden;
        overscroll-behavior:contain;
        -webkit-overflow-scrolling:touch;
      }

      .hm-game-summary {
        min-height:32px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        margin-bottom:9px;
        color:var(--hm-muted);
        font-size:11px;
        font-weight:650;
      }

      .hm-game-summary strong {
        color:var(--hm-brand-dark);
        font-size:12px;
      }

      .hm-game-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:9px;
      }

      .hm-game-card {
        position:relative;
        min-width:0;
        min-height:104px;
        padding:13px 11px 11px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:7px;
        color:var(--hm-text);
        text-align:center;
        text-decoration:none;
        border:1px solid var(--hm-line);
        border-radius:17px;
        background:#ffffff;
        box-shadow:0 6px 18px rgba(35,65,105,.055);
        transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease;
      }

      .hm-game-card:hover {
        transform:translateY(-1px);
        border-color:#aacdf3;
        box-shadow:0 9px 23px rgba(35,65,105,.09);
      }

      .hm-game-card.is-current {
        border-color:#78adeb;
        background:#eef6ff;
        pointer-events:none;
      }

      .hm-game-card-icon {
        width:40px;
        height:40px;
        display:grid;
        place-items:center;
        color:var(--hm-brand-dark);
        border-radius:13px;
        background:var(--hm-brand-soft);
      }

      .hm-game-card-icon svg {
        width:22px;
        height:22px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.8;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-game-card-title {
        width:100%;
        display:-webkit-box;
        overflow:hidden;
        color:var(--hm-text);
        font-size:13px;
        line-height:1.3;
        font-weight:850;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
      }

      .hm-game-card-meta {
        display:flex;
        align-items:center;
        justify-content:center;
        gap:5px;
        color:#64758a;
        font-size:9px;
        line-height:1.2;
        font-weight:750;
      }

      .hm-game-card-badge {
        padding:3px 6px;
        color:#176a51;
        border-radius:999px;
        background:#ddf6ec;
        font-size:8px;
        font-weight:850;
      }

      .hm-game-card-badge.is-current {
        color:#ffffff;
        background:var(--hm-brand);
      }

      .hm-game-empty {
        min-height:210px;
        display:grid;
        place-items:center;
        padding:28px 15px;
        color:var(--hm-muted);
        text-align:center;
      }

      .hm-game-empty[hidden],
      .hm-game-grid[hidden],
      .hm-share-more[hidden] {
        display:none!important;
      }

      .hm-game-empty svg {
        width:43px;
        height:43px;
        margin:0 auto 10px;
        fill:none;
        stroke:#91a6bd;
        stroke-width:1.7;
        stroke-linecap:round;
      }

      .hm-game-empty strong {
        display:block;
        color:#42526a;
        font-size:14px;
      }

      .hm-game-empty span {
        display:block;
        margin-top:4px;
        font-size:11px;
      }

      .hm-game-footer {
        margin-top:16px;
        padding-top:14px;
        border-top:1px solid #e6ecf3;
      }

      .hm-game-hub-link {
        width:100%;
        min-height:50px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        color:#ffffff;
        text-decoration:none;
        border-radius:15px;
        background:linear-gradient(135deg,var(--hm-brand),#4c8de8);
        box-shadow:0 8px 20px rgba(47,117,223,.2);
        font-size:13px;
        font-weight:850;
      }

      .hm-game-hub-link svg {
        width:19px;
        height:19px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-game-support-links {
        display:flex;
        justify-content:center;
        align-items:center;
        flex-wrap:wrap;
        gap:6px 14px;
        margin-top:13px;
      }

      .hm-game-support-link {
        display:inline-flex;
        align-items:center;
        gap:5px;
        color:#68798d;
        text-decoration:none;
        font-size:10px;
        font-weight:750;
      }

      .hm-game-support-link:hover {
        color:var(--hm-brand-dark);
      }

      .hm-game-support-link svg {
        width:14px;
        height:14px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-game-copyright {
        margin:11px 0 0;
        color:#929dac;
        text-align:center;
        font-size:9px;
        font-weight:600;
      }

      .hm-share-scroll {
        padding-top:18px;
      }

      .hm-share-intro {
        margin:0 0 18px;
        color:#5e6e82;
        text-align:center;
        font-size:13px;
        line-height:1.65;
        font-weight:650;
      }

      .hm-share-primary,
      .hm-share-more {
        display:flex;
        align-items:flex-start;
        justify-content:center;
        flex-wrap:wrap;
        gap:16px;
      }

      .hm-share-more {
        margin-top:18px;
        padding-top:18px;
        border-top:1px solid #e8edf4;
      }

      .hm-share-action {
        width:58px;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:7px;
        padding:0;
        color:#546275;
        border:0;
        background:transparent;
        cursor:pointer;
        font-size:10px;
        line-height:1.2;
        font-weight:750;
      }

      .hm-share-action-circle {
        width:50px;
        height:50px;
        display:grid;
        place-items:center;
        color:#ffffff;
        border-radius:50%;
        box-shadow:0 3px 9px rgba(15,23,42,.15);
        transition:transform .2s ease,box-shadow .2s ease;
      }

      .hm-share-action:hover .hm-share-action-circle {
        transform:translateY(-3px) scale(1.04);
        box-shadow:0 7px 17px rgba(15,23,42,.2);
      }

      .hm-share-action-circle svg {
        width:24px;
        height:24px;
        fill:currentColor;
      }

      .hm-share-action[data-share="copy"] .hm-share-action-circle svg {
        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-share-action[data-share="kakao"] .hm-share-action-circle {
        color:#3c1e1e;
        background:#fee500;
      }

      .hm-share-action[data-share="naver"] .hm-share-action-circle {
        background:#03c75a;
      }

      .hm-share-action[data-share="facebook"] .hm-share-action-circle {
        background:#1877f2;
      }

      .hm-share-action[data-share="x"] .hm-share-action-circle,
      .hm-share-action[data-share="threads"] .hm-share-action-circle {
        background:#111111;
      }

      .hm-share-action[data-share="more"] .hm-share-action-circle {
        background:#657085;
      }

      .hm-share-action[data-share="copy"] .hm-share-action-circle {
        background:#6b7280;
      }

      .hm-share-action[data-share="band"] .hm-share-action-circle {
        background:#44c95b;
      }

      .hm-share-action[data-share="telegram"] .hm-share-action-circle {
        background:#168acb;
      }

      .hm-share-note {
        margin:18px 0 0;
        color:#8a95a4;
        text-align:center;
        font-size:9px;
        line-height:1.6;
      }

      .hm-game-quick-nav {
        position:fixed;
        left:50%;
        bottom:12px;
        z-index:2147483100;
        width:min(720px,calc(100% - 24px));
        min-height:58px;
        padding:5px 8px;
        display:grid;
        grid-template-columns:repeat(5,minmax(0,1fr));
        gap:5px;
        border:1px solid rgba(203,213,225,.95);
        border-radius:18px;
        background:rgba(255,255,255,.97);
        box-shadow:0 12px 34px rgba(15,23,42,.18);
        -webkit-backdrop-filter:blur(16px);
        backdrop-filter:blur(16px);
        transform:translateX(-50%);
        transition:opacity .18s ease,visibility .18s ease,transform .18s ease;
      }

      .hm-game-quick-nav.is-hidden {
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        transform:translate(-50%,calc(100% + 34px));
      }

      .hm-game-quick-button {
        min-width:0;
        min-height:46px;
        padding:6px 8px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:center;
        gap:7px;
        color:#334155;
        border:0;
        border-radius:12px;
        background:transparent;
        cursor:pointer;
        font-size:13px;
        font-weight:850;
        line-height:1;
      }

      .hm-game-quick-button:hover {
        background:#f1f5f9;
      }

      .hm-game-quick-button[data-quick-action="search"] {
        color:#ffffff;
        background:linear-gradient(135deg,#2563eb,#4d76ed);
        box-shadow:0 7px 18px rgba(37,99,235,.25);
      }

      .hm-game-quick-button[data-quick-action="search"]:hover {
        background:linear-gradient(135deg,#1f5edc,#416ddd);
      }

      .hm-game-quick-button svg {
        flex:0 0 auto;
        width:20px;
        height:20px;
        fill:none;
        stroke:currentColor;
        stroke-width:2;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-game-toast {
        position:fixed;
        left:50%;
        bottom:94px;
        z-index:2147483290;
        max-width:calc(100% - 32px);
        padding:10px 15px;
        color:#ffffff;
        border-radius:999px;
        background:rgba(23,35,59,.94);
        box-shadow:0 8px 24px rgba(15,23,42,.2);
        transform:translate(-50%,14px);
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        font-size:12px;
        font-weight:750;
        transition:opacity .18s ease,transform .18s ease,visibility .18s ease;
      }

      .hm-game-toast.is-visible {
        opacity:1;
        visibility:visible;
        transform:translate(-50%,0);
      }

      .hm-sheet-close:focus-visible,
      .hm-game-search:focus-visible,
      .hm-game-search-clear:focus-visible,
      .hm-game-tab:focus-visible,
      .hm-game-card:focus-visible,
      .hm-game-hub-link:focus-visible,
      .hm-game-support-link:focus-visible,
      .hm-share-action:focus-visible,
      .hm-game-quick-button:focus-visible {
        outline:3px solid rgba(47,117,223,.27);
        outline-offset:2px;
      }

      body.${BODY_OPEN_CLASS} {
        overflow:hidden!important;
      }

      @media (min-width:760px) {
        .hm-game-sheet,
        .hm-share-sheet {
          bottom:88px;
          width:min(760px,calc(100% - 40px));
          max-height:min(76dvh,720px);
          border-bottom:1px solid rgba(203,213,225,.95);
          border-radius:24px;
          transform:translate(-50%,calc(100% + 110px));
        }

        .hm-game-sheet.is-open,
        .hm-share-sheet.is-open {
          transform:translate(-50%,0);
        }

        .hm-sheet-handle {
          display:none;
        }

        .hm-sheet-top {
          padding-top:13px;
          border-radius:24px 24px 0 0;
        }

        .hm-game-grid {
          grid-template-columns:repeat(4,minmax(0,1fr));
        }

        .hm-game-card {
          min-height:110px;
        }
      }

      @media (max-width:760px) {
        .hm-game-quick-nav {
          width:calc(100% - 16px);
          max-width:560px;
          min-height:70px;
          padding:6px 6px calc(6px + env(safe-area-inset-bottom));
          bottom:8px;
          border-radius:20px;
          gap:3px;
        }

        .hm-game-quick-nav.is-hidden {
          transform:translate(-50%,calc(100% + 26px));
        }

        .hm-game-quick-button {
          min-height:58px;
          padding:5px 2px;
          flex-direction:column;
          gap:3px;
          border-radius:14px;
          font-size:11px;
          line-height:1.15;
        }

        .hm-game-quick-button svg {
          width:22px;
          height:22px;
        }

        .hm-game-toast {
          bottom:92px;
        }
      }

      @media (max-width:360px) {
        .hm-game-quick-button {
          font-size:10px;
        }

        .hm-game-grid {
          gap:7px;
        }

        .hm-game-card {
          padding-right:8px;
          padding-left:8px;
        }

        .hm-share-primary,
        .hm-share-more {
          gap:13px;
        }
      }

      @media (prefers-reduced-motion:reduce) {
        .hm-game-backdrop,
        .hm-game-sheet,
        .hm-share-sheet,
        .hm-game-card,
        .hm-share-action-circle,
        .hm-game-quick-nav,
        .hm-game-toast {
          transition:none!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createCloseButton() {
    const button = createElement("button", {
      className: "hm-sheet-close",
      attrs: {
        type: "button",
        "aria-label": "닫기"
      },
      dataset: {
        panelClose: "true"
      }
    });
    button.appendChild(makeIcon("close"));
    return button;
  }

  function createSheetHeader(iconName, title, description, titleId) {
    const top = createElement("div", { className: "hm-sheet-top" });
    const handle = createElement("div", {
      className: "hm-sheet-handle",
      attrs: { "aria-hidden": "true" }
    });
    const header = createElement("header", { className: "hm-sheet-head" });
    const titleWrap = createElement("div", { className: "hm-sheet-title-wrap" });
    const icon = createElement("span", {
      className: "hm-sheet-title-icon",
      attrs: { "aria-hidden": "true" }
    });
    icon.appendChild(makeIcon(iconName));

    const copy = createElement("div", { className: "hm-sheet-title-copy" });
    const heading = createElement("h2", {
      text: title,
      attrs: { id: titleId }
    });
    const paragraph = createElement("p", { text: description });
    append(copy, heading, paragraph);
    append(titleWrap, icon, copy);
    append(header, titleWrap, createCloseButton());
    append(top, handle, header);
    return top;
  }

  function createSearchControls() {
    const controls = createElement("div", { className: "hm-game-controls" });
    const searchWrap = createElement("div", { className: "hm-game-search-wrap" });
    const searchIcon = makeIcon("search", "hm-game-search-icon");
    const search = createElement("input", {
      className: "hm-game-search",
      attrs: {
        type: "search",
        inputmode: "search",
        placeholder: "게임 이름을 검색하세요",
        "aria-label": "게임 이름 검색",
        autocomplete: "off"
      }
    });
    const clear = createElement("button", {
      className: "hm-game-search-clear",
      attrs: {
        type: "button",
        "aria-label": "검색어 지우기"
      },
      dataset: { searchClear: "true" }
    });
    clear.appendChild(makeIcon("close"));
    append(searchWrap, searchIcon, search, clear);

    const tabs = createElement("nav", {
      className: "hm-game-tabs",
      attrs: { "aria-label": "게임 카테고리" }
    });

    append(controls, searchWrap, tabs);
    return controls;
  }

  function createGameSheet() {
    const sheet = createElement("section", {
      className: "hm-game-sheet",
      attrs: {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "hmGameSheetTitle",
        "aria-hidden": "true"
      }
    });

    const top = createSheetHeader(
      "flag",
      "힐링편의점 미니게임",
      "다른 게임을 빠르게 찾아 이동하세요.",
      "hmGameSheetTitle"
    );
    top.appendChild(createSearchControls());

    const scroll = createElement("div", { className: "hm-game-scroll" });
    const summary = createElement("div", {
      className: "hm-game-summary",
      attrs: { "aria-live": "polite" }
    });
    const grid = createElement("div", { className: "hm-game-grid" });

    const empty = createElement("div", {
      className: "hm-game-empty",
      attrs: { hidden: true }
    });
    const emptyInner = createElement("div");
    emptyInner.appendChild(makeIcon("search"));
    emptyInner.appendChild(createElement("strong", { text: "해당하는 게임이 없습니다." }));
    emptyInner.appendChild(createElement("span", { text: "다른 카테고리나 검색어를 확인해 주세요." }));
    empty.appendChild(emptyInner);

    const footer = createElement("footer", { className: "hm-game-footer" });
    const hubLink = createElement("a", {
      className: "hm-game-hub-link",
      attrs: { href: CONFIG.gameHubUrl }
    });
    append(hubLink, makeIcon("grid"), createElement("span", { text: "모든 게임 보기" }));

    const supportLinks = createElement("div", { className: "hm-game-support-links" });
    const reportLink = createElement("a", {
      className: "hm-game-support-link",
      attrs: { href: getQnaUrl() },
      dataset: { qnaInternal: "true" }
    });
    append(reportLink, makeIcon("report"), createElement("span", { text: "오류신고" }));

    const guideLink = createElement("a", {
      className: "hm-game-support-link",
      attrs: { href: CONFIG.guideUrl }
    });
    append(guideLink, makeIcon("guide"), createElement("span", { text: "이용안내·저작권" }));

    append(supportLinks, reportLink, guideLink);
    const copyright = createElement("p", {
      className: "hm-game-copyright",
      text: "© 2026 Healing Mart · 힐링편의점"
    });

    append(footer, hubLink, supportLinks, copyright);
    append(scroll, summary, grid, empty, footer);
    append(sheet, top, scroll);
    return sheet;
  }

  function createShareAction(name, label) {
    const button = createElement("button", {
      className: "hm-share-action",
      attrs: {
        type: "button",
        "aria-label": label
      },
      dataset: { share: name }
    });
    const circle = createElement("span", {
      className: "hm-share-action-circle",
      attrs: { "aria-hidden": "true" }
    });

    if (name === "copy") {
      circle.appendChild(makeIcon("copy"));
    } else {
      circle.appendChild(makeSocialIcon(name));
    }

    append(button, circle, createElement("span", { text: label }));
    return button;
  }

  function createShareSheet() {
    const sheet = createElement("section", {
      className: "hm-share-sheet",
      attrs: {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "hmShareSheetTitle",
        "aria-hidden": "true"
      }
    });

    const top = createSheetHeader(
      "share",
      "이 게임 공유하기",
      "원하는 서비스를 선택해 현재 게임을 공유하세요.",
      "hmShareSheetTitle"
    );

    const scroll = createElement("div", { className: "hm-share-scroll" });
    const intro = createElement("p", {
      className: "hm-share-intro",
      text: "도움이 되셨다면 가족이나 친구에게 힐링편의점 미니게임을 알려주세요."
    });

    const primary = createElement("div", { className: "hm-share-primary" });
    append(
      primary,
      createShareAction("kakao", "카카오톡"),
      createShareAction("naver", "네이버"),
      createShareAction("facebook", "페이스북"),
      createShareAction("x", "X"),
      createShareAction("threads", "Threads"),
      createShareAction("more", "더보기")
    );

    const more = createElement("div", {
      className: "hm-share-more",
      attrs: { hidden: true }
    });
    append(
      more,
      createShareAction("copy", "링크 복사"),
      createShareAction("band", "네이버 밴드"),
      createShareAction("telegram", "텔레그램")
    );

    const note = createElement("p", {
      className: "hm-share-note",
      text: "공유 서비스의 로그인 상태와 기기 환경에 따라 새 창 또는 앱으로 열릴 수 있습니다."
    });

    append(scroll, intro, primary, more, note);
    append(sheet, top, scroll);
    return sheet;
  }

  function createQuickButton(action, iconName, label) {
    const button = createElement("button", {
      className: "hm-game-quick-button",
      attrs: {
        type: "button",
        "aria-label": label
      },
      dataset: { quickAction: action }
    });
    append(button, makeIcon(iconName), createElement("span", { text: label }));
    return button;
  }

  function createQuickNav() {
    const nav = createElement("nav", {
      className: "hm-game-quick-nav",
      attrs: { "aria-label": "미니게임 빠른 메뉴" }
    });

    append(
      nav,
      createQuickButton("home", "home", "게임홈"),
      createQuickButton("search", "search", "빠른찾기"),
      createQuickButton("new", "sparkles", "새 게임"),
      createQuickButton("categories", "grid", "카테고리"),
      createQuickButton("share", "share", "공유")
    );

    return nav;
  }

  function mount() {
    if (document.getElementById(ROOT_ID)) {
      return;
    }

    const root = createElement("div", {
      attrs: {
        id: ROOT_ID,
        "data-hm-common-menu": "v1.5.0"
      }
    });

    const backdrop = createElement("div", {
      className: "hm-game-backdrop",
      dataset: { panelClose: "true" }
    });
    const gameSheet = createGameSheet();
    const shareSheet = createShareSheet();
    const quickNav = createQuickNav();
    const toast = createElement("div", {
      className: "hm-game-toast",
      attrs: {
        role: "status",
        "aria-live": "polite"
      }
    });

    append(root, backdrop, gameSheet, shareSheet, quickNav, toast);
    document.body.appendChild(root);

    renderAll();
  }

  function getParts() {
    const root = document.getElementById(ROOT_ID);
    return {
      root,
      backdrop: root?.querySelector(".hm-game-backdrop"),
      gameSheet: root?.querySelector(".hm-game-sheet"),
      shareSheet: root?.querySelector(".hm-share-sheet"),
      quickNav: root?.querySelector(".hm-game-quick-nav"),
      search: root?.querySelector(".hm-game-search"),
      searchClear: root?.querySelector(".hm-game-search-clear"),
      tabs: root?.querySelector(".hm-game-tabs"),
      summary: root?.querySelector(".hm-game-summary"),
      grid: root?.querySelector(".hm-game-grid"),
      empty: root?.querySelector(".hm-game-empty"),
      shareMore: root?.querySelector(".hm-share-more"),
      toast: root?.querySelector(".hm-game-toast")
    };
  }

  function renderTabs() {
    const { tabs } = getParts();
    if (!tabs) {
      return;
    }

    tabs.replaceChildren();

    const games = getPublishedGames();
    const categories = getCategories().filter((category) =>
      games.some((game) => game.category === category.id)
    );

    const makeTab = (id, label, iconName, count, active) => {
      const button = createElement("button", {
        className: `hm-game-tab${active ? " is-active" : ""}`,
        attrs: {
          type: "button",
          "aria-pressed": active ? "true" : "false"
        },
        dataset: { category: id }
      });

      if (iconName) {
        button.appendChild(makeIcon(iconName));
      }

      button.appendChild(createElement("span", { text: label }));
      button.appendChild(createElement("span", {
        className: "hm-game-tab-count",
        text: count
      }));
      return button;
    };

    tabs.appendChild(
      makeTab(
        "all",
        state.onlyNew ? "새 게임" : "전체",
        state.onlyNew ? "sparkles" : "grid",
        state.onlyNew
          ? games.filter((game) => game.isNew).length
          : games.length,
        state.category === "all"
      )
    );

    categories.forEach((category) => {
      tabs.appendChild(
        makeTab(
          category.id,
          category.shortTitle || category.title,
          categoryIconName(category.id),
          games.filter((game) =>
            game.category === category.id &&
            (!state.onlyNew || game.isNew)
          ).length,
          state.category === category.id
        )
      );
    });
  }

  function createGameCard(game, categoryMap) {
    const current = game.id === state.currentGameId;
    const card = createElement(current ? "div" : "a", {
      className: `hm-game-card${current ? " is-current" : ""}`,
      attrs: current
        ? { "aria-current": "page" }
        : { href: game.url }
    });

    const icon = createElement("span", {
      className: "hm-game-card-icon",
      attrs: { "aria-hidden": "true" }
    });
    icon.appendChild(makeIcon(categoryIconName(game.category)));

    const title = createElement("strong", {
      className: "hm-game-card-title",
      text: game.shortTitle || game.title
    });

    const meta = createElement("span", { className: "hm-game-card-meta" });
    const category = categoryMap.get(game.category);
    meta.appendChild(createElement("span", {
      text: category?.shortTitle || category?.title || "미니게임"
    }));

    if (current || game.isNew) {
      meta.appendChild(createElement("span", {
        className: `hm-game-card-badge${current ? " is-current" : ""}`,
        text: current ? "플레이 중" : "NEW"
      }));
    }

    append(card, icon, title, meta);
    return card;
  }

  function renderGames() {
    const {
      grid,
      empty,
      summary,
      search,
      searchClear
    } = getParts();

    if (!grid || !empty || !summary || !search) {
      return;
    }

    const games = getFilteredGames();
    const categoryMap = getCategoryMap();
    const activeCategory = state.category === "all"
      ? state.onlyNew
        ? "새 게임"
        : "전체 게임"
      : categoryMap.get(state.category)?.title || "게임";

    const summaryTitle = createElement("span");
    summaryTitle.appendChild(
      createElement("strong", { text: activeCategory })
    );

    summary.replaceChildren(
      summaryTitle,
      createElement("span", { text: `${games.length}개` })
    );

    grid.replaceChildren();
    games.forEach((game) => {
      grid.appendChild(createGameCard(game, categoryMap));
    });

    grid.hidden = games.length === 0;
    empty.hidden = games.length !== 0;
    search.value = state.query;
    searchClear.hidden = !state.query;

    const internalQna = document.querySelector(
      `#${ROOT_ID} [data-qna-internal]`
    );
    if (internalQna) {
      internalQna.href = getQnaUrl();
    }
  }

  function renderShare() {
    const { shareMore } = getParts();
    if (shareMore) {
      shareMore.hidden = !state.moreShareOpen;
    }
  }

  function renderAll() {
    renderTabs();
    renderGames();
    renderShare();
    updateExternalLinks();
    updateTitleCaptions();
  }

  function setPanelVisibility(panel) {
    const {
      backdrop,
      gameSheet,
      shareSheet,
      quickNav
    } = getParts();

    if (!backdrop || !gameSheet || !shareSheet || !quickNav) {
      return;
    }

    state.panel = panel;
    const gameOpen = panel === "games";
    const shareOpen = panel === "share";
    const anyOpen = gameOpen || shareOpen;

    backdrop.classList.toggle("is-open", anyOpen);
    gameSheet.classList.toggle("is-open", gameOpen);
    shareSheet.classList.toggle("is-open", shareOpen);
    quickNav.classList.toggle("is-hidden", anyOpen);

    gameSheet.setAttribute("aria-hidden", gameOpen ? "false" : "true");
    shareSheet.setAttribute("aria-hidden", shareOpen ? "false" : "true");
    document.body.classList.toggle(BODY_OPEN_CLASS, anyOpen);
  }

  function openGames(mode = "all", trigger) {
    state.currentGameId = getCurrentGameId();
    state.returnFocus = trigger instanceof HTMLElement
      ? trigger
      : document.activeElement;

    state.query = "";
    state.category = "all";
    state.onlyNew = mode === "new";
    renderAll();
    setPanelVisibility("games");

    window.setTimeout(() => {
      const { gameSheet, search } = getParts();
      if (mode === "search") {
        search?.focus();
      } else {
        gameSheet?.querySelector(".hm-sheet-close")?.focus();
      }
    }, 70);
  }

  function openShare(trigger) {
    state.currentGameId = getCurrentGameId();
    state.returnFocus = trigger instanceof HTMLElement
      ? trigger
      : document.activeElement;
    state.moreShareOpen = false;
    renderShare();
    setPanelVisibility("share");

    window.setTimeout(() => {
      getParts().shareSheet
        ?.querySelector(".hm-sheet-close")
        ?.focus();
    }, 70);
  }

  function closePanel(options = {}) {
    if (!state.panel) {
      return;
    }

    state.panel = "";
    setPanelVisibility("");

    if (
      options.restoreFocus !== false &&
      state.returnFocus instanceof HTMLElement
    ) {
      window.setTimeout(() => {
        state.returnFocus?.focus?.();
      }, 70);
    }
  }

  let toastTimer = 0;
  function showToast(message) {
    const { toast } = getParts();
    if (!toast) {
      return;
    }

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function getShareData() {
    const game = getCurrentGame();
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const description =
      game?.description ||
      document.querySelector('meta[name="description"]')?.content ||
      "힐링편의점 미니게임을 바로 즐겨보세요.";
    const image =
      document.querySelector('meta[property="og:image"]')?.content ||
      document.querySelector('meta[name="twitter:image"]')?.content ||
      "";

    return {
      url: canonical || window.location.href,
      title: game?.title || document.title,
      description,
      image
    };
  }

  function openPopup(url) {
    const popup = window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=720,height=720"
    );

    if (!popup) {
      showToast("팝업이 차단되었습니다. 브라우저 설정을 확인해 주세요.");
    }
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      showToast("링크가 복사되었습니다.");
    } catch (error) {
      showToast("링크를 복사하지 못했습니다.");
    }
  }

  async function fallbackNativeShare() {
    const data = getShareData();
    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: data.url
        });
      } else {
        await copyText(data.url);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        await copyText(data.url);
      }
    }
  }

  function loadKakaoSdk() {
    if (window.Kakao) {
      return Promise.resolve(window.Kakao);
    }

    if (state.kakaoPromise) {
      return state.kakaoPromise;
    }

    state.kakaoPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-hm-kakao-sdk="true"]'
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(window.Kakao), {
          once: true
        });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = CONFIG.kakaoSdkUrl;
      script.async = true;
      script.dataset.hmKakaoSdk = "true";
      script.addEventListener("load", () => resolve(window.Kakao), {
        once: true
      });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

    return state.kakaoPromise;
  }

  async function shareKakao() {
    const data = getShareData();

    try {
      const Kakao = await loadKakaoSdk();
      if (!Kakao || !CONFIG.kakaoJavaScriptKey) {
        throw new Error("Kakao SDK unavailable");
      }

      if (!Kakao.isInitialized()) {
        Kakao.init(CONFIG.kakaoJavaScriptKey);
      }

      const content = {
        title: data.title,
        description: data.description,
        link: {
          mobileWebUrl: data.url,
          webUrl: data.url
        }
      };

      if (data.image) {
        content.imageUrl = data.image;
      }

      Kakao.Share.sendDefault({
        objectType: "feed",
        content,
        buttons: [
          {
            title: "게임 시작하기",
            link: {
              mobileWebUrl: data.url,
              webUrl: data.url
            }
          }
        ]
      });
    } catch (error) {
      showToast("카카오톡 공유를 열지 못해 기기 공유로 전환합니다.");
      await fallbackNativeShare();
    }
  }

  function handleShare(name) {
    const data = getShareData();

    if (name === "kakao") {
      shareKakao();
      return;
    }

    if (name === "naver") {
      openPopup(
        `https://share.naver.com/web/shareView?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`
      );
      return;
    }

    if (name === "facebook") {
      openPopup(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`
      );
      return;
    }

    if (name === "x") {
      openPopup(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`
      );
      return;
    }

    if (name === "threads") {
      openPopup(
        `https://www.threads.net/intent/post?text=${encodeURIComponent(`${data.title}\n${data.url}`)}`
      );
      return;
    }

    if (name === "band") {
      openPopup(
        `https://band.us/plugin/share?body=${encodeURIComponent(`${data.title}\r\n${data.url}`)}`
      );
      return;
    }

    if (name === "telegram") {
      openPopup(
        `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`
      );
      return;
    }

    if (name === "copy") {
      copyText(data.url);
      return;
    }

    if (name === "more") {
      state.moreShareOpen = !state.moreShareOpen;
      renderShare();
      return;
    }
  }

  function getFocusableElements(sheet) {
    if (!sheet) {
      return [];
    }

    return Array.from(
      sheet.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hidden && element.offsetParent !== null);
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !state.panel) {
      return;
    }

    const { gameSheet, shareSheet } = getParts();
    const activeSheet = state.panel === "games" ? gameSheet : shareSheet;
    const focusable = getFocusableElements(activeSheet);

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const openTrigger = event.target.closest("[data-hm-game-menu-open]");
      if (openTrigger) {
        event.preventDefault();
        openGames("all", openTrigger);
        return;
      }

      const closeTrigger = event.target.closest("[data-panel-close]");
      if (closeTrigger) {
        event.preventDefault();
        closePanel();
        return;
      }

      const quickButton = event.target.closest("[data-quick-action]");
      if (quickButton) {
        event.preventDefault();
        const action = quickButton.dataset.quickAction;

        if (action === "home") {
          window.location.href = CONFIG.gameHubUrl;
          return;
        }

        if (action === "search") {
          openGames("search", quickButton);
          return;
        }

        if (action === "new") {
          openGames("new", quickButton);
          return;
        }

        if (action === "categories") {
          openGames("all", quickButton);
          return;
        }

        if (action === "share") {
          openShare(quickButton);
        }
        return;
      }

      const categoryButton = event.target.closest("[data-category]");
      if (categoryButton) {
        event.preventDefault();
        state.category = categoryButton.dataset.category || "all";
        renderTabs();
        renderGames();
        return;
      }

      const clearButton = event.target.closest("[data-search-clear]");
      if (clearButton) {
        event.preventDefault();
        state.query = "";
        renderGames();
        getParts().search?.focus();
        return;
      }

      const shareButton = event.target.closest("[data-share]");
      if (shareButton) {
        event.preventDefault();
        handleShare(shareButton.dataset.share);
      }
    });

    document.addEventListener("input", (event) => {
      if (!event.target.matches(".hm-game-search")) {
        return;
      }

      state.query = event.target.value || "";
      renderGames();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.panel) {
        event.preventDefault();
        closePanel();
        return;
      }

      trapFocus(event);
    });
  }

  function init() {
    if (document.getElementById(ROOT_ID)) {
      return;
    }

    state.currentGameId = getCurrentGameId();
    injectStyle();
    mount();
    bind();
    updateTitleCaptions();
    updateExternalLinks();
  }

  window.HMGameMenu = Object.freeze({
    open(trigger) {
      openGames("all", trigger);
    },
    openSearch(trigger) {
      openGames("search", trigger);
    },
    openNew(trigger) {
      openGames("new", trigger);
    },
    openCategories(trigger) {
      openGames("all", trigger);
    },
    openShare(trigger) {
      openShare(trigger);
    },
    close: closePanel,
    isOpen() {
      return Boolean(state.panel);
    },
    getQnaUrl,
    refresh() {
      state.currentGameId = getCurrentGameId();
      renderAll();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
