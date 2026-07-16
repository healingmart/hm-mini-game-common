/*
 * Healing Mart Mini Game Registry v1.1.1
 */
(() => {
  "use strict";

  window.HM_GAME_CATEGORIES = Object.freeze([
    {
      id: "party-random",
      title: "랜덤·파티",
      icon: "🎲"
    },
    {
      id: "word-quiz",
      title: "단어·퀴즈",
      icon: "🔤"
    },
    {
      id: "puzzle-strategy",
      title: "퍼즐·전략",
      icon: "🧩"
    },
    {
      id: "reaction-timing",
      title: "반응·타이밍",
      icon: "⚡"
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
    }
  ]);
})();
