# Healing Mart Mini Game Common

Healing Mart 미니게임에서 공통으로 사용하는 카테고리형 게임 목록 바텀시트입니다.

## 저장소 구조

```text
hm-mini-game-common/
├─ README.md
└─ docs/
   ├─ .nojekyll
   ├─ index.html
   └─ js/
      ├─ hm-games-data.v1.js
      └─ hm-game-menu.v1.js
```

## GitHub Pages 설정

```text
Settings
→ Pages
→ Source: Deploy from a branch
→ Branch: main
→ Folder: /docs
→ Save
```

배포가 완료되면 아래 두 주소가 브라우저에서 JavaScript 코드로 열려야 합니다.

```text
https://healingmart.github.io/hm-mini-game-common/js/hm-games-data.v1.js
https://healingmart.github.io/hm-mini-game-common/js/hm-game-menu.v1.js
```

## Blogger 호출 코드

```html
<script src="https://healingmart.github.io/hm-mini-game-common/js/hm-games-data.v1.js?v=20260716-3" defer></script>
<script src="https://healingmart.github.io/hm-mini-game-common/js/hm-game-menu.v1.js?v=20260716-3" defer></script>
```

새 게임을 발행할 때는 `docs/js/hm-games-data.v1.js`의 `window.HM_GAMES` 배열에 객체 하나만 추가합니다.
