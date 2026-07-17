/*
 * Healing Mart Mini Game Registry v1.1.1
 * 새 게임 발행 후 window.HM_GAMES에 항목 하나만 추가하세요.
 */
(() => {
  "use strict";

  window.HM_GAME_CATEGORIES = Object.freeze([
    {
      id: "party-random",
      title: "랜덤·파티",
      shortTitle: "랜덤",
      icon: "🎲",
      description: "함께 즐기는 랜덤 선택 게임"
    },
    {
      id: "word-quiz",
      title: "단어·퀴즈",
      shortTitle: "퀴즈",
      icon: "🔤",
      description: "상식과 단어를 맞히는 게임"
    },
    {
      id: "puzzle-strategy",
      title: "퍼즐·전략",
      shortTitle: "퍼즐",
      icon: "🧩",
      description: "생각하며 해결하는 게임"
    },
    {
      id: "reaction-timing",
      title: "반응·타이밍",
      shortTitle: "타이밍",
      icon: "⚡",
      description: "빠르게 반응하며 즐기는 게임"
    }
  ]);

  window.HM_GAMES = Object.freeze([
    {
      id: "ladder-race",
      title: "복불복 사다리 레이스",
      shortTitle: "사다리 레이스",
      icon: "🏁",
      category: "party-random",
      url: "https://www.healing-mart.com/2026/07/Hit%20or%20miss.html",
      description: "캐릭터가 사다리를 따라 달리고 부담 금액과 면제 결과를 공개하는 복불복 게임",
      status: "published",
      featured: true,
      isNew: false,
      order: 10
    },
    {
      id: "choseong-toktok",
      title: "초성톡톡",
      shortTitle: "초성톡톡",
      icon: "🔤",
      category: "word-quiz",
      url: "https://www.healing-mart.com/2026/07/Initial-Consonant-Quiz.html",
      description: "초성·속담·사자성어·글자 섞기를 제한시간 안에 맞히는 한국어 단어 게임",
      status: "published",
      featured: true,
      isNew: true,
      order: 20
    },
    {
      id: "healing-sudoku",
      title: "힐링 스도쿠",
      shortTitle: "스도쿠",
      icon: "🔢",
      category: "puzzle-strategy",
      url: "https://www.healing-mart.com/2026/07/sudoku.html",
      description: "4 x 4, 6 x 6, 9 x 9 퍼즐을 단계별로 풀어 보는 숫자 퍼즐 게임",
      status: "published",
      featured: true,
      isNew: true,
      order: 30
    },
    {
      id: "omok",
      title: "한판 오목",
      shortTitle: "오목",
      icon: "⚫",
      category: "puzzle-strategy",
      url: "https://www.healing-mart.com/2026/07/Gomoku.html",
      description: "컴퓨터 AI 또는 친구와 대결하며 다섯 개의 돌을 먼저 연결하는 오목 게임",
      status: "published",
      featured: true,
      isNew: true,
      order: 40
    }
  ]);
})();
