/*
 * Healing Mart Mini Game Registry v1.1.0
 * 새 게임 발행 후 window.HM_GAMES에 항목 하나만 추가하세요.
 */
(() => {
  "use strict";

  window.HM_GAME_CATEGORIES = Object.freeze([
    {
      id: "party-random",
      title: "복불복·파티",
      shortTitle: "복불복",
      icon: "🎲",
      description: "함께 즐기는 랜덤 선택 게임"
    },
    {
      id: "word-quiz",
      title: "퀴즈·단어",
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
      title: "반응·액션",
      shortTitle: "액션",
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
      url: "https://www.healing-mart.com/REPLACE-WITH-LADDER-GAME-URL.html",
      description: "캐릭터가 사다리를 달리고 마지막에 결과를 공개하는 복불복 게임",
      status: "published",
      featured: true,
      isNew: true,
      order: 10
    }

    /*
    새 게임 추가 예시

    ,{
      id: "choseong-game",
      title: "초성톡톡",
      shortTitle: "초성톡톡",
      icon: "🔤",
      category: "word-quiz",
      url: "https://www.healing-mart.com/초성게임주소.html",
      description: "초성을 보고 한국어 단어를 맞히는 게임",
      status: "published",
      featured: false,
      isNew: true,
      order: 20
    }
    */
  ]);
})();
