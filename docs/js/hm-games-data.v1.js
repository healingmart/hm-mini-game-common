/*
 * Healing Mart Mini Game Registry v1.2.0
 *
 * 새 게임을 발행하면 window.HM_GAMES에
 * 게임 객체 하나만 추가하세요.
 */
(() => {
  "use strict";

  window.HM_GAME_CATEGORIES = Object.freeze([
    Object.freeze({
      id: "party-random",
      title: "랜덤·파티",
      shortTitle: "랜덤",
      icon: "🎲",
      description: "함께 즐기는 랜덤 선택 게임"
    }),

    Object.freeze({
      id: "word-quiz",
      title: "단어·퀴즈",
      shortTitle: "퀴즈",
      icon: "🔤",
      description: "상식과 단어를 맞히는 게임"
    }),

    Object.freeze({
      id: "puzzle-strategy",
      title: "퍼즐·전략",
      shortTitle: "퍼즐",
      icon: "🧩",
      description: "생각하며 해결하는 게임"
    }),

    Object.freeze({
      id: "reaction-timing",
      title: "반응·타이밍",
      shortTitle: "타이밍",
      icon: "⚡",
      description: "빠르게 반응하며 즐기는 게임"
    })
  ]);

  window.HM_GAME_SUPPORT = Object.freeze({
    title: "이용안내 및 고객지원",

    description:
      "게임 이용 방법과 저작권을 확인하거나 오류 및 불편 사항을 알려주세요.",

    guideLabel: "이용안내·저작권",
    guideUrl:
      "https://www.healing-mart.com/p/service-guide.html",

    reportLabel: "오류신고",
    reportUrl:
      "https://www.healing-mart.com/p/report.html",

    contactLabel: "문의하기",
    contactUrl:
      "https://www.healing-mart.com/p/contact.html",

    homeLabel: "힐링편의점 홈",
    homeUrl:
      "https://www.healing-mart.com/",

    copyright:
      "© 2026 Healing Mart · 힐링편의점"
  });

  window.HM_GAMES = Object.freeze([
    Object.freeze({
      id: "ladder-race",
      title: "복불복 사다리 레이스",
      shortTitle: "사다리 레이스",
      icon: "🏁",
      category: "party-random",

      url:
        "https://www.healing-mart.com/2026/07/Hit%20or%20miss.html",

      description:
        "캐릭터가 사다리를 따라 달리고 부담 금액과 면제 결과를 공개하는 복불복 게임",

      status: "published",
      featured: true,
      isNew: false,
      order: 10
    }),

    Object.freeze({
      id: "choseong-toktok",
      title: "초성톡톡",
      shortTitle: "초성톡톡",
      icon: "🔤",
      category: "word-quiz",

      url:
        "https://www.healing-mart.com/2026/07/Initial-Consonant-Quiz.html",

      description:
        "초성·속담·사자성어·글자 섞기를 제한시간 안에 맞히는 한국어 단어 게임",

      status: "published",
      featured: true,
      isNew: true,
      order: 20
    }),

    Object.freeze({
      id: "healing-sudoku",
      title: "힐링 스도쿠",
      shortTitle: "스도쿠",
      icon: "🔢",
      category: "puzzle-strategy",

      url:
        "https://www.healing-mart.com/2026/07/sudoku.html",

      description:
        "4 x 4, 6 x 6, 9 x 9 퍼즐을 단계별로 풀어 보는 숫자 퍼즐 게임",

      status: "published",
      featured: true,
      isNew: true,
      order: 30
    }),

    Object.freeze({
      id: "omok",
      title: "한판 오목",
      shortTitle: "오목",
      icon: "⚫",
      category: "puzzle-strategy",

      url:
        "https://www.healing-mart.com/2026/07/Gomoku.html",

      description:
        "컴퓨터 AI 또는 친구와 대결하며 다섯 개의 돌을 먼저 연결하는 오목 게임",

      status: "published",
      featured: true,
      isNew: true,
      order: 40
    }),

    Object.freeze({
      id: "reversi",
      title: "한판 리버시",
      shortTitle: "리버시",
      icon: "◐",
      category: "puzzle-strategy",

      url:
        "https://www.healing-mart.com/2026/07/Reversi.html",

      description:
        "4 x 4, 6 x 6, 8 x 8, 10 x 10 코스와 네 단계 AI를 지원하는 돌 뒤집기 전략 보드게임",

      status: "published",
      featured: true,
      isNew: true,
      order: 50
    }),

    Object.freeze({
      id: "reaction-test",
      title: "반응속도 테스트",
      shortTitle: "반응속도",
      icon: "⚡",
      category: "reaction-timing",

      url:
        "https://www.healing-mart.com/2026/07/Reaction-Time-Test.html",

      description:
        "초록불 반응, 방향 선택, 타깃 터치, 막대 정지, 회전 정지 등 다양한 미션과 100단계 챌린지를 즐기는 종합 반응속도 게임",

      status: "published",
      featured: true,
      isNew: true,
      order: 60
    })
  ]);
})();
