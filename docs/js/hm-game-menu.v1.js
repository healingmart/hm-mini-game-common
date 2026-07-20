/*
 * Healing Mart Common Game Menu v1.4.3
 * 카테고리 필터, 검색, 현재 게임 표시
 * 상단 오류신고 및 하드코딩 이용안내·저작권
 * 외부 라이브러리 없음
 */
(() => {
  "use strict";

  const STYLE_ID =
    "hmCommonGameMenuStyle";

  const ROOT_ID =
    "hmCommonGameMenuRoot";

  const HOME_URL =
    "https://www.healing-mart.com/";

  const GAME_HOME_URL =
    "https://www.healing-mart.com/search/label/%EB%AF%B8%EB%8B%88%EA%B2%8C%EC%9E%84";

  const QNA_URL =
    "https://www.healing-mart.com/p/qna.html";

  const FIXED_SUPPORT = Object.freeze({
    title: "이용안내 및 저작권",

    text:
      "힐링편의점의 미니게임은 개인 이용자를 위한 오락 콘텐츠입니다. 모든 게임은 Android 환경을 기준으로 제작·테스트되었으며, iOS 기기 및 일부 브라우저 환경에서는 사운드·진동(햅틱) 등 일부 기능이 정상적으로 동작하지 않을 수 있습니다. 게임 디자인, 설명문, 이미지 및 자체 제작 콘텐츠의 저작권은 힐링편의점에 있으며 무단 복제, 재배포 및 상업적 이용을 금합니다.",

    copyright:
      "© 2026 Healing Mart · 힐링편의점",

    homeLabel:
      "힐링편의점 홈",

    homeUrl:
      HOME_URL
  });

  const state = {
    open: false,
    currentGameId: "",
    category: "all",
    query: "",
    returnFocus: null
  };


  /* ==================================================
     공통
  ================================================== */

  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]
    );


  function getCurrentGameId() {
    const explicit =
      document.querySelector(
        "[data-current-game]"
      );

    if (
      explicit?.dataset.currentGame
    ) {
      return explicit.dataset
        .currentGame.trim();
    }

    const app =
      document.querySelector(
        "[data-game-id]"
      );

    if (app?.dataset.gameId) {
      return app.dataset.gameId.trim();
    }

    return "";
  }


  function getPublishedGames() {
    const games =
      Array.isArray(window.HM_GAMES)
        ? window.HM_GAMES
        : [];

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


  function getCurrentGame() {
    return (
      getPublishedGames().find(
        (game) =>
          game.id === state.currentGameId
      ) || null
    );
  }


  function getCategories() {
    return Array.isArray(
      window.HM_GAME_CATEGORIES
    )
      ? window.HM_GAME_CATEGORIES
      : [];
  }


  function getCategoryMap() {
    return new Map(
      getCategories().map(
        (category) => [
          category.id,
          category
        ]
      )
    );
  }


  function appendQuery(
    url,
    values
  ) {
    if (!url) {
      return "#";
    }

    try {
      const parsed =
        new URL(
          url,
          window.location.href
        );

      Object.entries(values).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== ""
          ) {
            parsed.searchParams.set(
              key,
              String(value)
            );
          }
        }
      );

      return parsed.href;
    } catch (error) {
      return url;
    }
  }


  function getQnaUrl() {
    const currentGame =
      getCurrentGame();

    return appendQuery(
      QNA_URL,
      {
        type: "game",

        game:
          state.currentGameId || "",

        title:
          currentGame?.title ||
          currentGame?.shortTitle ||
          document.title ||
          "",

        page:
          window.location.href
      }
    );
  }


  /*
   * 각 게임 상단 제목 아래의 작은 문구를
   * 공통 문구로 변경합니다.
   *
   * 우선순위:
   * 1. data-hm-game-menu-caption
   * 2. 메뉴 버튼 안의 small 요소
   */
  function updateGameTitleCaptions() {
    const triggers =
      document.querySelectorAll(
        "[data-hm-game-menu-open]"
      );

    triggers.forEach(
      (trigger) => {
        const caption =
          trigger.querySelector(
            "[data-hm-game-menu-caption]"
          ) ||
          trigger.querySelector("small");

        if (!caption) {
          return;
        }

        caption.textContent =
          "게임 더보기 ＋ · 오류신고";
      }
    );
  }


  function updateExternalQnaLinks() {
    const qnaUrl =
      getQnaUrl();

    document
      .querySelectorAll(
        "[data-hm-game-qna]"
      )
      .forEach((link) => {
        link.href = qnaUrl;
      });
  }


  /* ==================================================
     스타일
  ================================================== */

  function injectStyle() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${ROOT_ID},
      #${ROOT_ID} * {
        box-sizing:border-box;
      }

      #${ROOT_ID} {
        --hm-menu-card:#ffffff;
        --hm-menu-ink:#17233b;
        --hm-menu-muted:#6d7890;
        --hm-menu-line:#dde5f0;
        --hm-menu-brand:#3985e6;
        --hm-menu-brand-dark:#2569bd;
        --hm-menu-brand-soft:#eaf4ff;
        --hm-menu-report:#df5267;
        --hm-menu-report-dark:#b9364c;
        --hm-menu-report-soft:#fff1f3;

        color:var(--hm-menu-ink);

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
        line-height:1.5;
        word-break:keep-all;

        -webkit-font-smoothing:
          antialiased;

        text-rendering:
          optimizeLegibility;
      }


      /* 배경 */

      .hm-menu-backdrop {
        position:fixed;
        inset:0;
        z-index:2147483300;

        background:
          rgba(18,30,51,.48);

        -webkit-backdrop-filter:
          blur(2px);

        backdrop-filter:
          blur(2px);

        opacity:0;
        visibility:hidden;
        pointer-events:none;

        transition:
          opacity .22s ease,
          visibility .22s ease;
      }

      .hm-menu-backdrop.is-open {
        opacity:1;
        visibility:visible;
        pointer-events:auto;
      }


      /* 하단 메뉴 */

      .hm-menu-sheet {
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        z-index:2147483310;

        width:100%;

        height:min(88vh,780px);
        height:min(88dvh,780px);

        display:grid;
        grid-template-rows:
          auto minmax(0,1fr);

        padding:
          8px 14px
          max(
            14px,
            env(safe-area-inset-bottom)
          );

        overflow:hidden;

        border:
          1px solid
          var(--hm-menu-line);

        border-bottom:0;
        border-radius:
          26px 26px 0 0;

        background:
          linear-gradient(
            180deg,
            #ffffff 0,
            #f8fbff 100%
          );

        box-shadow:
          0 -26px 76px
          rgba(18,38,70,.26);

        transform:
          translateY(104%);

        visibility:hidden;

        transition:
          transform .3s
            cubic-bezier(
              .22,
              .82,
              .31,
              1
            ),
          visibility .3s;
      }

      .hm-menu-sheet.is-open {
        transform:
          translateY(0);

        visibility:visible;
      }

      .hm-menu-top {
        min-width:0;
      }

      .hm-menu-handle {
        width:48px;
        height:5px;

        margin:0 auto 7px;

        border-radius:999px;
        background:#d2dbe7;
      }


      /* 메뉴 제목 */

      .hm-menu-head {
        min-height:59px;

        display:flex;
        align-items:center;
        justify-content:
          space-between;

        gap:12px;

        padding:3px 2px 11px;
      }

      .hm-menu-title-wrap {
        min-width:0;

        display:flex;
        align-items:center;

        gap:10px;
      }

      .hm-menu-title-icon {
        flex:0 0 42px;

        width:42px;
        height:42px;

        display:grid;
        place-items:center;

        color:#ffffff;

        border-radius:14px;

        background:
          linear-gradient(
            145deg,
            #5aa7f7,
            #337bd2
          );

        box-shadow:
          0 7px 16px
          rgba(51,123,210,.22);
      }

      .hm-menu-title-icon svg {
        width:23px;
        height:23px;

        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .hm-menu-brand {
        min-width:0;
      }

      .hm-menu-brand h2 {
        margin:0;

        overflow:hidden;

        color:var(--hm-menu-ink);

        font-size:19px;
        line-height:1.2;
        font-weight:850;
        letter-spacing:-.035em;

        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .hm-menu-brand small {
        display:block;

        margin-top:3px;

        overflow:hidden;

        color:var(--hm-menu-muted);

        font-size:11px;
        line-height:1.3;
        font-weight:650;

        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .hm-menu-close {
        flex:0 0 42px;

        width:42px;
        height:42px;

        display:grid;
        place-items:center;

        padding:0;

        color:#526078;

        border:
          1px solid
          var(--hm-menu-line);

        border-radius:13px;
        background:#f7f9fc;

        cursor:pointer;
      }

      .hm-menu-close:hover {
        color:#30445f;
        border-color:#cbd8e7;
        background:#ffffff;
      }

      .hm-menu-close svg {
        width:20px;
        height:20px;

        fill:none;
        stroke:currentColor;
        stroke-width:2;
        stroke-linecap:round;
      }


      /* 검색 및 상단 카테고리 */

      .hm-menu-controls {
        padding:0 1px 11px;
        border-bottom:
          1px solid #e9eef5;
      }

      .hm-menu-search-wrap {
        position:relative;
        margin-bottom:10px;
      }

      .hm-menu-search-wrap[hidden] {
        display:none !important;
      }

      .hm-menu-search-icon {
        position:absolute;
        left:13px;
        top:50%;

        width:18px;
        height:18px;

        transform:
          translateY(-50%);

        fill:none;
        stroke:#7890aa;
        stroke-width:2;

        pointer-events:none;
      }

      .hm-menu-search {
        width:100%;
        height:46px;

        padding:0 40px;

        color:var(--hm-menu-ink);

        border:
          1px solid #d8e2ed;

        border-radius:14px;

        background:#ffffff;
        outline:none;

        font-size:15px;
        font-weight:600;
      }

      .hm-menu-search:focus {
        border-color:#75aef0;

        box-shadow:
          0 0 0 3px
          rgba(57,133,230,.12);
      }

      .hm-menu-search-clear {
        position:absolute;
        right:7px;
        top:50%;

        width:32px;
        height:32px;

        transform:
          translateY(-50%);

        color:#76869b;

        border:0;
        border-radius:10px;

        background:transparent;

        cursor:pointer;
        font-size:18px;
      }

      .hm-menu-search-clear:hover {
        background:#edf3f9;
      }

      .hm-menu-search-clear[hidden] {
        display:none !important;
      }

      .hm-menu-tabs {
        display:flex;
        align-items:center;

        gap:7px;

        padding:1px 1px 2px;

        overflow-x:auto;
        overflow-y:hidden;

        scrollbar-width:none;

        overscroll-behavior-x:
          contain;
      }

      .hm-menu-tabs::-webkit-scrollbar {
        display:none;
      }


      /* 카테고리 버튼 */

      .hm-menu-tab {
        flex:0 0 auto;

        min-height:39px;

        padding:0 13px;

        display:inline-flex;
        align-items:center;
        justify-content:center;

        gap:6px;

        color:#58677d;

        border:
          1px solid #dce4ee;

        border-radius:999px;
        background:#ffffff;

        cursor:pointer;

        font-size:12px;
        font-weight:800;
        white-space:nowrap;
      }

      .hm-menu-tab:hover {
        color:#326fae;
        border-color:#a9c9ea;
      }

      .hm-menu-tab-count {
        min-width:20px;
        height:20px;

        padding:0 6px;

        display:inline-grid;
        place-items:center;

        color:#718096;

        border-radius:999px;
        background:#edf2f7;

        font-size:10px;
      }

      .hm-menu-tab.is-active {
        color:#ffffff;

        border-color:
          var(--hm-menu-brand);

        background:
          linear-gradient(
            135deg,
            var(--hm-menu-brand),
            #65aef5
          );

        box-shadow:
          0 6px 14px
          rgba(57,133,230,.2);
      }

      .hm-menu-tab.is-active
      .hm-menu-tab-count {
        color:#296fbf;
        background:#ffffff;
      }


      /* 상단 오류신고 */

      .hm-menu-report-tab {
        flex:0 0 auto;

        min-height:39px;

        padding:0 13px;

        display:inline-flex;
        align-items:center;
        justify-content:center;

        gap:6px;

        color:var(
          --hm-menu-report-dark
        );

        text-decoration:none;

        border:
          1px solid #f0b9c2;

        border-radius:999px;

        background:
          var(--hm-menu-report-soft);

        font-size:12px;
        font-weight:850;
        white-space:nowrap;

        transition:
          color .16s ease,
          border-color .16s ease,
          background-color .16s ease,
          transform .16s ease;
      }

      .hm-menu-report-tab:hover {
        color:#ffffff;

        border-color:
          var(--hm-menu-report);

        background:
          var(--hm-menu-report);

        transform:
          translateY(-1px);
      }

      .hm-menu-report-tab-icon {
        font-size:13px;
        line-height:1;
      }


      /* 스크롤 영역 */

      .hm-menu-scroll {
        min-height:0;
        height:100%;

        padding:14px 1px 5px;

        overflow-y:auto;
        overflow-x:hidden;

        overscroll-behavior:
          contain;

        -webkit-overflow-scrolling:
          touch;
      }

      .hm-menu-summary {
        min-height:32px;

        display:flex;
        align-items:center;
        justify-content:
          space-between;

        gap:10px;

        margin-bottom:9px;

        color:var(--hm-menu-muted);

        font-size:11px;
        font-weight:650;
      }

      .hm-menu-summary strong {
        color:
          var(--hm-menu-brand-dark);

        font-size:12px;
      }


      /* 게임 카드 */

      .hm-menu-grid {
        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap:9px;
      }

      .hm-menu-card {
        position:relative;

        min-width:0;
        min-height:112px;

        padding:13px;

        display:flex;
        flex-direction:column;
        align-items:flex-start;

        gap:9px;

        color:var(--hm-menu-ink);
        text-decoration:none;

        border:
          1px solid
          var(--hm-menu-line);

        border-radius:17px;

        background:
          var(--hm-menu-card);

        box-shadow:
          0 7px 19px
          rgba(35,65,105,.06);

        transition:
          transform .16s ease,
          border-color .16s ease,
          box-shadow .16s ease;
      }

      .hm-menu-card:hover {
        transform:
          translateY(-1px);

        border-color:#aacdf3;

        box-shadow:
          0 9px 23px
          rgba(35,65,105,.09);
      }

      .hm-menu-card.is-current {
        border-color:#79b4f2;

        background:
          linear-gradient(
            145deg,
            #f0f8ff,
            #e8f4ff
          );

        pointer-events:none;
      }

      .hm-menu-card-top {
        width:100%;

        display:flex;
        align-items:center;
        justify-content:
          space-between;

        gap:8px;
      }

      .hm-menu-icon {
        flex:0 0 42px;

        width:42px;
        height:42px;

        display:grid;
        place-items:center;

        border-radius:14px;

        background:
          linear-gradient(
            145deg,
            #edf6ff,
            #dceeff
          );

        font-size:22px;
      }

      .hm-menu-badge {
        flex:0 0 auto;

        padding:4px 7px;

        color:#ffffff;

        border-radius:999px;
        background:
          var(--hm-menu-brand);

        font-size:9px;
        font-weight:850;
      }

      .hm-menu-badge.is-new {
        color:#0a7556;
        background:#dff7ee;
      }

      .hm-menu-copy {
        min-width:0;
        width:100%;
      }

      .hm-menu-copy strong {
        display:block;

        overflow:hidden;

        color:var(--hm-menu-ink);

        font-size:14px;
        line-height:1.3;
        font-weight:850;

        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .hm-menu-copy small {
        display:-webkit-box;

        margin-top:5px;

        overflow:hidden;

        color:var(--hm-menu-muted);

        font-size:11px;
        line-height:1.45;
        font-weight:600;

        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
      }

      .hm-menu-category-label {
        margin-top:auto;

        color:#5f7895;

        font-size:10px;
        font-weight:750;
      }


      /* 결과 없음 */

      .hm-menu-empty {
        min-height:210px;

        display:grid;
        place-items:center;

        padding:28px 15px;

        color:var(--hm-menu-muted);

        text-align:center;
      }

      .hm-menu-empty svg {
        width:43px;
        height:43px;

        margin:0 auto 10px;

        fill:none;
        stroke:#91a6bd;
        stroke-width:1.7;
      }

      .hm-menu-empty strong {
        display:block;

        color:#42526a;

        font-size:14px;
      }

      .hm-menu-empty span {
        display:block;

        margin-top:4px;

        font-size:11px;
      }


      /* 하드코딩 이용안내·저작권 */

      .hm-menu-support {
        margin-top:18px;
        padding:15px 16px;

        border:
          1px solid #dfe9f4;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #f7fbff,
            #eef7ff
          );
      }

      .hm-menu-support-head {
        display:flex;
        align-items:flex-start;

        gap:10px;
      }

      .hm-menu-support-icon {
        flex:0 0 38px;

        width:38px;
        height:38px;

        display:grid;
        place-items:center;

        border-radius:12px;

        background:#ffffff;

        box-shadow:
          0 5px 14px
          rgba(42,85,130,.08);

        font-size:18px;
      }

      .hm-menu-support-copy {
        min-width:0;
      }

      .hm-menu-support-copy strong {
        display:block;

        color:#243b58;

        font-size:13px;
        font-weight:850;
      }

      .hm-menu-support-copy p {
        margin:4px 0 0;

        color:#6b7d92;

        font-size:10px;
        line-height:1.65;
        font-weight:600;
      }

      .hm-menu-copyright {
        margin:11px 0 0;

        color:#8997a8;

        text-align:center;

        font-size:9px;
        line-height:1.5;
        font-weight:600;
      }


      /* 게임 모음·홈 */

      .hm-menu-links {
        display:grid;
        grid-template-columns:1fr 1fr;

        gap:8px;

        margin-top:12px;
      }

      .hm-menu-link {
        min-height:48px;

        display:flex;
        align-items:center;
        justify-content:center;

        gap:7px;

        color:#43546b;
        text-decoration:none;

        border:
          1px solid
          var(--hm-menu-line);

        border-radius:14px;

        background:#ffffff;

        font-size:12px;
        font-weight:800;
      }

      .hm-menu-link:hover {
        color:#286db4;
        border-color:#aacbea;
        background:#f9fcff;
      }

      .hm-menu-link svg {
        width:18px;
        height:18px;

        fill:none;
        stroke:currentColor;
        stroke-width:1.9;
        stroke-linecap:round;
        stroke-linejoin:round;
      }


      /* 접근성 포커스 */

      .hm-menu-close:focus-visible,
      .hm-menu-search:focus-visible,
      .hm-menu-search-clear:focus-visible,
      .hm-menu-tab:focus-visible,
      .hm-menu-report-tab:focus-visible,
      .hm-menu-card:focus-visible,
      .hm-menu-link:focus-visible {
        outline:
          3px solid
          rgba(57,133,230,.28);

        outline-offset:2px;
      }


      /* 본문 스크롤 차단 */

      body.hm-game-menu-open {
        overflow:hidden !important;
      }


      /* 태블릿·PC */

      @media (min-width:720px) {
        .hm-menu-sheet {
          left:50%;
          right:auto;

          width:min(660px,100%);

          transform:
            translate(-50%,104%);
        }

        .hm-menu-sheet.is-open {
          transform:
            translate(-50%,0);
        }

        .hm-menu-grid {
          grid-template-columns:
            repeat(
              3,
              minmax(0,1fr)
            );
        }

        /*
         * PC에서도 카테고리 줄이 실제로 넘치도록
         * 버튼 폭을 확보하고 마우스 드래그를 표시합니다.
         */
        .hm-menu-tabs {
          cursor:grab;
          user-select:none;
          -webkit-user-select:none;
        }

        .hm-menu-tabs.is-dragging {
          cursor:grabbing;
        }

        .hm-menu-tab,
        .hm-menu-report-tab {
          min-width:112px;
        }
      }


      /* 작은 모바일 */

      @media (max-width:380px) {
        .hm-menu-sheet {
          padding-left:10px;
          padding-right:10px;
        }

        .hm-menu-brand h2 {
          font-size:17px;
        }

        .hm-menu-brand small {
          font-size:10px;
        }

        .hm-menu-grid {
          gap:7px;
        }

        .hm-menu-card {
          min-height:106px;
          padding:11px;
        }

        .hm-menu-copy strong {
          font-size:13px;
        }

        .hm-menu-support {
          padding:13px 12px;
        }

        .hm-menu-support-copy p {
          font-size:9.5px;
        }
      }


      /* 매우 작은 모바일 */

      @media (max-width:330px) {
        .hm-menu-grid {
          grid-template-columns:1fr;
        }

        .hm-menu-links {
          grid-template-columns:1fr;
        }
      }


      /* 모션 감소 */

      @media (
        prefers-reduced-motion:reduce
      ) {
        .hm-menu-backdrop,
        .hm-menu-sheet,
        .hm-menu-card,
        .hm-menu-report-tab {
          transition:none !important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }


  /* ==================================================
     게임 카드 생성
  ================================================== */

  function createCard(
    game,
    categoryMap
  ) {
    const isCurrent =
      game.id === state.currentGameId;

    const category =
      categoryMap.get(game.category);

    const badge = isCurrent
      ? `
        <span class="hm-menu-badge">
          현재 게임
        </span>
      `
      : game.isNew
        ? `
          <span
            class="hm-menu-badge is-new">
            NEW
          </span>
        `
        : "";

    return `
      <a
        class="hm-menu-card${
          isCurrent
            ? " is-current"
            : ""
        }"
        href="${escapeHtml(
          game.url
        )}"
        ${
          isCurrent
            ? 'aria-current="page" tabindex="-1"'
            : ""
        }>

        <span class="hm-menu-card-top">
          <span
            class="hm-menu-icon"
            aria-hidden="true">

            ${escapeHtml(
              game.icon || "🎮"
            )}
          </span>

          ${badge}
        </span>

        <span class="hm-menu-copy">
          <strong>
            ${escapeHtml(
              game.shortTitle ||
              game.title
            )}
          </strong>

          <small>
            ${escapeHtml(
              game.description || ""
            )}
          </small>
        </span>

        <span
          class="hm-menu-category-label">

          ${escapeHtml(
            category?.title ||
            "미니게임"
          )}
        </span>
      </a>
    `;
  }


  /* ==================================================
     하드코딩 이용안내·저작권
  ================================================== */

  function createSupportMarkup() {
    return `
      <section
        class="hm-menu-support"
        aria-labelledby="hmGameGuideTitle">

        <div class="hm-menu-support-head">
          <span
            class="hm-menu-support-icon"
            aria-hidden="true">
            📘
          </span>

          <div class="hm-menu-support-copy">
            <strong id="hmGameGuideTitle">
              ${escapeHtml(
                FIXED_SUPPORT.title
              )}
            </strong>

            <p>
              ${escapeHtml(
                FIXED_SUPPORT.text
              )}
            </p>
          </div>
        </div>

        <p class="hm-menu-copyright">
          ${escapeHtml(
            FIXED_SUPPORT.copyright
          )}
        </p>
      </section>
    `;
  }


  /* ==================================================
     검색·필터
  ================================================== */

  function getFilteredGames() {
    const query =
      state.query
        .trim()
        .toLocaleLowerCase(
          "ko-KR"
        );

    return getPublishedGames().filter(
      (game) => {
        if (
          state.category !== "all" &&
          game.category !==
            state.category
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
          .toLocaleLowerCase(
            "ko-KR"
          );

        return text.includes(query);
      }
    );
  }


  /* ==================================================
     상단 카테고리·오류신고
  ================================================== */

  function renderTabs() {
    const root =
      document.getElementById(
        ROOT_ID
      );

    const tabs =
      root?.querySelector(
        ".hm-menu-tabs"
      );

    if (!tabs) {
      return;
    }

    const games =
      getPublishedGames();

    const categories =
      getCategories().filter(
        (category) =>
          games.some(
            (game) =>
              game.category ===
              category.id
          )
      );

    const categoryItems =
      categories.map(
        (category) => ({
          id: category.id,
          title: category.title,
          icon: category.icon || "",

          count: games.filter(
            (game) =>
              game.category ===
              category.id
          ).length
        })
      );

    const validCategory =
      state.category === "all" ||
      categoryItems.some(
        (item) =>
          item.id === state.category
      );

    if (!validCategory) {
      state.category = "all";
    }

    const allButton = `
      <button
        class="hm-menu-tab${
          state.category === "all"
            ? " is-active"
            : ""
        }"
        type="button"
        data-hm-menu-category="all"
        aria-pressed="${
          state.category === "all"
            ? "true"
            : "false"
        }">

        <span>전체</span>

        <span class="hm-menu-tab-count">
          ${games.length}
        </span>
      </button>
    `;

    /*
     * 오류신고는 전체 바로 다음에 배치하여
     * 카테고리가 많아져도 쉽게 보이게 합니다.
     */
    const reportButton = `
      <a
        class="hm-menu-report-tab"
        href="${escapeHtml(
          getQnaUrl()
        )}"
        aria-label="현재 게임 문의 및 오류신고">

        <span
          class="hm-menu-report-tab-icon"
          aria-hidden="true">
          🛠️
        </span>

        <span>오류신고</span>
      </a>
    `;

    const categoryButtons =
      categoryItems
        .map(
          (item) => `
            <button
              class="hm-menu-tab${
                item.id ===
                state.category
                  ? " is-active"
                  : ""
              }"
              type="button"
              data-hm-menu-category="${escapeHtml(
                item.id
              )}"
              aria-pressed="${
                item.id ===
                state.category
                  ? "true"
                  : "false"
              }">

              ${
                item.icon
                  ? `
                    <span
                      aria-hidden="true">
                      ${escapeHtml(
                        item.icon
                      )}
                    </span>
                  `
                  : ""
              }

              <span>
                ${escapeHtml(
                  item.title
                )}
              </span>

              <span
                class="hm-menu-tab-count">
                ${item.count}
              </span>
            </button>
          `
        )
        .join("");

    tabs.innerHTML =
      allButton +
      reportButton +
      categoryButtons;
  }


  /* ==================================================
     게임 목록
  ================================================== */

  function renderGames() {
    const root =
      document.getElementById(
        ROOT_ID
      );

    if (!root) {
      return;
    }

    const grid =
      root.querySelector(
        ".hm-menu-grid"
      );

    const empty =
      root.querySelector(
        ".hm-menu-empty"
      );

    const summary =
      root.querySelector(
        ".hm-menu-summary"
      );

    const searchClear =
      root.querySelector(
        ".hm-menu-search-clear"
      );

    if (
      !grid ||
      !empty ||
      !summary
    ) {
      return;
    }

    const games =
      getFilteredGames();

    const categoryMap =
      getCategoryMap();

    const activeCategory =
      state.category === "all"
        ? "전체 게임"
        : categoryMap.get(
            state.category
          )?.title || "게임";

    summary.innerHTML = `
      <span>
        <strong>
          ${escapeHtml(
            activeCategory
          )}
        </strong>
      </span>

      <span>
        ${games.length}개
      </span>
    `;

    grid.innerHTML =
      games
        .map(
          (game) =>
            createCard(
              game,
              categoryMap
            )
        )
        .join("");

    grid.hidden =
      games.length === 0;

    empty.hidden =
      games.length !== 0;

    if (searchClear) {
      searchClear.hidden =
        !state.query;
    }
  }


  function renderSupport() {
    const root =
      document.getElementById(
        ROOT_ID
      );

    const holder =
      root?.querySelector(
        ".hm-menu-support-holder"
      );

    if (!holder) {
      return;
    }

    holder.innerHTML =
      createSupportMarkup();
  }


  function renderControls() {
    const root =
      document.getElementById(
        ROOT_ID
      );

    const searchWrap =
      root?.querySelector(
        ".hm-menu-search-wrap"
      );

    const search =
      root?.querySelector(
        ".hm-menu-search"
      );

    if (
      !searchWrap ||
      !search
    ) {
      return;
    }

    const showSearch =
      getPublishedGames().length >= 6;

    searchWrap.hidden =
      !showSearch;

    search.value =
      state.query;

    renderTabs();
    renderGames();
    renderSupport();

    updateExternalQnaLinks();
    updateGameTitleCaptions();
  }


  /* ==================================================
     메뉴 HTML
  ================================================== */

  function mount() {
    const root =
      document.getElementById(
        ROOT_ID
      );

    if (!root) {
      return;
    }

    root.innerHTML = `
      <div
        class="hm-menu-backdrop"
        data-hm-menu-close>
      </div>

      <section
        class="hm-menu-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hmCommonGameMenuTitle"
        aria-hidden="true">

        <div class="hm-menu-top">

          <div
            class="hm-menu-handle"
            aria-hidden="true">
          </div>

          <header class="hm-menu-head">

            <div
              class="hm-menu-title-wrap">

              <span
                class="hm-menu-title-icon"
                aria-hidden="true">

                <svg viewBox="0 0 24 24">
                  <path d="M5 21V4"></path>

                  <path
                    d="M6 5c4-3 8 3 12 0v9c-4 3-8-3-12 0">
                  </path>

                  <path
                    d="M9 4.3v9.1M13 5.3v9.2M17 5.5v8.9M6 9.5h12">
                  </path>
                </svg>
              </span>

              <div class="hm-menu-brand">
                <h2
                  id="hmCommonGameMenuTitle">
                  힐링편의점 미니게임
                </h2>

                <small>
                  게임을 선택하거나 오류를 알려주세요.
                </small>
              </div>
            </div>

            <button
              class="hm-menu-close"
              type="button"
              data-hm-menu-close
              aria-label="게임 목록 닫기">

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                  d="M6 6l12 12M18 6 6 18">
                </path>
              </svg>
            </button>
          </header>


          <div class="hm-menu-controls">

            <div
              class="hm-menu-search-wrap"
              hidden>

              <svg
                class="hm-menu-search-icon"
                viewBox="0 0 24 24"
                aria-hidden="true">

                <circle
                  cx="11"
                  cy="11"
                  r="7">
                </circle>

                <path
                  d="m16.5 16.5 4 4">
                </path>
              </svg>

              <input
                class="hm-menu-search"
                type="search"
                inputmode="search"
                placeholder="게임 이름 검색"
                aria-label="게임 이름 검색"
                autocomplete="off">

              <button
                class="hm-menu-search-clear"
                type="button"
                aria-label="검색어 지우기"
                hidden>
                ×
              </button>
            </div>

            <nav
              class="hm-menu-tabs"
              aria-label="게임 카테고리와 오류신고">
            </nav>
          </div>
        </div>


        <div class="hm-menu-scroll">

          <div
            class="hm-menu-summary"
            aria-live="polite">
          </div>

          <div class="hm-menu-grid">
          </div>

          <div
            class="hm-menu-empty"
            hidden>

            <div>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <circle
                  cx="11"
                  cy="11"
                  r="7">
                </circle>

                <path
                  d="m16.5 16.5 4 4">
                </path>
              </svg>

              <strong>
                해당하는 게임이 없습니다.
              </strong>

              <span>
                다른 카테고리나 검색어를 확인해 주세요.
              </span>
            </div>
          </div>

          <div
            class="hm-menu-support-holder">
          </div>

          <div class="hm-menu-links">

            <a
              class="hm-menu-link"
              href="${GAME_HOME_URL}">

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <rect
                  x="4"
                  y="4"
                  width="6"
                  height="6"
                  rx="1">
                </rect>

                <rect
                  x="14"
                  y="4"
                  width="6"
                  height="6"
                  rx="1">
                </rect>

                <rect
                  x="4"
                  y="14"
                  width="6"
                  height="6"
                  rx="1">
                </rect>

                <rect
                  x="14"
                  y="14"
                  width="6"
                  height="6"
                  rx="1">
                </rect>
              </svg>

              <span>
                게임 모음
              </span>
            </a>

            <a
              class="hm-menu-link"
              href="${escapeHtml(
                FIXED_SUPPORT.homeUrl
              )}">

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                  d="M3 11.5 12 4l9 7.5">
                </path>

                <path
                  d="M5.5 10.5V20h13v-9.5">
                </path>

                <path
                  d="M9.5 20v-6h5v6">
                </path>
              </svg>

              <span>
                ${escapeHtml(
                  FIXED_SUPPORT.homeLabel
                )}
              </span>
            </a>
          </div>
        </div>
      </section>
    `;

    renderControls();
  }


  /* ==================================================
     요소
  ================================================== */

  function getParts() {
    const root =
      document.getElementById(
        ROOT_ID
      );

    return {
      root,

      backdrop:
        root?.querySelector(
          ".hm-menu-backdrop"
        ),

      sheet:
        root?.querySelector(
          ".hm-menu-sheet"
        ),

      closeButton:
        root?.querySelector(
          ".hm-menu-close"
        ),

      search:
        root?.querySelector(
          ".hm-menu-search"
        )
    };
  }


  /* ==================================================
     열기·닫기
  ================================================== */

  function openMenu(trigger) {
    const {
      backdrop,
      sheet,
      closeButton
    } = getParts();

    if (
      !backdrop ||
      !sheet ||
      state.open
    ) {
      return;
    }

    state.currentGameId =
      getCurrentGameId();

    renderControls();

    state.returnFocus =
      trigger instanceof HTMLElement
        ? trigger
        : document.activeElement;

    state.open = true;

    backdrop.classList.add(
      "is-open"
    );

    sheet.classList.add(
      "is-open"
    );

    sheet.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "hm-game-menu-open"
    );

    window.dispatchEvent(
      new CustomEvent(
        "hm-game-menu-opened"
      )
    );

    window.setTimeout(
      () => {
        closeButton?.focus();
      },
      60
    );
  }


  function closeMenu(
    options = {}
  ) {
    const {
      backdrop,
      sheet
    } = getParts();

    if (
      !backdrop ||
      !sheet ||
      !state.open
    ) {
      return;
    }

    state.open = false;

    backdrop.classList.remove(
      "is-open"
    );

    sheet.classList.remove(
      "is-open"
    );

    sheet.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "hm-game-menu-open"
    );

    window.dispatchEvent(
      new CustomEvent(
        "hm-game-menu-closed"
      )
    );

    if (
      options.restoreFocus !== false &&
      state.returnFocus instanceof
        HTMLElement
    ) {
      window.setTimeout(
        () => {
          state.returnFocus
            ?.focus?.();
        },
        80
      );
    }
  }


  /* ==================================================
     카테고리
  ================================================== */

  function setCategory(category) {
    state.category =
      category || "all";

    renderTabs();
    renderGames();
  }


  /* ==================================================
     PC 카테고리 좌우 이동
  ================================================== */

  function bindPcTabScroll() {
    const tabs =
      document.querySelector(
        `#${ROOT_ID} .hm-menu-tabs`
      );

    if (!tabs) {
      return;
    }

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    tabs.addEventListener(
      "pointerdown",
      (event) => {
        if (
          event.pointerType !== "mouse" ||
          event.button !== 0
        ) {
          return;
        }

        dragging = true;
        moved = false;
        startX = event.clientX;
        startLeft = tabs.scrollLeft;

        tabs.classList.add(
          "is-dragging"
        );

        tabs.setPointerCapture?.(
          event.pointerId
        );
      }
    );

    tabs.addEventListener(
      "pointermove",
      (event) => {
        if (!dragging) {
          return;
        }

        const distance =
          event.clientX - startX;

        moved =
          moved ||
          Math.abs(distance) > 4;

        tabs.scrollLeft =
          startLeft - distance;
      }
    );

    const stopDrag = () => {
      dragging = false;
      tabs.classList.remove(
        "is-dragging"
      );
    };

    tabs.addEventListener(
      "pointerup",
      stopDrag
    );

    tabs.addEventListener(
      "pointercancel",
      stopDrag
    );

    tabs.addEventListener(
      "wheel",
      (event) => {
        if (
          tabs.scrollWidth <=
          tabs.clientWidth
        ) {
          return;
        }

        tabs.scrollLeft +=
          event.deltaX ||
          event.deltaY;

        event.preventDefault();
      },
      {
        passive:false
      }
    );

    tabs.addEventListener(
      "click",
      (event) => {
        if (!moved) {
          return;
        }

        moved = false;
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
  }


  /* ==================================================
     이벤트
  ================================================== */

  function bind() {
    bindPcTabScroll();
    document.addEventListener(
      "click",
      (event) => {
        const openButton =
          event.target.closest(
            "[data-hm-game-menu-open]"
          );

        if (openButton) {
          event.preventDefault();

          openMenu(openButton);
          return;
        }


        const categoryButton =
          event.target.closest(
            "[data-hm-menu-category]"
          );

        if (categoryButton) {
          event.preventDefault();

          setCategory(
            categoryButton.dataset
              .hmMenuCategory
          );

          return;
        }


        const clearButton =
          event.target.closest(
            ".hm-menu-search-clear"
          );

        if (clearButton) {
          event.preventDefault();

          state.query = "";

          const { search } =
            getParts();

          if (search) {
            search.value = "";
          }

          renderGames();

          search?.focus();
          return;
        }


        const closeButton =
          event.target.closest(
            "[data-hm-menu-close]"
          );

        if (closeButton) {
          event.preventDefault();
          closeMenu();
        }
      }
    );


    document.addEventListener(
      "input",
      (event) => {
        if (
          !event.target.matches(
            ".hm-menu-search"
          )
        ) {
          return;
        }

        state.query =
          event.target.value || "";

        renderGames();
      }
    );


    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          state.open
        ) {
          event.preventDefault();
          closeMenu();
        }
      }
    );
  }


  /* ==================================================
     초기화
  ================================================== */

  function init() {
    if (
      document.getElementById(
        ROOT_ID
      )
    ) {
      return;
    }

    state.currentGameId =
      getCurrentGameId();

    injectStyle();

    updateGameTitleCaptions();
    updateExternalQnaLinks();

    const root =
      document.createElement("div");

    root.id = ROOT_ID;

    root.setAttribute(
      "data-hm-common-menu",
      "v1.4.3"
    );

    document.body.appendChild(
      root
    );

    mount();
    bind();
  }


  /* ==================================================
     공개 제어 함수
     외부 서버 통신 없음
  ================================================== */

  window.HMGameMenu =
    Object.freeze({
      open:
        openMenu,

      close:
        closeMenu,

      isOpen:
        () => state.open,

      setCategory,

      getQnaUrl,

      refresh() {
        state.currentGameId =
          getCurrentGameId();

        updateGameTitleCaptions();
        updateExternalQnaLinks();
        renderControls();
      }
    });


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );
  } else {
    init();
  }
})();
