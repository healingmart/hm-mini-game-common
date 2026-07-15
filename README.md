# Healing Mart Mini Game Common

Healing Mart 미니게임에서 공통으로 사용하는 **게임 목록 바텀시트**입니다.

새 게임을 발행할 때 `hm-games-data.v1.js`에 항목 하나만 추가하면,
이 메뉴를 사용하는 모든 게임에 새 게임 링크가 자동으로 표시됩니다.

## 폴더 구성

```text
hm-mini-game-common/
├── README.md
└── docs/
    ├── .nojekyll
    ├── index.html
    └── js/
        ├── hm-games-data.v1.js
        └── hm-game-menu.v1.js
```

## 가장 먼저 수정할 곳

`docs/js/hm-games-data.v1.js`에서 아래 주소를 찾습니다.

```javascript
url: "https://www.healing-mart.com/REPLACE-WITH-LADDER-GAME-URL.html"
```

사다리 게임의 실제 Blogger 주소로 바꿉니다.

## GitHub 업로드

1. GitHub에서 공개 저장소 `hm-mini-game-common`을 만듭니다.
2. 이 압축파일을 풉니다.
3. 폴더 안의 `docs`와 `README.md`를 저장소 첫 화면에 올립니다.
4. `Commit changes`를 누릅니다.

저장소 첫 화면:

```text
docs/
README.md
```

## GitHub Pages 켜기

```text
Settings
→ Pages
→ Source: Deploy from a branch
→ Branch: main
→ Folder: /docs
→ Save
```

배포 주소:

```text
https://GITHUB_ID.github.io/hm-mini-game-common/
```

## Blogger 게임에 적용

게임 루트에 현재 게임 ID를 넣습니다.

```html
<div id="hmRaceApp" data-current-game="ladder-race">
```

게임목록 버튼에 아래 속성을 넣습니다.

```html
<button type="button" data-hm-game-menu-open>
  ▦ 게임목록
</button>
```

게임 HTML 아래에서 두 파일을 순서대로 불러옵니다.

```html
<script
  src="https://GITHUB_ID.github.io/hm-mini-game-common/js/hm-games-data.v1.js"
  defer>
</script>

<script
  src="https://GITHUB_ID.github.io/hm-mini-game-common/js/hm-game-menu.v1.js"
  defer>
</script>
```

## 새 게임 추가 방법

`docs/js/hm-games-data.v1.js`의 `window.HM_GAMES` 안에 게임 한 항목을 추가합니다.

카테고리는 아래 네 개 중 하나만 사용합니다.

```text
party-random       랜덤·파티
word-quiz          단어·퀴즈
puzzle-strategy    퍼즐·전략
reaction-timing    반응·타이밍
```

## 사운드와의 관계

```text
hm-mini-game-sound-pack
→ 사운드 전용

hm-mini-game-common
→ 게임 목록과 바텀시트 전용
```
