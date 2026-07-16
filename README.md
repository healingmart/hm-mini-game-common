# Healing Mart Mini Game Common

Healing Mart 미니게임에서 공통으로 사용하는 **카테고리형 게임 목록 바텀시트**입니다.

새 게임을 발행할 때 `docs/js/hm-games-data.v1.js`에 항목 하나만 추가하면,
이 메뉴를 사용하는 모든 게임에 새 게임 링크가 자동으로 표시됩니다.

## 현재 메뉴 기능

- 현재 게임 제목을 눌러 바텀시트 열기
- 전체 및 카테고리별 필터
- 게임 6개 이상일 때 검색창 자동 표시
- 현재 실행 중인 게임 표시
- 새 게임 `NEW` 표시
- 게임 모음 및 Healing Mart 블로그 홈 연결
- 모바일 2열, 넓은 화면 3열 카드

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

압축을 푼 뒤 저장소 첫 화면에 다음 항목을 덮어씁니다.

```text
docs/
README.md
```

GitHub Pages 설정:

```text
Settings
→ Pages
→ Source: Deploy from a branch
→ Branch: main
→ Folder: /docs
→ Save
```

## 각 게임에 적용

게임 루트에 현재 게임 ID를 넣습니다.

```html
<div id="hmRaceApp"
     data-game-id="ladder-race"
     data-current-game="ladder-race">
```

상단 현재 게임 제목 버튼에 다음 속성을 넣습니다.

```html
<button type="button" data-hm-game-menu-open>
  <strong>사다리 레이스</strong>
  <small>다른 게임 보기</small>
</button>
```

HTML 아래에서 두 파일을 순서대로 불러옵니다.

```html
<script
  src="https://healingmart.github.io/hm-mini-game-common/js/hm-games-data.v1.js?v=20260716-2"
  defer>
</script>

<script
  src="https://healingmart.github.io/hm-mini-game-common/js/hm-game-menu.v1.js?v=20260716-2"
  defer>
</script>
```

## 새 게임 추가 방법

`window.HM_GAMES` 안에 게임 한 항목을 추가합니다.

```javascript
{
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
```

현재 카테고리:

```text
party-random       복불복·파티
word-quiz          퀴즈·단어
puzzle-strategy    퍼즐·전략
reaction-timing    반응·액션
```

카테고리에 등록된 게임이 생기면 해당 카테고리 탭이 자동으로 나타납니다.
게임이 없는 카테고리 탭은 표시하지 않습니다.

## 사운드와의 관계

```text
hm-mini-game-sound-pack
→ 사운드 전용

hm-mini-game-common
→ 게임 데이터와 카테고리 바텀시트 전용
```
