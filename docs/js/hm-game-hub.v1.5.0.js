/*
 * Healing Mart Mini Game Hub v1.5.0
 * PC·모바일 반응형 게임 링크 허브
 * 외부 라이브러리 없음
 */
(() => {
  "use strict";

  const ROOT_ID = "hmMiniGameHub";
  const STYLE_ID = "hmMiniGameHubStyle";
  const VERSION = "v1.5.0";

  const CONFIG = Object.freeze({
    homeUrl: "https://www.healing-mart.com/",
    guideUrl: "https://www.healing-mart.com/p/service-guide.html",
    reportUrl: "https://www.healing-mart.com/p/report.html",
    title: "힐링편의점 무료 미니게임",
    subtitle: "설치 없이 모바일과 PC에서 바로 즐기는 게임 모음",
    featuredCount: 6,

    /*
     * Blogger의 미니게임 라벨 피드를 한 번만 읽어
     * 각 게시물의 대표 이미지를 게임 카드에 연결합니다.
     * 다른 Blogger 블로그가 추가되면 배열에 피드 주소를 더하세요.
     */
    thumbnailFeeds: Object.freeze([
      "https://www.healing-mart.com/feeds/posts/default/-/%EB%AF%B8%EB%8B%88%EA%B2%8C%EC%9E%84",
      "https://www.healing-mart.com/feeds/posts/default"
    ]),
    thumbnailMaxResults: 150,
    thumbnailTimeout: 12000,
    pageThumbnailTimeout: 10000,
    pageThumbnailConcurrency: 4
  });

  const state = {
    category: "all",
    query: "",
    newOnly: false,
    categorySheetOpen: false,
    shareSheetOpen: false,
    shareMoreOpen: false
  };

  const thumbnailState = {
    status: "idle",
    byUrl: new Map(),
    byTitle: new Map(),
    bySlug: new Map(),
    byLooseTitle: new Map(),
    sourceByGame: new Map(),
    failedGames: new Set(),
    request: null,
    feedSuccessCount: 0,
    pageSuccessCount: 0
  };

  const SVG_NS = "http://www.w3.org/2000/svg";

  const ICONS = Object.freeze({
    home: [
      ["path", { d: "M3 11.5 12 4l9 7.5" }],
      ["path", { d: "M5.5 10.5V20h13v-9.5" }],
      ["path", { d: "M9.5 20v-6h5v6" }]
    ],
    search: [
      ["circle", { cx: "11", cy: "11", r: "7" }],
      ["path", { d: "m16.5 16.5 4 4" }]
    ],
    spark: [
      ["path", { d: "m12 3 1.4 4.2L18 8.6l-4.6 1.5L12 15l-1.4-4.9L6 8.6l4.6-1.4L12 3Z" }],
      ["path", { d: "m18.5 14 .8 2.2 2.2.8-2.2.7-.8 2.3-.7-2.3-2.2-.7 2.2-.8.7-2.2Z" }]
    ],
    category: [
      ["rect", { x: "4", y: "4", width: "6", height: "6", rx: "1.5" }],
      ["rect", { x: "14", y: "4", width: "6", height: "6", rx: "1.5" }],
      ["rect", { x: "4", y: "14", width: "6", height: "6", rx: "1.5" }],
      ["rect", { x: "14", y: "14", width: "6", height: "6", rx: "1.5" }]
    ],
    share: [
      ["circle", { cx: "18", cy: "5", r: "2.5" }],
      ["circle", { cx: "6", cy: "12", r: "2.5" }],
      ["circle", { cx: "18", cy: "19", r: "2.5" }],
      ["path", { d: "m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" }]
    ],
    close: [
      ["path", { d: "M6 6l12 12M18 6 6 18" }]
    ],
    arrow: [
      ["path", { d: "M5 12h14M14 7l5 5-5 5" }]
    ],
    flag: [
      ["path", { d: "M5 21V4" }],
      ["path", { d: "M6 5c4-3 8 3 12 0v9c-4 3-8-3-12 0" }]
    ],
    quiz: [
      ["circle", { cx: "12", cy: "12", r: "9" }],
      ["path", { d: "M9.7 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.5 2.1-2.5 3.8" }],
      ["path", { d: "M12 17.5h.01" }]
    ],
    sudoku: [
      ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }],
      ["path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }]
    ],
    omok: [
      ["circle", { cx: "8", cy: "8", r: "3.2" }],
      ["circle", { cx: "16", cy: "16", r: "3.2" }],
      ["path", { d: "M4 16h6M14 8h6M8 4v1M16 19v1" }]
    ],
    reversi: [
      ["circle", { cx: "12", cy: "12", r: "8.5" }],
      ["path", { d: "M12 3.5a8.5 8.5 0 0 1 0 17Z" }]
    ],
    bolt: [
      ["path", { d: "M13.5 2 5 13h6l-.5 9L19 10h-6l.5-8Z" }]
    ],
    mine: [
      ["circle", { cx: "12", cy: "12", r: "5" }],
      ["path", { d: "M12 2v5M12 17v5M2 12h5M17 12h5M4.9 4.9l3.5 3.5M15.6 15.6l3.5 3.5M19.1 4.9l-3.5 3.5M8.4 15.6l-3.5 3.5" }]
    ],
    globe: [
      ["circle", { cx: "12", cy: "12", r: "9" }],
      ["path", { d: "M3 12h18M12 3c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21M12 3C9.5 5.4 8.2 8.4 8.2 12s1.3 6.6 3.8 9" }]
    ],
    keyboard: [
      ["rect", { x: "3", y: "6", width: "18", height: "12", rx: "2.5" }],
      ["path", { d: "M6 10h1M10 10h1M14 10h1M18 10h.01M6 14h2M10 14h8" }]
    ],
    stopwatch: [
      ["circle", { cx: "12", cy: "13", r: "8" }],
      ["path", { d: "M9 2h6M12 5V2M18 7l1.5-1.5M12 9v4l3 2" }]
    ],
    car: [
      ["path", { d: "M5 16h14l-1.2-6H6.2L5 16Z" }],
      ["path", { d: "m8 10 1.3-3h5.4l1.3 3M4 13H2.5M21.5 13H20" }],
      ["circle", { cx: "8", cy: "17.5", r: "1.5" }],
      ["circle", { cx: "16", cy: "17.5", r: "1.5" }]
    ],
    basketball: [
      ["circle", { cx: "12", cy: "12", r: "9" }],
      ["path", { d: "M3.5 9.5c4.5.2 8.8-2 11-5.5M20.5 14.5c-4.5-.2-8.8 2-11 5.5M9.5 3.5c.2 4.5-2 8.8-5.5 11M14.5 20.5c-.2-4.5 2-8.8 5.5-11M5.5 5.5l13 13" }]
    ],
    book: [
      ["path", { d: "M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" }],
      ["path", { d: "M20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22V5.5Z" }]
    ],
    cube: [
      ["path", { d: "m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" }],
      ["path", { d: "m4 6.5 8 4.5 8-4.5M12 11v11" }]
    ],
    image: [
      ["rect", { x: "3", y: "4", width: "18", height: "16", rx: "3" }],
      ["circle", { cx: "8.5", cy: "9", r: "1.5" }],
      ["path", { d: "m5 17 4.5-4.5 3.5 3 2-2 4 3.5" }]
    ],
    wallet: [
      ["path", { d: "M4 6.5A2.5 2.5 0 0 1 6.5 4H18v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" }],
      ["path", { d: "M15 9h6v6h-6a3 3 0 0 1 0-6Z" }],
      ["path", { d: "M17.5 12h.01" }]
    ],
    dice: [
      ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }],
      ["circle", { cx: "8", cy: "8", r: "1" }],
      ["circle", { cx: "16", cy: "8", r: "1" }],
      ["circle", { cx: "12", cy: "12", r: "1" }],
      ["circle", { cx: "8", cy: "16", r: "1" }],
      ["circle", { cx: "16", cy: "16", r: "1" }]
    ],
    puzzle: [
      ["path", { d: "M9 3h6v4a2 2 0 1 0 4 0v5h-5a2 2 0 1 1 0 4h5v5H9v-5a2 2 0 1 0-4 0v5H3v-9h5a2 2 0 1 0 0-4H3V3h6Z" }]
    ]
  });

  const SHARE_ICONS = Object.freeze({
    kakao: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#3C1E1E",
      paths: Object.freeze([
        "M12 3C6.5 3 2 6.6 2 11c0 2.9 1.9 5.4 4.7 6.8-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.7.1 1.3.2 2 .2 5.5 0 10-3.6 10-8S17.5 3 12 3z"
      ])
    }),
    naver: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      paths: Object.freeze([
        "M16.3 12.6 7.7 0H0v24h7.7V11.4L16.3 24H24V0h-7.7v12.6z"
      ])
    }),
    facebook: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      paths: Object.freeze([
        "M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3.1V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"
      ])
    }),
    x: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      paths: Object.freeze([
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      ])
    }),
    threads: Object.freeze({
      viewBox: "0 0 192 192",
      fill: "#ffffff",
      paths: Object.freeze([
        "M141.537 88.988C140.71 88.592 139.87 88.21 139.019 87.845 137.537 60.538 122.616 44.905 97.562 44.745h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.731-8.695 14.724-10.549 21.348-10.549h.229c8.249.053 14.474 2.451 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.625-23.68-1.14-23.82 1.372-39.134 15.264-38.106 34.568.522 9.792 5.4 18.216 13.736 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.059-7.484-51.275-21.742-10.503-13.351-15.93-32.635-16.133-57.317.203-24.682 5.63-43.966 16.133-57.317 11.216-14.258 28.466-21.573 51.275-21.742 22.975.171 40.526 7.521 52.171 21.847 5.71 7.026 10.015 15.861 12.853 26.163l16.147-4.308c-3.44-12.68-8.853-23.607-16.219-32.669C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.079 19.882 44.486 13.224 67.315 13.001 95.932L13 96l.001.068c.223 28.616 6.881 51.446 19.787 67.853C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553ZM98.441 129.507c-10.44.588-21.286-4.098-21.821-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.168 5.79-.168 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.801 29.273Z"
      ])
    }),
    more: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      circles: Object.freeze([
        Object.freeze({ cx: "5", cy: "12", r: "2" }),
        Object.freeze({ cx: "12", cy: "12", r: "2" }),
        Object.freeze({ cx: "19", cy: "12", r: "2" })
      ])
    }),
    copy: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      paths: Object.freeze([
        "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
      ])
    }),
    band: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      paths: Object.freeze([
        "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 12h-4v4h-2v-4H7v-2h4V8h2v4h4v2z"
      ])
    }),
    telegram: Object.freeze({
      viewBox: "0 0 24 24",
      fill: "#ffffff",
      paths: Object.freeze([
        "M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
      ])
    })
  });

  function makeIcon(key, className) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    if (className) {
      svg.setAttribute("class", className);
    }

    const parts = ICONS[key] || ICONS.puzzle;
    parts.forEach(([tag, attrs]) => {
      const child = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([name, value]) => {
        child.setAttribute(name, value);
      });
      svg.appendChild(child);
    });

    return svg;
  }

  function makeShareIcon(key) {
    const definition = SHARE_ICONS[key];
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", definition?.viewBox || "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.style.fill = definition?.fill || "currentColor";
    svg.style.stroke = "none";

    (definition?.paths || []).forEach((d) => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });

    (definition?.circles || []).forEach((attrs) => {
      const circle = document.createElementNS(SVG_NS, "circle");
      Object.entries(attrs).forEach(([name, value]) => circle.setAttribute(name, value));
      svg.appendChild(circle);
    });

    return svg;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function button(className, label, iconKey) {
    const node = el("button", className);
    node.type = "button";
    node.setAttribute("aria-label", label);
    if (iconKey) {
      node.appendChild(makeIcon(iconKey));
    }
    return node;
  }

  function getGames() {
    const games = Array.isArray(window.HM_GAMES) ? window.HM_GAMES : [];
    return games
      .filter(
        (game) =>
          game &&
          game.status === "published" &&
          game.id &&
          game.title &&
          game.url
      )
      .slice()
      .sort(
        (a, b) =>
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
    return new Map(getCategories().map((category) => [category.id, category]));
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase("ko-KR");
  }

  function normalizePostUrl(value) {
    try {
      const parsed = new URL(String(value || ""), window.location.href);
      let path = parsed.pathname || "/";

      try {
        path = decodeURIComponent(path);
      } catch (error) {
        /* 잘못 인코딩된 주소는 원문 경로를 사용합니다. */
      }

      return path
        .replace(/\/{2,}/g, "/")
        .replace(/\/$/, "")
        .toLocaleLowerCase("en-US");
    } catch (error) {
      return normalize(value);
    }
  }

  function normalizeTitle(value) {
    return normalize(value).replace(/\s+/g, " ");
  }

  function normalizeSlug(value) {
    try {
      const parsed = new URL(String(value || ""), window.location.href);
      let name = parsed.pathname.split("/").filter(Boolean).pop() || "";
      try {
        name = decodeURIComponent(name);
      } catch (error) {
        /* 원래 파일명을 사용합니다. */
      }
      return name
        .replace(/\.html?$/i, "")
        .replace(/[^a-z0-9가-힣]+/gi, "")
        .toLocaleLowerCase("en-US");
    } catch (error) {
      return "";
    }
  }

  function normalizeLooseTitle(value) {
    return normalize(value)
      .replace(/(?:무료|웹|온라인|게임|플레이|힐링편의점)/g, "")
      .replace(/[^a-z0-9가-힣]+/gi, "");
  }

  function resolveImageUrl(value, baseUrl) {
    const source = String(value || "").trim();
    if (!source || /^(?:data|blob|javascript):/i.test(source)) {
      return "";
    }

    try {
      return new URL(source, baseUrl || window.location.href).href;
    } catch (error) {
      return "";
    }
  }

  function isGoogleImageUrl(value) {
    try {
      const host = new URL(value, window.location.href).hostname.toLowerCase();
      return /(?:blogger\.googleusercontent\.com|googleusercontent\.com|bp\.blogspot\.com|ggpht\.com)$/.test(host);
    } catch (error) {
      return false;
    }
  }

  function upgradeBloggerImageUrl(value) {
    const source = String(value || "").trim();
    if (!source || !isGoogleImageUrl(source)) {
      return source;
    }

    return source
      .replace(/\/s\d+(?:-c)?\//i, "/w960-h540-p-k-no-nu/")
      .replace(/\/w\d+-h\d+(?:-[^/]+)?\//i, "/w960-h540-p-k-no-nu/")
      .replace(/=s\d+(?:-c)?(?:-[^&]+)?$/i, "=w960-h540-p-k-no-nu")
      .replace(/=w\d+-h\d+(?:-[^&]+)?$/i, "=w960-h540-p-k-no-nu");
  }

  function getImageVariants(value, baseUrl) {
    const original = resolveImageUrl(value, baseUrl);
    if (!original || !isUsableImageUrl(original)) {
      return [];
    }

    const variants = [];
    const add = (candidate) => {
      const resolved = resolveImageUrl(candidate, baseUrl);
      if (resolved && isUsableImageUrl(resolved) && !variants.includes(resolved)) {
        variants.push(resolved);
      }
    };

    add(upgradeBloggerImageUrl(original));
    add(original);

    if (isGoogleImageUrl(original)) {
      add(original.replace(/=s\d+(?:-c)?(?:-[^&]+)?$/i, "=s1600"));
      add(original.replace(/=w\d+-h\d+(?:-[^&]+)?$/i, "=s1600"));
      add(original.replace(/\/s\d+(?:-c)?\//i, "/s1600/"));
      add(original.replace(/\/w\d+-h\d+(?:-[^/]+)?\//i, "/s1600/"));
    }

    return variants;
  }

  function addCandidates(map, key, candidates) {
    if (!key) {
      return;
    }
    const current = map.get(key) || [];
    candidates.forEach((candidate) => {
      if (candidate && !current.includes(candidate)) {
        current.push(candidate);
      }
    });
    if (current.length) {
      map.set(key, current);
    }
  }

  function getLargestSrcsetCandidate(value) {
    const candidates = String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split(/\s+/);
        const descriptor = parts[parts.length - 1] || "";
        const score = /w$/i.test(descriptor)
          ? Number.parseFloat(descriptor)
          : /x$/i.test(descriptor)
            ? Number.parseFloat(descriptor) * 1000
            : 0;
        return { url: parts[0] || "", score: Number.isFinite(score) ? score : 0 };
      })
      .sort((a, b) => b.score - a.score);

    return candidates[0]?.url || "";
  }

  function isUsableImageUrl(value) {
    const source = String(value || "").trim();
    if (!source || /^(?:data|blob|javascript):/i.test(source)) {
      return false;
    }

    return !/(?:favicon|blogger_logo|profile_images|\/avatar|\/icon(?:s)?\/|blank\.(?:gif|png)|transparent\.(?:gif|png))/i.test(source);
  }

  function getImageCandidatesFromElement(image, baseUrl) {
    if (!image) {
      return [];
    }

    const found = [];
    const addValue = (value) => {
      getImageVariants(value, baseUrl).forEach((candidate) => {
        if (!found.includes(candidate)) {
          found.push(candidate);
        }
      });
    };

    [
      "data-original",
      "data-src",
      "data-lazy-src",
      "data-url",
      "data-image",
      "data-fallback-src",
      "src"
    ].forEach((name) => addValue(image.getAttribute(name)));

    ["data-srcset", "srcset"].forEach((name) => {
      addValue(getLargestSrcsetCandidate(image.getAttribute(name)));
    });

    return found;
  }

  function findHtmlImages(html, baseUrl) {
    if (!html) {
      return [];
    }

    try {
      const documentNode = new DOMParser().parseFromString(String(html), "text/html");
      const found = [];
      const selectors = [
        ".post-body img",
        ".post-body-container img",
        "article img",
        "main img",
        "img"
      ];

      for (const selector of selectors) {
        const images = Array.from(documentNode.querySelectorAll(selector));
        for (const image of images) {
          getImageCandidatesFromElement(image, baseUrl).forEach((candidate) => {
            if (!found.includes(candidate)) {
              found.push(candidate);
            }
          });
        }
      }

      return found;
    } catch (error) {
      return [];
    }
  }

  function getEntryPermalink(entry) {
    const links = Array.isArray(entry?.link) ? entry.link : [];
    return links.find((link) => link?.rel === "alternate" && link?.href)?.href || "";
  }

  function getEntryThumbnailCandidates(entry) {
    const permalink = getEntryPermalink(entry) || window.location.href;
    const candidates = [];
    const addValue = (value) => {
      getImageVariants(value, permalink).forEach((candidate) => {
        if (!candidates.includes(candidate)) {
          candidates.push(candidate);
        }
      });
    };

    addValue(entry?.media$thumbnail?.url || "");

    const rawMediaContents = entry?.media$group?.media$content;
    const mediaContents = Array.isArray(rawMediaContents)
      ? rawMediaContents
      : rawMediaContents
        ? [rawMediaContents]
        : [];
    mediaContents.forEach((item) => addValue(item?.url || ""));

    const links = Array.isArray(entry?.link) ? entry.link : [];
    links
      .filter((link) => link?.rel === "enclosure" && /^image\//i.test(link?.type || ""))
      .forEach((link) => addValue(link?.href || ""));

    findHtmlImages(entry?.content?.$t || entry?.summary?.$t || "", permalink)
      .forEach((candidate) => {
        if (!candidates.includes(candidate)) {
          candidates.push(candidate);
        }
      });

    return candidates;
  }

  function indexFeedPayload(payload) {
    const entries = Array.isArray(payload?.feed?.entry) ? payload.feed.entry : [];

    entries.forEach((entry) => {
      const permalink = getEntryPermalink(entry);
      const title = entry?.title?.$t || "";
      const candidates = getEntryThumbnailCandidates(entry);

      addCandidates(thumbnailState.byUrl, normalizePostUrl(permalink), candidates);
      addCandidates(thumbnailState.bySlug, normalizeSlug(permalink), candidates);
      addCandidates(thumbnailState.byTitle, normalizeTitle(title), candidates);
      addCandidates(thumbnailState.byLooseTitle, normalizeLooseTitle(title), candidates);
    });
  }

  function loadJsonpFeed(feedUrl, index, maxResults = CONFIG.thumbnailMaxResults) {
    return new Promise((resolve, reject) => {
      let source;
      try {
        source = new URL(feedUrl, window.location.href);
      } catch (error) {
        reject(error);
        return;
      }

      const callbackName = `hmHubFeedCallback_${Date.now()}_${index}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const script = document.createElement("script");
      let settled = false;

      const cleanup = () => {
        window.clearTimeout(timer);
        script.remove();
        try {
          delete window[callbackName];
        } catch (error) {
          window[callbackName] = undefined;
        }
      };

      const finish = (handler, value) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        handler(value);
      };

      window[callbackName] = (payload) => finish(resolve, payload);

      source.searchParams.set("alt", "json-in-script");
      source.searchParams.set("callback", callbackName);
      source.searchParams.set("max-results", String(maxResults));
      source.searchParams.set("orderby", "published");

      script.async = true;
      script.src = source.href;
      script.onerror = () => finish(reject, new Error(`Blogger feed load failed: ${source.origin}`));

      const timer = window.setTimeout(() => {
        finish(reject, new Error(`Blogger feed timeout: ${source.origin}`));
      }, CONFIG.thumbnailTimeout);

      document.head.appendChild(script);
    });
  }

  function getGameThumbnailCandidates(game) {
    if (!game) {
      return [];
    }

    const candidates = [];
    const addAll = (items, sourceName) => {
      (Array.isArray(items) ? items : []).forEach((item) => {
        if (item && !candidates.includes(item)) {
          candidates.push(item);
        }
      });
      if (candidates.length && sourceName && !thumbnailState.sourceByGame.has(game.id)) {
        thumbnailState.sourceByGame.set(game.id, sourceName);
      }
    };

    if (game.thumbnail) {
      addAll(getImageVariants(game.thumbnail, game.url), "manual");
    }

    addAll(thumbnailState.byUrl.get(normalizePostUrl(game.url)), "feed-url");
    addAll(thumbnailState.bySlug.get(normalizeSlug(game.url)), "feed-slug");

    [game.title, game.shortTitle].forEach((title) => {
      addAll(thumbnailState.byTitle.get(normalizeTitle(title)), "feed-title");
      addAll(thumbnailState.byLooseTitle.get(normalizeLooseTitle(title)), "feed-loose-title");
    });

    return candidates;
  }

  function getGameThumbnail(game) {
    return getGameThumbnailCandidates(game)[0] || "";
  }

  function createFallbackIcon(game, className) {
    const icon = el("span", className);
    icon.appendChild(makeIcon(game?.iconKey));
    return icon;
  }

  function createThumbnailImage(game, className, fallbackClassName) {
    const candidates = getGameThumbnailCandidates(game);
    if (!candidates.length) {
      return createFallbackIcon(game, fallbackClassName);
    }

    const image = el("img", className || "");
    image.alt = game.thumbnailAlt || `${game.title} 게임 대표 이미지`;
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    let cursor = 0;
    const useCandidate = () => {
      if (cursor >= candidates.length) {
        thumbnailState.failedGames.add(game.id);
        thumbnailState.sourceByGame.set(game.id, "all-image-candidates-failed");
        image.replaceWith(createFallbackIcon(game, fallbackClassName));
        return;
      }
      image.src = candidates[cursor];
    };

    image.addEventListener("load", () => {
      thumbnailState.failedGames.delete(game.id);
    });

    image.addEventListener("error", () => {
      cursor += 1;
      useCandidate();
    });

    useCandidate();
    return image;
  }

  function getMetaImageCandidates(documentNode, baseUrl) {
    const found = [];
    [
      'meta[property="og:image:secure_url"]',
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
      'link[rel="image_src"]'
    ].forEach((selector) => {
      documentNode.querySelectorAll(selector).forEach((node) => {
        const value = node.getAttribute("content") || node.getAttribute("href") || "";
        getImageVariants(value, baseUrl).forEach((candidate) => {
          if (!found.includes(candidate)) {
            found.push(candidate);
          }
        });
      });
    });
    return found;
  }

  function extractPageThumbnailCandidates(html, pageUrl) {
    try {
      const documentNode = new DOMParser().parseFromString(String(html || ""), "text/html");
      const found = getMetaImageCandidates(documentNode, pageUrl);
      [
        ".post-body img",
        ".post-body-container img",
        "article img",
        "main img",
        "img"
      ].forEach((selector) => {
        documentNode.querySelectorAll(selector).forEach((image) => {
          getImageCandidatesFromElement(image, pageUrl).forEach((candidate) => {
            if (!found.includes(candidate)) {
              found.push(candidate);
            }
          });
        });
      });
      return found;
    } catch (error) {
      return [];
    }
  }

  function getSameOriginFetchUrl(value) {
    try {
      const target = new URL(value, window.location.href);
      const current = new URL(window.location.href);
      if (target.origin === current.origin) {
        return target.href;
      }

      const normalizeHost = (host) => host.toLowerCase().replace(/^www\./, "");
      if (normalizeHost(target.hostname) === normalizeHost(current.hostname)) {
        return `${current.origin}${target.pathname}${target.search}`;
      }
    } catch (error) {
      return "";
    }
    return "";
  }

  async function fetchPageThumbnail(game) {
    const fetchUrl = getSameOriginFetchUrl(game?.url || "");
    if (!game?.url || getGameThumbnail(game) || !fetchUrl) {
      return false;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), CONFIG.pageThumbnailTimeout);

    try {
      const response = await fetch(fetchUrl, {
        method: "GET",
        credentials: "same-origin",
        cache: "force-cache",
        signal: controller.signal,
        headers: { Accept: "text/html,application/xhtml+xml" }
      });

      if (!response.ok) {
        return false;
      }

      const html = await response.text();
      const candidates = extractPageThumbnailCandidates(html, response.url || fetchUrl);
      if (!candidates.length) {
        return false;
      }

      addCandidates(thumbnailState.byUrl, normalizePostUrl(game.url), candidates);
      addCandidates(thumbnailState.byUrl, normalizePostUrl(response.url), candidates);
      addCandidates(thumbnailState.bySlug, normalizeSlug(game.url), candidates);
      addCandidates(thumbnailState.byTitle, normalizeTitle(game.title), candidates);
      addCandidates(thumbnailState.byLooseTitle, normalizeLooseTitle(game.title), candidates);
      if (game.shortTitle) {
        addCandidates(thumbnailState.byTitle, normalizeTitle(game.shortTitle), candidates);
        addCandidates(thumbnailState.byLooseTitle, normalizeLooseTitle(game.shortTitle), candidates);
      }
      thumbnailState.failedGames.delete(game.id);
      thumbnailState.sourceByGame.set(game.id, "page-meta-or-body");
      thumbnailState.pageSuccessCount += 1;
      return true;
    } catch (error) {
      return false;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function loadMissingSearchFeeds() {
    const pending = getGames().filter((game) => !getGameThumbnail(game));
    if (!pending.length) {
      return;
    }

    const base = "https://www.healing-mart.com/feeds/posts/default";
    const results = await Promise.allSettled(
      pending.map((game, index) => {
        const url = new URL(base);
        url.searchParams.set("q", game.title);
        return loadJsonpFeed(url.href, `search_${index}`, 12);
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        indexFeedPayload(result.value);
      }
    });
  }

  async function loadMissingPageThumbnails() {
    const pending = getGames().filter(
      (game) => !getGameThumbnail(game) && Boolean(getSameOriginFetchUrl(game.url))
    );

    if (pending.length === 0 || typeof fetch !== "function") {
      return;
    }

    let cursor = 0;
    const workerCount = Math.min(
      Math.max(1, Number(CONFIG.pageThumbnailConcurrency) || 1),
      pending.length
    );

    const workers = Array.from({ length: workerCount }, async () => {
      while (cursor < pending.length) {
        const game = pending[cursor];
        cursor += 1;
        const loaded = await fetchPageThumbnail(game);
        if (loaded) {
          renderFeatured();
          renderGames();
        }
      }
    });

    await Promise.all(workers);
  }

  function getThumbnailReport() {
    const games = getGames();
    const items = games.map((game) => {
      const candidates = getGameThumbnailCandidates(game);
      return {
        id: game.id,
        title: game.title,
        url: game.url,
        loaded: candidates.length > 0 && !thumbnailState.failedGames.has(game.id),
        candidateCount: candidates.length,
        source: thumbnailState.sourceByGame.get(game.id) || "fallback-svg"
      };
    });

    return {
      version: VERSION,
      status: thumbnailState.status,
      total: games.length,
      loaded: items.filter((item) => item.loaded).length,
      fallback: items.filter((item) => !item.loaded).length,
      feedSuccessCount: thumbnailState.feedSuccessCount,
      pageSuccessCount: thumbnailState.pageSuccessCount,
      items
    };
  }

  async function loadBloggerThumbnails(force = false) {
    if (!Array.isArray(CONFIG.thumbnailFeeds) || CONFIG.thumbnailFeeds.length === 0) {
      thumbnailState.status = "disabled";
      return;
    }

    if (!force && ["loaded", "partial"].includes(thumbnailState.status)) {
      return;
    }

    if (!force && thumbnailState.request) {
      return thumbnailState.request;
    }

    if (force) {
      thumbnailState.byUrl.clear();
      thumbnailState.byTitle.clear();
      thumbnailState.bySlug.clear();
      thumbnailState.byLooseTitle.clear();
      thumbnailState.sourceByGame.clear();
      thumbnailState.failedGames.clear();
      thumbnailState.feedSuccessCount = 0;
      thumbnailState.pageSuccessCount = 0;
    }

    thumbnailState.status = "loading";
    thumbnailState.request = Promise.allSettled(
      CONFIG.thumbnailFeeds.map((feedUrl, index) => loadJsonpFeed(feedUrl, index))
    )
      .then(async (results) => {
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            thumbnailState.feedSuccessCount += 1;
            indexFeedPayload(result.value);
          }
        });

        renderFeatured();
        renderGames();

        thumbnailState.status = "searching-missing";
        await loadMissingSearchFeeds();
        renderFeatured();
        renderGames();

        thumbnailState.status = "loading-pages";
        await loadMissingPageThumbnails();

        const report = getThumbnailReport();
        if (report.loaded === report.total) {
          thumbnailState.status = "loaded";
        } else if (report.loaded > 0) {
          thumbnailState.status = "partial";
        } else {
          thumbnailState.status = "failed";
        }

        renderFeatured();
        renderGames();
      })
      .catch(() => {
        thumbnailState.status = "failed";
      })
      .finally(() => {
        thumbnailState.request = null;
      });

    return thumbnailState.request;
  }

  function getFilteredGames() {
    const query = normalize(state.query);

    return getGames().filter((game) => {
      if (state.newOnly && !game.isNew) {
        return false;
      }

      if (state.category !== "all" && game.category !== state.category) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text = normalize(
        [
          game.title,
          game.shortTitle,
          game.description,
          game.menuDescription,
          game.category
        ]
          .filter(Boolean)
          .join(" ")
      );

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
        --hm-hub-bg:#f5f8fc;
        --hm-hub-card:#ffffff;
        --hm-hub-text:#17233a;
        --hm-hub-muted:#68768d;
        --hm-hub-line:#dfe6ef;
        --hm-hub-brand:#327fd7;
        --hm-hub-brand-dark:#2468b8;
        --hm-hub-brand-soft:#eaf4ff;
        --hm-hub-danger:#c8465b;
        --hm-hub-shadow:0 12px 34px rgba(30,55,90,.09);

        position:relative;
        width:100%;
        margin:0 auto;
        padding:0 0 112px;

        color:var(--hm-hub-text);
        font-family:
          "Pretendard Variable",
          Pretendard,
          "SUIT Variable",
          SUIT,
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          system-ui,
          -apple-system,
          "Segoe UI",
          sans-serif;
        font-size:16px;
        line-height:1.6;
        word-break:keep-all;
        -webkit-font-smoothing:antialiased;
        text-rendering:optimizeLegibility;
      }

      #${ROOT_ID} a {
        color:inherit;
      }

      #${ROOT_ID} button,
      #${ROOT_ID} input {
        font:inherit;
      }

      #${ROOT_ID} svg {
        fill:none;
        stroke:currentColor;
        stroke-width:1.8;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      #${ROOT_ID} .hm-hub-shell {
        width:100%;
        overflow:hidden;
        border:1px solid var(--hm-hub-line);
        border-radius:28px;
        background:var(--hm-hub-bg);
      }

      #${ROOT_ID} .hm-hub-hero {
        position:relative;
        padding:34px 24px 28px;
        overflow:hidden;
        background:#ffffff;
        border-bottom:1px solid #becbd9;
      }

      #${ROOT_ID} .hm-hub-hero-row {
        position:relative;
        z-index:1;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:18px;
        text-align:center;
      }

      #${ROOT_ID} .hm-hub-brand-wrap {
        min-width:0;
        width:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:14px;
        text-align:center;
      }

      #${ROOT_ID} .hm-hub-logo {
        flex:0 0 58px;
        width:58px;
        height:58px;
        display:grid;
        place-items:center;
        color:#ffffff;
        border-radius:18px;
        background:var(--hm-hub-brand);
      }

      #${ROOT_ID} .hm-hub-logo svg {
        width:31px;
        height:31px;
      }

      #${ROOT_ID} .hm-hub-heading {
        min-width:0;
      }

      #${ROOT_ID} .hm-hub-heading h1 {
        margin:0;
        color:var(--hm-hub-text);
        font-size:clamp(30px,4.6vw,42px);
        line-height:1.16;
        font-weight:900;
        letter-spacing:-.05em;
      }

      #${ROOT_ID} .hm-hub-heading p {
        margin:8px 0 0;
        color:var(--hm-hub-muted);
        font-size:15px;
        line-height:1.6;
        font-weight:650;
      }

      #${ROOT_ID} .hm-hub-total {
        flex:0 0 auto;
        min-width:0;
        padding:11px 15px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        text-align:center;
        border:1px solid #bfd2e8;
        border-radius:999px;
        background:var(--hm-hub-brand-soft);
      }

      #${ROOT_ID} .hm-hub-total strong {
        display:inline;
        color:var(--hm-hub-brand-dark);
        font-size:20px;
        line-height:1.1;
        font-weight:850;
      }

      #${ROOT_ID} .hm-hub-total span {
        display:inline;
        margin-top:0;
        color:#60748c;
        font-size:12px;
        font-weight:750;
      }

      #${ROOT_ID} .hm-hub-controls {
        padding:18px 20px 16px;
        background:#ffffff;
        border-bottom:1px solid #becbd9;
      }

      #${ROOT_ID} .hm-hub-search-wrap {
        position:relative;
      }

      #${ROOT_ID} .hm-hub-search-icon {
        position:absolute;
        left:16px;
        top:50%;
        width:20px;
        height:20px;
        color:#71849a;
        transform:translateY(-50%);
        pointer-events:none;
      }

      #${ROOT_ID} .hm-hub-search {
        width:100%;
        height:54px;
        padding:0 48px;
        color:var(--hm-hub-text);
        border:1px solid #d7e0eb;
        border-radius:17px;
        background:#f9fbfd;
        outline:none;
        font-size:15px;
        font-weight:650;
      }

      #${ROOT_ID} .hm-hub-search::placeholder {
        color:#8a97a8;
      }

      #${ROOT_ID} .hm-hub-search::-webkit-search-cancel-button,
      #${ROOT_ID} .hm-hub-search::-webkit-search-decoration {
        display:none;
        -webkit-appearance:none;
        appearance:none;
      }

      #${ROOT_ID} .hm-hub-search::-ms-clear,
      #${ROOT_ID} .hm-hub-search::-ms-reveal {
        display:none;
        width:0;
        height:0;
      }

      #${ROOT_ID} .hm-hub-search:focus {
        border-color:#78abe5;
        background:#ffffff;
        box-shadow:0 0 0 4px rgba(50,127,215,.11);
      }

      #${ROOT_ID} .hm-hub-clear {
        position:absolute;
        right:8px;
        top:50%;
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        padding:0;
        color:#6f7e91;
        border:0;
        border-radius:12px;
        background:transparent;
        transform:translateY(-50%);
        cursor:pointer;
      }

      #${ROOT_ID} .hm-hub-clear:hover {
        background:#edf2f7;
      }

      #${ROOT_ID} .hm-hub-clear svg {
        width:17px;
        height:17px;
      }

      #${ROOT_ID} .hm-hub-clear[hidden] {
        display:none;
      }

      #${ROOT_ID} .hm-hub-category-row {
        display:flex;
        align-items:center;
        gap:8px;
        margin-top:12px;
        padding:1px 0 2px;
        overflow-x:auto;
        overscroll-behavior-x:contain;
        scrollbar-width:none;
      }

      #${ROOT_ID} .hm-hub-category-row::-webkit-scrollbar {
        display:none;
      }

      #${ROOT_ID} .hm-hub-chip {
        flex:0 0 auto;
        min-height:42px;
        padding:0 15px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        color:#46586e;
        border:1.5px solid #8fa3b8;
        border-radius:999px;
        background:#ffffff;
        cursor:pointer;
        font-size:13px;
        font-weight:800;
        white-space:nowrap;
      }

      #${ROOT_ID} .hm-hub-chip:hover {
        color:var(--hm-hub-brand-dark);
        border-color:#5f84ad;
      }

      #${ROOT_ID} .hm-hub-chip.is-active {
        color:#ffffff;
        border-color:var(--hm-hub-brand);
        background:var(--hm-hub-brand);
      }

      #${ROOT_ID} .hm-hub-chip-count {
        min-width:21px;
        height:21px;
        padding:0 6px;
        display:inline-grid;
        place-items:center;
        color:#66778d;
        border-radius:999px;
        background:#edf1f6;
        font-size:10px;
        line-height:1;
      }

      #${ROOT_ID} .hm-hub-chip.is-active .hm-hub-chip-count {
        color:var(--hm-hub-brand-dark);
        background:#ffffff;
      }

      #${ROOT_ID} .hm-hub-content {
        padding:24px 20px 26px;
      }

      #${ROOT_ID} .hm-hub-section + .hm-hub-section {
        margin-top:32px;
      }

      #${ROOT_ID} .hm-hub-section-head {
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:14px;
      }

      #${ROOT_ID} .hm-hub-section-title {
        min-width:0;
      }

      #${ROOT_ID} .hm-hub-section-title h2 {
        margin:0;
        color:var(--hm-hub-text);
        font-size:21px;
        line-height:1.25;
        font-weight:850;
        letter-spacing:-.035em;
      }

      #${ROOT_ID} .hm-hub-section-title p {
        margin:5px 0 0;
        color:var(--hm-hub-muted);
        font-size:12px;
        font-weight:600;
      }

      #${ROOT_ID} .hm-hub-result-count {
        flex:0 0 auto;
        color:var(--hm-hub-brand-dark);
        font-size:13px;
        font-weight:800;
      }

      #${ROOT_ID} .hm-hub-featured {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:12px;
      }

      #${ROOT_ID} .hm-hub-feature-card {
        min-width:0;
        display:flex;
        align-items:center;
        gap:12px;
        min-height:104px;
        padding:14px;
        color:var(--hm-hub-text);
        text-decoration:none;
        border:1px solid var(--hm-hub-line);
        border-radius:19px;
        background:#ffffff;
        transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease;
      }

      #${ROOT_ID} .hm-hub-feature-card:hover {
        transform:translateY(-2px);
        border-color:#abc9ea;
        box-shadow:var(--hm-hub-shadow);
      }

      #${ROOT_ID} .hm-hub-feature-media {
        flex:0 0 84px;
        width:84px;
        aspect-ratio:16/10;
        display:grid;
        place-items:center;
        overflow:hidden;
        color:var(--hm-hub-brand-dark);
        border:1px solid #dce6f1;
        border-radius:15px;
        background:var(--hm-hub-brand-soft);
      }

      #${ROOT_ID} .hm-hub-feature-media img {
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
      }

      #${ROOT_ID} .hm-hub-feature-icon {
        width:100%;
        height:100%;
        display:grid;
        place-items:center;
      }

      #${ROOT_ID} .hm-hub-feature-icon svg {
        width:27px;
        height:27px;
      }

      #${ROOT_ID} .hm-hub-feature-copy {
        min-width:0;
      }

      #${ROOT_ID} .hm-hub-feature-copy strong {
        display:block;
        overflow:hidden;
        color:var(--hm-hub-text);
        font-size:14px;
        line-height:1.35;
        font-weight:850;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      #${ROOT_ID} .hm-hub-feature-copy span {
        display:-webkit-box;
        margin-top:5px;
        overflow:hidden;
        color:var(--hm-hub-muted);
        font-size:11px;
        line-height:1.45;
        font-weight:600;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
      }

      #${ROOT_ID} .hm-hub-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:14px;
      }

      #${ROOT_ID} .hm-hub-card {
        min-width:0;
        overflow:hidden;
        border:1px solid var(--hm-hub-line);
        border-radius:21px;
        background:var(--hm-hub-card);
        transition:transform .17s ease,border-color .17s ease,box-shadow .17s ease;
      }

      #${ROOT_ID} .hm-hub-card:hover {
        transform:translateY(-2px);
        border-color:#a9c8e9;
        box-shadow:var(--hm-hub-shadow);
      }

      #${ROOT_ID} .hm-hub-card-link {
        height:100%;
        display:flex;
        flex-direction:column;
        color:var(--hm-hub-text);
        text-decoration:none;
      }

      #${ROOT_ID} .hm-hub-media {
        position:relative;
        aspect-ratio:16/9;
        display:grid;
        place-items:center;
        overflow:hidden;
        color:var(--hm-hub-brand-dark);
        background:#eaf4ff;
        border-bottom:1px solid #e1e9f2;
      }

      #${ROOT_ID} .hm-hub-media img {
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
      }

      #${ROOT_ID} .hm-hub-media img,
      #${ROOT_ID} .hm-hub-feature-media img {
        background:#edf3f8;
      }

      #${ROOT_ID} .hm-hub-media-icon {
        width:62px;
        height:62px;
        display:grid;
        place-items:center;
        color:#ffffff;
        border-radius:20px;
        background:var(--hm-hub-brand);
      }

      #${ROOT_ID} .hm-hub-media-icon svg {
        width:34px;
        height:34px;
      }

      #${ROOT_ID} .hm-hub-badges {
        position:absolute;
        top:11px;
        left:11px;
        right:11px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        pointer-events:none;
      }

      #${ROOT_ID} .hm-hub-badge {
        min-height:27px;
        padding:0 9px;
        display:inline-flex;
        align-items:center;
        border-radius:999px;
        color:#ffffff;
        background:rgba(24,38,60,.82);
        font-size:10px;
        font-weight:850;
      }

      #${ROOT_ID} .hm-hub-badge.is-new {
        color:#ffffff;
        background:var(--hm-hub-brand);
      }

      #${ROOT_ID} .hm-hub-card-body {
        flex:1 1 auto;
        padding:16px 16px 15px;
        display:flex;
        flex-direction:column;
      }

      #${ROOT_ID} .hm-hub-card-body h3 {
        display:-webkit-box;
        margin:0;
        overflow:hidden;
        color:var(--hm-hub-text);
        font-size:17px;
        line-height:1.38;
        font-weight:850;
        letter-spacing:-.025em;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
      }

      #${ROOT_ID} .hm-hub-card-body p {
        display:-webkit-box;
        margin:8px 0 0;
        overflow:hidden;
        color:var(--hm-hub-muted);
        font-size:12px;
        line-height:1.55;
        font-weight:600;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
      }

      #${ROOT_ID} .hm-hub-play {
        margin-top:auto;
        padding-top:15px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        color:var(--hm-hub-brand-dark);
        font-size:12px;
        font-weight:850;
      }

      #${ROOT_ID} .hm-hub-play svg {
        width:18px;
        height:18px;
      }

      #${ROOT_ID} .hm-hub-empty {
        min-height:270px;
        display:grid;
        place-items:center;
        padding:38px 20px;
        text-align:center;
        border:1px dashed #cbd7e4;
        border-radius:22px;
        background:#ffffff;
      }

      #${ROOT_ID} .hm-hub-empty[hidden] {
        display:none;
      }

      #${ROOT_ID} .hm-hub-empty-icon {
        width:58px;
        height:58px;
        display:grid;
        place-items:center;
        margin:0 auto 12px;
        color:#6e89a5;
        border-radius:18px;
        background:#edf3f9;
      }

      #${ROOT_ID} .hm-hub-empty-icon svg {
        width:29px;
        height:29px;
      }

      #${ROOT_ID} .hm-hub-empty strong {
        display:block;
        color:#35475e;
        font-size:16px;
        font-weight:850;
      }

      #${ROOT_ID} .hm-hub-empty span {
        display:block;
        margin-top:5px;
        color:var(--hm-hub-muted);
        font-size:12px;
      }

      #${ROOT_ID} .hm-hub-guide {
        margin-top:28px;
        padding:18px;
        border:1px solid #dce5ef;
        border-radius:20px;
        background:#ffffff;
      }

      #${ROOT_ID} .hm-hub-guide strong {
        display:block;
        color:#31445c;
        font-size:14px;
        font-weight:850;
      }

      #${ROOT_ID} .hm-hub-guide p {
        margin:6px 0 0;
        color:var(--hm-hub-muted);
        font-size:11px;
        line-height:1.7;
        font-weight:600;
      }

      #${ROOT_ID} .hm-hub-guide-links {
        display:flex;
        align-items:center;
        gap:14px;
        margin-top:12px;
        flex-wrap:wrap;
      }

      #${ROOT_ID} .hm-hub-guide-links a {
        color:var(--hm-hub-brand-dark);
        text-decoration:none;
        font-size:12px;
        font-weight:800;
      }

      #${ROOT_ID} .hm-hub-guide-links a:hover {
        text-decoration:underline;
      }

      #${ROOT_ID} .hm-hub-dock {
        width:min(650px,calc(100% - 24px));
        min-height:58px;
        padding:5px 8px;
        position:fixed;
        left:50%;
        bottom:12px;
        z-index:2147482000;
        transform:translateX(-50%);
        display:grid;
        grid-template-columns:repeat(5,minmax(0,1fr));
        gap:5px;
        border:1px solid rgba(203,213,225,.95);
        border-radius:18px;
        background:rgba(255,255,255,.97);
        box-shadow:0 12px 34px rgba(15,23,42,.18);
        -webkit-backdrop-filter:blur(16px);
        backdrop-filter:blur(16px);
      }

      #${ROOT_ID} .hm-hub-dock-item {
        min-width:0;
        min-height:46px;
        padding:6px 8px;
        border:0;
        border-radius:12px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:center;
        gap:7px;
        color:#334155;
        background:transparent;
        text-decoration:none;
        font:inherit;
        font-size:13px;
        font-weight:850;
        line-height:1;
        cursor:pointer;
      }

      #${ROOT_ID} .hm-hub-dock-item:hover,
      #${ROOT_ID} .hm-hub-dock-item.is-active {
        color:var(--hm-hub-brand-dark);
        background:var(--hm-hub-brand-soft);
      }

      #${ROOT_ID} .hm-hub-dock-item[data-hm-hub-quick] {
        color:#ffffff;
        background:linear-gradient(135deg,#2563eb,#4d76ed);
        box-shadow:0 7px 18px rgba(37,99,235,.25);
      }

      #${ROOT_ID} .hm-hub-dock-item[data-hm-hub-quick]:hover {
        color:#ffffff;
        background:linear-gradient(135deg,#1d4ed8,#4368df);
      }

      #${ROOT_ID} .hm-hub-dock-item svg {
        flex:0 0 auto;
        width:20px;
        height:20px;
      }

      #${ROOT_ID} .hm-hub-dock-item span {
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      #${ROOT_ID} .hm-hub-backdrop {
        position:fixed;
        inset:0;
        z-index:2147482100;
        background:rgba(19,31,50,.47);
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        transition:opacity .2s ease,visibility .2s ease;
      }

      #${ROOT_ID} .hm-hub-backdrop.is-open {
        opacity:1;
        visibility:visible;
        pointer-events:auto;
      }

      #${ROOT_ID} .hm-hub-sheet {
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        z-index:2147482200;
        width:100%;
        max-height:min(78vh,650px);
        max-height:min(78dvh,650px);
        padding:9px 16px max(18px,env(safe-area-inset-bottom));
        overflow-y:auto;
        border:1px solid var(--hm-hub-line);
        border-bottom:0;
        border-radius:26px 26px 0 0;
        background:#ffffff;
        box-shadow:0 -24px 64px rgba(18,38,65,.22);
        transform:translateY(104%);
        visibility:hidden;
        transition:transform .27s cubic-bezier(.22,.82,.31,1),visibility .27s;
      }

      #${ROOT_ID} .hm-hub-sheet.is-open {
        transform:translateY(0);
        visibility:visible;
      }

      #${ROOT_ID} .hm-hub-sheet-handle {
        width:48px;
        height:5px;
        margin:0 auto 11px;
        border-radius:999px;
        background:#d4dce6;
      }

      #${ROOT_ID} .hm-hub-sheet-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:14px;
        margin-bottom:14px;
      }

      #${ROOT_ID} .hm-hub-sheet-head h2 {
        margin:0;
        color:var(--hm-hub-text);
        font-size:20px;
        line-height:1.3;
        font-weight:850;
        letter-spacing:-.035em;
      }

      #${ROOT_ID} .hm-hub-sheet-close {
        flex:0 0 42px;
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        padding:0;
        color:#5d6a7d;
        border:1px solid var(--hm-hub-line);
        border-radius:13px;
        background:#f8fafc;
        cursor:pointer;
      }

      #${ROOT_ID} .hm-hub-sheet-close svg {
        width:19px;
        height:19px;
      }

      #${ROOT_ID} .hm-hub-sheet-categories {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:9px;
        margin-top:14px;
      }

      #${ROOT_ID} .hm-hub-sheet-category {
        min-height:58px;
        padding:10px 13px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        color:#46586f;
        border:1.5px solid #8fa3b8;
        border-radius:15px;
        background:#ffffff;
        cursor:pointer;
        text-align:left;
        font-size:13px;
        font-weight:800;
      }

      #${ROOT_ID} .hm-hub-sheet-category.is-active {
        color:var(--hm-hub-brand-dark);
        border-color:#5796dc;
        background:var(--hm-hub-brand-soft);
      }

      #${ROOT_ID} .hm-hub-sheet-category span:last-child {
        color:#738399;
        font-size:11px;
      }

      #${ROOT_ID} .hm-hub-share-sheet {
        position:fixed;
        left:50%;
        bottom:18px;
        z-index:2147482200;
        width:min(590px,calc(100% - 24px));
        padding:10px 20px max(22px,env(safe-area-inset-bottom));
        border:1px solid var(--hm-hub-line);
        border-radius:26px;
        background:#ffffff;
        box-shadow:0 22px 70px rgba(18,38,65,.26);
        transform:translate(-50%,calc(100% + 36px));
        visibility:hidden;
        transition:transform .27s cubic-bezier(.22,.82,.31,1),visibility .27s;
      }

      #${ROOT_ID} .hm-hub-share-sheet.is-open {
        transform:translate(-50%,0);
        visibility:visible;
      }

      #${ROOT_ID} .hm-hub-share-intro {
        margin:-5px 0 18px;
        color:var(--hm-hub-muted);
        font-size:13px;
        line-height:1.55;
        text-align:center;
        font-weight:650;
      }

      #${ROOT_ID} .hm-hub-share-buttons {
        display:grid;
        grid-template-columns:repeat(6,minmax(0,1fr));
        gap:14px 8px;
        align-items:start;
      }

      #${ROOT_ID} .hm-hub-share-more {
        display:none;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:14px 8px;
        margin-top:18px;
        padding-top:18px;
        border-top:1px solid #edf1f5;
      }

      #${ROOT_ID} .hm-hub-share-more.is-open {
        display:grid;
      }

      #${ROOT_ID} .hm-hub-share-item {
        min-width:0;
        padding:0;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:flex-start;
        gap:8px;
        color:#44546a;
        border:0;
        background:transparent;
        cursor:pointer;
        font-size:11px;
        line-height:1.25;
        font-weight:750;
      }

      #${ROOT_ID} .hm-hub-share-circle {
        width:50px;
        height:50px;
        display:grid;
        place-items:center;
        border-radius:50%;
        box-shadow:0 3px 9px rgba(0,0,0,.14);
        transition:transform .2s ease,box-shadow .2s ease;
      }

      #${ROOT_ID} .hm-hub-share-item:hover .hm-hub-share-circle {
        transform:translateY(-3px) scale(1.04);
        box-shadow:0 7px 17px rgba(0,0,0,.19);
      }

      #${ROOT_ID} .hm-hub-share-circle svg {
        width:24px;
        height:24px;
        fill:inherit;
        stroke:none;
      }

      #${ROOT_ID} .hm-hub-share-label {
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      #${ROOT_ID} .hm-share-kakao .hm-hub-share-circle {background:#FEE500}
      #${ROOT_ID} .hm-share-naver .hm-hub-share-circle {background:#03C75A}
      #${ROOT_ID} .hm-share-facebook .hm-hub-share-circle {background:#1877F2}
      #${ROOT_ID} .hm-share-x .hm-hub-share-circle {background:#000000}
      #${ROOT_ID} .hm-share-threads .hm-hub-share-circle {background:#000000}
      #${ROOT_ID} .hm-share-more-button .hm-hub-share-circle {background:#666666}
      #${ROOT_ID} .hm-share-copy .hm-hub-share-circle {background:#6B7280}
      #${ROOT_ID} .hm-share-band .hm-hub-share-circle {background:#44DA5B}
      #${ROOT_ID} .hm-share-telegram .hm-hub-share-circle {background:#0088CC}

      #${ROOT_ID} .hm-hub-toast {
        position:fixed;
        left:50%;
        bottom:100px;
        z-index:2147482300;
        max-width:calc(100% - 40px);
        padding:11px 16px;
        color:#ffffff;
        border-radius:999px;
        background:#24364e;
        box-shadow:0 10px 28px rgba(18,35,58,.25);
        opacity:0;
        visibility:hidden;
        transform:translate(-50%,8px);
        transition:opacity .18s ease,transform .18s ease,visibility .18s;
        font-size:12px;
        font-weight:750;
        white-space:nowrap;
      }

      #${ROOT_ID} .hm-hub-toast.is-show {
        opacity:1;
        visibility:visible;
        transform:translate(-50%,0);
      }

      #${ROOT_ID} .hm-hub-search:focus-visible,
      #${ROOT_ID} button:focus-visible,
      #${ROOT_ID} a:focus-visible {
        outline:3px solid rgba(50,127,215,.28);
        outline-offset:2px;
      }

      body.hm-hub-sheet-open {
        overflow:hidden !important;
      }

      @media (max-width:820px) {
        #${ROOT_ID} .hm-hub-featured {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        #${ROOT_ID} .hm-hub-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
      }

      @media (max-width:560px) {
        #${ROOT_ID} {
          padding-bottom:103px;
        }

        #${ROOT_ID} .hm-hub-shell {
          border-left:0;
          border-right:0;
          border-radius:0;
        }

        #${ROOT_ID} .hm-hub-hero {
          padding:28px 16px 22px;
        }

        #${ROOT_ID} .hm-hub-hero-row {
          align-items:center;
          text-align:center;
        }

        #${ROOT_ID} .hm-hub-brand-wrap {
          gap:12px;
        }

        #${ROOT_ID} .hm-hub-logo {
          flex-basis:50px;
          width:50px;
          height:50px;
          border-radius:16px;
        }

        #${ROOT_ID} .hm-hub-logo svg {
          width:27px;
          height:27px;
        }

        #${ROOT_ID} .hm-hub-heading h1 {
          font-size:29px;
        }

        #${ROOT_ID} .hm-hub-heading p {
          font-size:13px;
        }

        #${ROOT_ID} .hm-hub-total {
          min-width:0;
          padding:9px 12px;
        }

        #${ROOT_ID} .hm-hub-total strong {
          font-size:18px;
        }

        #${ROOT_ID} .hm-hub-controls {
          padding:15px 14px 14px;
        }

        #${ROOT_ID} .hm-hub-search {
          height:50px;
          border-radius:15px;
        }

        #${ROOT_ID} .hm-hub-content {
          padding:20px 14px 24px;
        }

        #${ROOT_ID} .hm-hub-section-head {
          align-items:flex-start;
        }

        #${ROOT_ID} .hm-hub-section-title h2 {
          font-size:19px;
        }

        #${ROOT_ID} .hm-hub-featured {
          display:grid;
          grid-auto-flow:column;
          grid-auto-columns:minmax(235px,78vw);
          grid-template-columns:none;
          gap:10px;
          padding:1px 1px 7px;
          overflow-x:auto;
          overscroll-behavior-x:contain;
          scroll-snap-type:x proximity;
          scrollbar-width:none;
        }

        #${ROOT_ID} .hm-hub-featured::-webkit-scrollbar {
          display:none;
        }

        #${ROOT_ID} .hm-hub-feature-card {
          scroll-snap-align:start;
        }

        #${ROOT_ID} .hm-hub-grid {
          grid-template-columns:1fr;
          gap:12px;
        }

        #${ROOT_ID} .hm-hub-card-link {
          display:grid;
          grid-template-columns:132px minmax(0,1fr);
        }

        #${ROOT_ID} .hm-hub-media {
          aspect-ratio:auto;
          min-height:156px;
          border-right:1px solid #e1e9f2;
          border-bottom:0;
        }

        #${ROOT_ID} .hm-hub-media-icon {
          width:55px;
          height:55px;
          border-radius:18px;
        }

        #${ROOT_ID} .hm-hub-media-icon svg {
          width:30px;
          height:30px;
        }

        #${ROOT_ID} .hm-hub-card-body {
          min-width:0;
          padding:14px 14px 13px;
        }

        #${ROOT_ID} .hm-hub-card-body h3 {
          font-size:16px;
        }

        #${ROOT_ID} .hm-hub-card-body p {
          font-size:11px;
          -webkit-line-clamp:3;
        }

        #${ROOT_ID} .hm-hub-dock {
          width:calc(100% - 16px);
          max-width:540px;
          min-height:70px;
          padding:6px 7px calc(6px + env(safe-area-inset-bottom));
          bottom:8px;
          border-radius:20px;
          gap:4px;
        }

        #${ROOT_ID} .hm-hub-dock-item {
          min-height:58px;
          padding:5px 2px;
          flex-direction:column;
          gap:3px;
          border-radius:14px;
          font-size:10.5px;
          line-height:1.15;
        }

        #${ROOT_ID} .hm-hub-dock-item svg {
          width:22px;
          height:22px;
        }

        #${ROOT_ID} .hm-hub-share-sheet {
          left:0;
          right:0;
          bottom:0;
          width:100%;
          padding:9px 15px max(20px,env(safe-area-inset-bottom));
          border-bottom:0;
          border-radius:26px 26px 0 0;
          transform:translateY(104%);
        }

        #${ROOT_ID} .hm-hub-share-sheet.is-open {
          transform:translateY(0);
        }

        #${ROOT_ID} .hm-hub-share-buttons {
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:17px 8px;
        }

        #${ROOT_ID} .hm-hub-share-circle {
          width:48px;
          height:48px;
        }
      }

      @media (max-width:390px) {
        #${ROOT_ID} .hm-hub-hero-row {
          display:flex;
        }

        #${ROOT_ID} .hm-hub-total {
          width:max-content;
          min-width:0;
          margin:0 auto;
          padding:8px 12px;
          display:inline-flex;
          align-items:center;
          gap:5px;
        }

        #${ROOT_ID} .hm-hub-total strong,
        #${ROOT_ID} .hm-hub-total span {
          display:inline;
          margin:0;
        }

        #${ROOT_ID} .hm-hub-card-link {
          grid-template-columns:112px minmax(0,1fr);
        }

        #${ROOT_ID} .hm-hub-media {
          min-height:152px;
        }

        #${ROOT_ID} .hm-hub-sheet-categories {
          grid-template-columns:1fr;
        }
      }

      @media (min-width:900px) {
        #${ROOT_ID} .hm-hub-sheet {
          left:50%;
          right:auto;
          bottom:50%;
          width:min(620px,calc(100% - 40px));
          max-height:min(680px,calc(100vh - 70px));
          padding:19px 20px 22px;
          border-bottom:1px solid #becbd9;
          border-radius:24px;
          transform:translate(-50%,58%) scale(.97);
          opacity:0;
        }

        #${ROOT_ID} .hm-hub-sheet.is-open {
          transform:translate(-50%,50%) scale(1);
          opacity:1;
        }

        #${ROOT_ID} .hm-hub-sheet-handle {
          display:none;
        }

        #${ROOT_ID} .hm-hub-sheet-categories {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
      }

      @media (prefers-reduced-motion:reduce) {
        #${ROOT_ID} *,
        #${ROOT_ID} *::before,
        #${ROOT_ID} *::after {
          scroll-behavior:auto !important;
          transition:none !important;
          animation:none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createSearch(className, inputId) {
    const wrap = el("div", className);
    const icon = makeIcon("search", "hm-hub-search-icon");
    const input = el("input", "hm-hub-search");
    const clear = button("hm-hub-clear", "검색어 지우기", "close");

    input.id = inputId;
    input.type = "text";
    input.inputMode = "search";
    input.autocomplete = "off";
    input.placeholder = "게임 이름이나 종류를 검색하세요";
    input.setAttribute("aria-label", "미니게임 검색");

    clear.hidden = true;
    clear.dataset.hmHubClear = "true";

    wrap.append(icon, input, clear);
    return wrap;
  }

  function createHeader() {
    const hero = el("header", "hm-hub-hero");
    const row = el("div", "hm-hub-hero-row");
    const brandWrap = el("div", "hm-hub-brand-wrap");
    const logo = el("div", "hm-hub-logo");
    const heading = el("div", "hm-hub-heading");
    const title = el("h1", "", CONFIG.title);
    const subtitle = el("p", "", CONFIG.subtitle);
    const total = el("div", "hm-hub-total");
    const totalStrong = el("strong", "");
    const totalLabel = el("span", "", "등록 게임");

    logo.appendChild(makeIcon("category"));
    heading.append(title, subtitle);
    brandWrap.append(logo, heading);
    total.append(totalStrong, totalLabel);
    total.dataset.hmHubTotal = "true";
    row.append(brandWrap, total);
    hero.appendChild(row);

    return hero;
  }

  function createControls() {
    const controls = el("section", "hm-hub-controls");
    controls.setAttribute("aria-label", "게임 검색 및 카테고리");

    const search = createSearch("hm-hub-search-wrap", "hmHubMainSearch");
    const categories = el("div", "hm-hub-category-row");
    categories.dataset.hmHubCategoryRow = "true";

    controls.append(search, categories);
    return controls;
  }

  function createSection(titleText, descriptionText, className) {
    const section = el("section", `hm-hub-section ${className || ""}`.trim());
    const head = el("div", "hm-hub-section-head");
    const titleWrap = el("div", "hm-hub-section-title");
    const title = el("h2", "", titleText);
    const description = el("p", "", descriptionText);

    titleWrap.append(title, description);
    head.appendChild(titleWrap);
    section.appendChild(head);

    return { section, head, titleWrap };
  }

  function createContent() {
    const content = el("main", "hm-hub-content");

    const featuredSection = createSection(
      "새로 추가된 게임",
      "최근 등록된 게임을 빠르게 시작해 보세요.",
      "hm-hub-new-section"
    );
    const featuredGrid = el("div", "hm-hub-featured");
    featuredGrid.dataset.hmHubFeatured = "true";
    featuredSection.section.appendChild(featuredGrid);

    const allSection = createSection(
      "전체 미니게임",
      "카테고리와 검색으로 원하는 게임을 찾아보세요.",
      "hm-hub-all-section"
    );
    const resultCount = el("div", "hm-hub-result-count");
    resultCount.dataset.hmHubResultCount = "true";
    allSection.head.appendChild(resultCount);

    const grid = el("div", "hm-hub-grid");
    grid.dataset.hmHubGrid = "true";

    const empty = el("div", "hm-hub-empty");
    empty.hidden = true;
    empty.dataset.hmHubEmpty = "true";
    const emptyBox = el("div", "");
    const emptyIcon = el("div", "hm-hub-empty-icon");
    emptyIcon.appendChild(makeIcon("search"));
    const emptyTitle = el("strong", "", "검색 결과가 없습니다.");
    const emptyText = el("span", "", "다른 검색어나 카테고리를 선택해 주세요.");
    emptyBox.append(emptyIcon, emptyTitle, emptyText);
    empty.appendChild(emptyBox);

    const guide = el("aside", "hm-hub-guide");
    const guideTitle = el("strong", "", "이용안내");
    const guideText = el(
      "p",
      "",
      "힐링편의점 미니게임은 별도의 설치 없이 웹브라우저에서 이용할 수 있습니다. 브라우저와 기기 환경에 따라 사운드, 진동 등 일부 기능에 차이가 있을 수 있습니다."
    );
    const guideLinks = el("div", "hm-hub-guide-links");
    const guideLink = el("a", "", "이용안내·저작권");
    const reportLink = el("a", "", "오류신고");
    guideLink.href = CONFIG.guideUrl;
    reportLink.href = CONFIG.reportUrl;
    guideLinks.append(guideLink, reportLink);
    guide.append(guideTitle, guideText, guideLinks);

    allSection.section.append(grid, empty, guide);
    content.append(featuredSection.section, allSection.section);

    return content;
  }

  function createDockItem(tag, label, iconKey) {
    const node = el(tag, "hm-hub-dock-item");
    if (tag === "button") {
      node.type = "button";
    }
    node.setAttribute("aria-label", label);
    node.append(makeIcon(iconKey), el("span", "", label));
    return node;
  }

  function createDock() {
    const dock = el("nav", "hm-hub-dock");
    dock.setAttribute("aria-label", "미니게임 빠른 메뉴");

    const home = createDockItem("a", "홈", "home");
    home.href = CONFIG.homeUrl;

    const quick = createDockItem("button", "빠른찾기", "search");
    quick.dataset.hmHubQuick = "true";

    const newest = createDockItem("button", "새 게임", "spark");
    newest.dataset.hmHubNew = "true";
    newest.setAttribute("aria-pressed", "false");

    const category = createDockItem("button", "카테고리", "category");
    category.dataset.hmHubCategoryOpen = "true";

    const share = createDockItem("button", "공유", "share");
    share.dataset.hmHubShare = "true";

    dock.append(home, quick, newest, category, share);
    return dock;
  }

  function createSheet() {
    const backdrop = el("div", "hm-hub-backdrop");
    backdrop.dataset.hmHubSheetClose = "true";

    const sheet = el("section", "hm-hub-sheet");
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "hmHubCategoryTitle");
    sheet.setAttribute("aria-hidden", "true");

    const handle = el("div", "hm-hub-sheet-handle");
    handle.setAttribute("aria-hidden", "true");

    const head = el("div", "hm-hub-sheet-head");
    const title = el("h2", "", "카테고리와 검색");
    title.id = "hmHubCategoryTitle";
    const close = button("hm-hub-sheet-close", "카테고리 창 닫기", "close");
    close.dataset.hmHubSheetClose = "true";
    head.append(title, close);

    const search = createSearch("hm-hub-search-wrap", "hmHubSheetSearch");
    const categories = el("div", "hm-hub-sheet-categories");
    categories.dataset.hmHubSheetCategories = "true";

    sheet.append(handle, head, search, categories);
    return { backdrop, sheet };
  }

  function createShareButton(provider, label, className) {
    const node = el("button", `hm-hub-share-item ${className}`);
    node.type = "button";
    node.dataset.hmHubShareProvider = provider;
    node.setAttribute("aria-label", `${label}로 공유`);

    const circle = el("span", "hm-hub-share-circle");
    circle.appendChild(makeShareIcon(provider));
    node.append(circle, el("span", "hm-hub-share-label", label));
    return node;
  }

  function createShareSheet() {
    const backdrop = el("div", "hm-hub-backdrop hm-hub-share-backdrop");
    backdrop.dataset.hmHubShareClose = "true";

    const sheet = el("section", "hm-hub-share-sheet");
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "hmHubShareTitle");
    sheet.setAttribute("aria-hidden", "true");

    const handle = el("div", "hm-hub-sheet-handle");
    handle.setAttribute("aria-hidden", "true");

    const head = el("div", "hm-hub-sheet-head");
    const title = el("h2", "", "공유하기");
    title.id = "hmHubShareTitle";
    const close = button("hm-hub-sheet-close", "공유 창 닫기", "close");
    close.dataset.hmHubShareClose = "true";
    head.append(title, close);

    const intro = el("p", "hm-hub-share-intro", "도움이 되셨다면 원하는 곳에 공유해 주세요.");
    const buttons = el("div", "hm-hub-share-buttons");
    buttons.append(
      createShareButton("kakao", "카카오톡", "hm-share-kakao"),
      createShareButton("naver", "네이버", "hm-share-naver"),
      createShareButton("facebook", "페이스북", "hm-share-facebook"),
      createShareButton("x", "X", "hm-share-x"),
      createShareButton("threads", "Threads", "hm-share-threads"),
      createShareButton("more", "더보기", "hm-share-more-button")
    );

    const more = el("div", "hm-hub-share-more");
    more.dataset.hmHubShareMore = "true";
    more.append(
      createShareButton("copy", "링크 복사", "hm-share-copy"),
      createShareButton("band", "네이버 밴드", "hm-share-band"),
      createShareButton("telegram", "텔레그램", "hm-share-telegram")
    );

    sheet.append(handle, head, intro, buttons, more);
    return { backdrop, sheet };
  }

  function createToast() {
    const toast = el("div", "hm-hub-toast");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.dataset.hmHubToast = "true";
    return toast;
  }

  function mount() {
    const root = document.getElementById(ROOT_ID);
    if (!root) {
      return;
    }

    root.dataset.hmMiniGameHub = VERSION;

    const shell = el("div", "hm-hub-shell");
    shell.append(createHeader(), createControls(), createContent());

    const dock = createDock();
    const { backdrop, sheet } = createSheet();
    const { backdrop: shareBackdrop, sheet: shareSheet } = createShareSheet();
    const toast = createToast();

    root.append(shell, dock, backdrop, sheet, shareBackdrop, shareSheet, toast);
  }

  function createCategoryChip(id, title, count, active) {
    const chip = button(`hm-hub-chip${active ? " is-active" : ""}`, title);
    chip.dataset.hmHubCategory = id;
    chip.setAttribute("aria-pressed", active ? "true" : "false");
    chip.append(el("span", "", title), el("span", "hm-hub-chip-count", String(count)));
    return chip;
  }

  function renderCategoryRows() {
    const root = document.getElementById(ROOT_ID);
    const topRow = root?.querySelector("[data-hm-hub-category-row]");
    const sheetRow = root?.querySelector("[data-hm-hub-sheet-categories]");
    if (!topRow || !sheetRow) {
      return;
    }

    const games = getGames();
    const categories = getCategories().filter((category) =>
      games.some((game) => game.category === category.id)
    );

    topRow.replaceChildren();
    sheetRow.replaceChildren();

    const topAll = createCategoryChip(
      "all",
      "전체",
      games.length,
      state.category === "all" && !state.newOnly
    );
    topRow.appendChild(topAll);

    const sheetAll = button(
      `hm-hub-sheet-category${state.category === "all" && !state.newOnly ? " is-active" : ""}`,
      "전체 게임"
    );
    sheetAll.dataset.hmHubCategory = "all";
    sheetAll.append(el("span", "", "전체 게임"), el("span", "", `${games.length}개`));
    sheetRow.appendChild(sheetAll);

    categories.forEach((category) => {
      const count = games.filter((game) => game.category === category.id).length;
      const active = state.category === category.id && !state.newOnly;
      topRow.appendChild(createCategoryChip(category.id, category.title, count, active));

      const sheetButton = button(
        `hm-hub-sheet-category${active ? " is-active" : ""}`,
        category.title
      );
      sheetButton.dataset.hmHubCategory = category.id;
      sheetButton.append(el("span", "", category.title), el("span", "", `${count}개`));
      sheetRow.appendChild(sheetButton);
    });
  }

  function createFeatureCard(game) {
    const link = el("a", "hm-hub-feature-card");
    link.href = game.url;
    link.setAttribute("aria-label", `${game.title} 게임 시작`);

    const media = el("span", "hm-hub-feature-media");
    media.appendChild(
      createThumbnailImage(game, "", "hm-hub-feature-icon")
    );

    const copy = el("span", "hm-hub-feature-copy");
    copy.append(
      el("strong", "", game.shortTitle || game.title),
      el("span", "", game.menuDescription || game.description || "게임 바로가기")
    );

    link.append(media, copy);
    return link;
  }

  function createGameCard(game, categoryMap) {
    const article = el("article", "hm-hub-card");
    const link = el("a", "hm-hub-card-link");
    link.href = game.url;
    link.setAttribute("aria-label", `${game.title} 게임 시작`);

    const media = el("div", "hm-hub-media");
    media.appendChild(
      createThumbnailImage(game, "", "hm-hub-media-icon")
    );

    const badges = el("div", "hm-hub-badges");
    const category = categoryMap.get(game.category);
    badges.appendChild(el("span", "hm-hub-badge", category?.shortTitle || category?.title || "미니게임"));
    if (game.isNew) {
      badges.appendChild(el("span", "hm-hub-badge is-new", "NEW"));
    }
    media.appendChild(badges);

    const body = el("div", "hm-hub-card-body");
    const title = el("h3", "", game.title);
    const description = el("p", "", game.menuDescription || game.description || "바로 즐기는 무료 미니게임");
    const play = el("span", "hm-hub-play");
    play.append(el("span", "", "게임 시작하기"), makeIcon("arrow"));
    body.append(title, description, play);

    link.append(media, body);
    article.appendChild(link);
    return article;
  }

  function renderFeatured() {
    const root = document.getElementById(ROOT_ID);
    const holder = root?.querySelector("[data-hm-hub-featured]");
    const section = root?.querySelector(".hm-hub-new-section");
    if (!holder || !section) {
      return;
    }

    const featured = getGames()
      .filter((game) => game.isNew || game.featured)
      .sort((a, b) => (Number(b.order) || 0) - (Number(a.order) || 0))
      .slice(0, CONFIG.featuredCount);

    holder.replaceChildren(...featured.map(createFeatureCard));
    section.hidden = featured.length === 0;
  }

  function syncSearchInputs() {
    const root = document.getElementById(ROOT_ID);
    root?.querySelectorAll(".hm-hub-search").forEach((input) => {
      if (input.value !== state.query) {
        input.value = state.query;
      }
    });

    root?.querySelectorAll("[data-hm-hub-clear]").forEach((clear) => {
      clear.hidden = !state.query;
    });
  }

  function renderGames() {
    const root = document.getElementById(ROOT_ID);
    const grid = root?.querySelector("[data-hm-hub-grid]");
    const empty = root?.querySelector("[data-hm-hub-empty]");
    const resultCount = root?.querySelector("[data-hm-hub-result-count]");
    const total = root?.querySelector("[data-hm-hub-total] strong");
    const newButton = root?.querySelector("[data-hm-hub-new]");

    if (!grid || !empty || !resultCount || !total || !newButton) {
      return;
    }

    const allGames = getGames();
    const games = getFilteredGames();
    const categoryMap = getCategoryMap();

    total.textContent = String(allGames.length);
    resultCount.textContent = `${games.length}개 게임`;

    grid.replaceChildren(...games.map((game) => createGameCard(game, categoryMap)));
    grid.hidden = games.length === 0;
    empty.hidden = games.length !== 0;

    newButton.classList.toggle("is-active", state.newOnly);
    newButton.setAttribute("aria-pressed", state.newOnly ? "true" : "false");

    syncSearchInputs();
    renderCategoryRows();
  }

  function showToast(message) {
    const root = document.getElementById(ROOT_ID);
    const toast = root?.querySelector("[data-hm-hub-toast]");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("is-show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("is-show");
    }, 1800);
  }

  function syncBodySheetLock() {
    document.body.classList.toggle(
      "hm-hub-sheet-open",
      state.categorySheetOpen || state.shareSheetOpen
    );
  }

  function openCategorySheet() {
    if (state.shareSheetOpen) {
      closeShareSheet();
    }

    const root = document.getElementById(ROOT_ID);
    const backdrop = root?.querySelector(".hm-hub-backdrop");
    const sheet = root?.querySelector(".hm-hub-sheet");
    const search = root?.querySelector("#hmHubSheetSearch");
    if (!backdrop || !sheet || state.categorySheetOpen) {
      return;
    }

    state.categorySheetOpen = true;
    backdrop.classList.add("is-open");
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    syncBodySheetLock();
    window.setTimeout(() => search?.focus(), 90);
  }

  function closeCategorySheet() {
    const root = document.getElementById(ROOT_ID);
    const backdrop = root?.querySelector(".hm-hub-backdrop");
    const sheet = root?.querySelector(".hm-hub-sheet");
    if (!backdrop || !sheet || !state.categorySheetOpen) {
      return;
    }

    state.categorySheetOpen = false;
    backdrop.classList.remove("is-open");
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    syncBodySheetLock();
  }

  function applyCategory(category) {
    state.category = category || "all";
    state.newOnly = false;
    renderGames();
    closeCategorySheet();

    document
      .querySelector(`#${ROOT_ID} .hm-hub-all-section`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function quickFind() {
    const input = document.querySelector(`#${ROOT_ID} #hmHubMainSearch`);
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => input?.focus(), 320);
  }

  function getShareData() {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const imageMeta = document.querySelector('meta[property="og:image"]');
    return {
      title: document.title || CONFIG.title,
      description: descriptionMeta?.content || CONFIG.subtitle,
      image: imageMeta?.content || "",
      url: window.location.href
    };
  }

  function openShareWindow(url) {
    const popup = window.open(url, "_blank", "noopener,noreferrer,width=720,height=720");
    if (popup) {
      popup.opener = null;
    }
  }

  async function copyShareUrl() {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      showToast("링크가 복사되었습니다.");
      return true;
    } catch (error) {
      showToast("주소창의 링크를 복사해 주세요.");
      return false;
    }
  }

  function ensureKakaoSdk() {
    if (window.Kakao) {
      return Promise.resolve(window.Kakao);
    }
    if (ensureKakaoSdk.request) {
      return ensureKakaoSdk.request;
    }

    ensureKakaoSdk.request = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
      script.async = true;
      script.onload = () => (window.Kakao ? resolve(window.Kakao) : reject(new Error("Kakao SDK unavailable")));
      script.onerror = () => reject(new Error("Kakao SDK load failed"));
      document.head.appendChild(script);
    }).finally(() => {
      ensureKakaoSdk.request = null;
    });

    return ensureKakaoSdk.request;
  }

  async function shareKakao(data) {
    try {
      const Kakao = await ensureKakaoSdk();
      const key = window.HM_HUB_KAKAO_JS_KEY || "a6897bdb5b7785b0ffbe542d81886b93";
      if (!Kakao.isInitialized()) {
        Kakao.init(key);
      }

      const content = {
        title: data.title,
        description: data.description,
        link: { mobileWebUrl: data.url, webUrl: data.url }
      };
      if (data.image) {
        content.imageUrl = data.image;
      }

      if (Kakao.Share?.sendDefault) {
        Kakao.Share.sendDefault({ objectType: "feed", content });
        return;
      }
      if (Kakao.Link?.sendDefault) {
        Kakao.Link.sendDefault({ objectType: "feed", content });
        return;
      }
      throw new Error("Kakao share unavailable");
    } catch (error) {
      if (navigator.share) {
        try {
          await navigator.share({ title: data.title, text: data.description, url: data.url });
          return;
        } catch (shareError) {
          if (shareError?.name === "AbortError") {
            return;
          }
        }
      }
      await copyShareUrl();
    }
  }

  async function handleShareProvider(provider) {
    const data = getShareData();

    if (provider === "more") {
      state.shareMoreOpen = !state.shareMoreOpen;
      const more = document.querySelector(`#${ROOT_ID} [data-hm-hub-share-more]`);
      more?.classList.toggle("is-open", state.shareMoreOpen);
      return;
    }

    if (provider === "kakao") {
      await shareKakao(data);
      return;
    }

    if (provider === "copy") {
      await copyShareUrl();
      return;
    }

    const encodedUrl = encodeURIComponent(data.url);
    const encodedTitle = encodeURIComponent(data.title);
    const encodedText = encodeURIComponent(`${data.title}\n${data.url}`);
    const urls = {
      naver: `https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      threads: `https://www.threads.net/intent/post?text=${encodedText}`,
      band: `https://band.us/plugin/share?body=${encodeURIComponent(`${data.title}\r\n${data.url}`)}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    };

    if (urls[provider]) {
      openShareWindow(urls[provider]);
    }
  }

  function openShareSheet() {
    const root = document.getElementById(ROOT_ID);
    const backdrop = root?.querySelector(".hm-hub-share-backdrop");
    const sheet = root?.querySelector(".hm-hub-share-sheet");
    if (!backdrop || !sheet || state.shareSheetOpen) {
      return;
    }

    if (state.categorySheetOpen) {
      closeCategorySheet();
    }

    state.shareSheetOpen = true;
    state.shareMoreOpen = false;
    root?.querySelector("[data-hm-hub-share-more]")?.classList.remove("is-open");
    backdrop.classList.add("is-open");
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    syncBodySheetLock();
  }

  function closeShareSheet() {
    const root = document.getElementById(ROOT_ID);
    const backdrop = root?.querySelector(".hm-hub-share-backdrop");
    const sheet = root?.querySelector(".hm-hub-share-sheet");
    if (!backdrop || !sheet || !state.shareSheetOpen) {
      return;
    }

    state.shareSheetOpen = false;
    state.shareMoreOpen = false;
    backdrop.classList.remove("is-open");
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    root?.querySelector("[data-hm-hub-share-more]")?.classList.remove("is-open");
    syncBodySheetLock();
  }

  function bind() {
    const root = document.getElementById(ROOT_ID);
    if (!root) {
      return;
    }

    root.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const quick = target.closest("[data-hm-hub-quick]");
      if (quick) {
        event.preventDefault();
        quickFind();
        return;
      }

      const newest = target.closest("[data-hm-hub-new]");
      if (newest) {
        event.preventDefault();
        state.newOnly = !state.newOnly;
        state.category = "all";
        renderGames();
        document
          .querySelector(`#${ROOT_ID} .hm-hub-all-section`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const categoryOpen = target.closest("[data-hm-hub-category-open]");
      if (categoryOpen) {
        event.preventDefault();
        openCategorySheet();
        return;
      }

      const category = target.closest("[data-hm-hub-category]");
      if (category) {
        event.preventDefault();
        applyCategory(category.dataset.hmHubCategory);
        return;
      }

      const clear = target.closest("[data-hm-hub-clear]");
      if (clear) {
        event.preventDefault();
        state.query = "";
        renderGames();
        const parentInput = clear.parentElement?.querySelector(".hm-hub-search");
        parentInput?.focus();
        return;
      }

      const share = target.closest("[data-hm-hub-share]");
      if (share) {
        event.preventDefault();
        openShareSheet();
        return;
      }

      const shareProvider = target.closest("[data-hm-hub-share-provider]");
      if (shareProvider) {
        event.preventDefault();
        handleShareProvider(shareProvider.dataset.hmHubShareProvider);
        return;
      }

      const shareClose = target.closest("[data-hm-hub-share-close]");
      if (shareClose) {
        event.preventDefault();
        closeShareSheet();
        return;
      }

      const sheetClose = target.closest("[data-hm-hub-sheet-close]");
      if (sheetClose) {
        event.preventDefault();
        closeCategorySheet();
      }
    });

    root.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.classList.contains("hm-hub-search")) {
        return;
      }

      state.query = target.value || "";
      syncSearchInputs();
      renderGames();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      if (state.shareSheetOpen) {
        event.preventDefault();
        closeShareSheet();
        return;
      }
      if (state.categorySheetOpen) {
        event.preventDefault();
        closeCategorySheet();
      }
    });
  }

  function renderError() {
    const root = document.getElementById(ROOT_ID);
    if (!root) {
      return;
    }

    const error = el("div", "hm-hub-empty");
    error.hidden = false;
    const box = el("div", "");
    const icon = el("div", "hm-hub-empty-icon");
    icon.appendChild(makeIcon("category"));
    box.append(
      icon,
      el("strong", "", "게임 데이터를 불러오지 못했습니다."),
      el("span", "", "hm-games-data 파일의 주소와 로딩 순서를 확인해 주세요.")
    );
    error.appendChild(box);
    root.replaceChildren(error);
  }

  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root || root.dataset.hmHubReady === "true") {
      return;
    }

    root.dataset.hmHubReady = "true";
    injectStyle();

    if (!Array.isArray(window.HM_GAMES)) {
      renderError();
      return;
    }

    mount();
    renderFeatured();
    renderGames();
    bind();
    loadBloggerThumbnails();
  }

  window.HMGameHub = Object.freeze({
    refresh() {
      renderFeatured();
      renderGames();
    },
    setCategory(category) {
      applyCategory(category);
    },
    openCategories() {
      openCategorySheet();
    },
    openShare() {
      openShareSheet();
    },
    reloadThumbnails() {
      return loadBloggerThumbnails(true);
    },
    getThumbnailStatus() {
      return thumbnailState.status;
    },
    getThumbnailReport() {
      return getThumbnailReport();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
