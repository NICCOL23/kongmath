# Agent Instructions

## Academy introduction card task

- The target area is all 10 academy introduction cards in `#academy-about` on `kongmath.com`: the first four featured cards and the six cards in the section below.
- Preserve the existing academy card images, Korean copy, links, and details content.
- Use the Armi source at `D:\영희 핸드 폰 사진\04_팀프로젝트\armi_main_이혜연` as a visual and sizing reference only.
- Do not modify the Armi source files.
- Use the Armi `#treatment` card proportions as the reference:
  - card radius: `20px`
  - image: `width: 100%; height: 290px; object-fit: cover; display: block`
  - desktop card: `340px × 435px`
  - desktop image: `340px × 290px`
  - closed desktop card body: exactly `145px` with `padding: 20px`
  - tablet: image `300px`, body `150px`, total card `450px`
  - mobile: image `220px`, body `140px`, total card `360px`
  - matching shadow, typography scale, spacing, and link alignment
  - card dimensions must not grow because of text; details may expand only after the user opens the card
  - closed-card typography: category `12px/18px`, title `20px/1.35`, description `15px/1.6`, link `15px/20px`, with Korean-friendly letter spacing around `-0.02em` to `-0.03em`
- Keep the academy cards componentized with these BEM-style classes:
  - `.academy-card`
  - `.academy-card__image`
  - `.academy-card__body`
  - `.academy-card__category`
  - `.academy-card__title`
  - `.academy-card__description`
  - `.academy-card__link`
- Use four columns on desktop for the featured cards and the same card sizing for the six lower cards; use two columns on tablet and one on mobile.
- Keep `#treatment` (the exam-report section), the Armi files, and unrelated page sections unchanged.
- After changes, verify the GitHub Pages deployment and check the live academy introduction card dimensions.

## Header/footer logo color

- The footer logo must use the exact same source asset and visual color treatment as the header logo.
- Do not apply an independent color-changing filter to the footer logo; keep `filter: none`, full opacity, and normal blend mode.

## Shared footer component

- The footer is maintained in one reusable component at `js/footer-component.js`.
- Every root HTML page must contain only `<div data-site-footer></div>` and load the shared component script.
- The shared component must keep the main-page footer markup, logo, 상담 링크, 네이버 블로그 링크, 연락처, and copyright identical across all pages.

## Header subnavigation links

- Header subnavigation items must use direct page URLs instead of same-page hash anchors.
- Use `index.html` for the academy introduction and study-room destinations, `consultation.html` for 1:1 class and consultation, `tuition.html` for tuition, `reports.html` for reports, `notices.html` for notices/news, `daily.html` for academy daily posts, and `students.html` for the student corner.
- The location menu opens the Naver Map place page directly.
- Do not intercept header menu clicks with same-page `scrollIntoView()` behavior.

## Subnavigation maintenance rule

- If header subnavigation items are added, deleted, renamed, or their destinations are changed, every resulting submenu item must still navigate directly to its corresponding page when clicked.
- Never introduce same-page hash anchors such as `#section` or `./#section` for header subnavigation; do not use scroll-only navigation for these menu items.
- After any submenu change, verify every header submenu link across all root HTML pages and confirm that each click resolves to a direct page URL or an explicitly intended external page.

## Floating consultation button

- The floating consultation button uses `index.html` on desktop so it returns to the main first page.
- On mobile widths up to 768px, the same button must use `tel:0519137159` for immediate calling.
- Preserve the responsive href switching when the viewport changes.

- The floating button uses the chat-bubble icon on desktop and the phone icon on mobile; keep the icon and destination behavior synchronized.

## Academy card navigation

- Academy introduction card image and body links must navigate directly to their target page or an explicitly intended external page.
- Do not use hash-only or page-fragment URLs such as `#save-teeth`, `#location`, or `reports.html#report-...` for card navigation; card clicks must not trigger in-page scrolling.

- The management study-room card and all related header/shortcut links must point directly to `studyroom.html`; never send users to the homepage hero or a hash-scroll section for this destination.

- The `studyroom.html` page is the dedicated management study-room destination. Keep the reconstructed notice content, photos, and rules together on this page; the menu must not redirect users to the Naver Blog.

- The `studyroom.html` dedicated page must reuse the main page `#save-teeth` image structure and `css/main.css` sizing; do not add an oversized independent gallery layout.

- Do not display the removed source-notice sentence on `studyroom.html`; the dedicated page should show only the study-room content and rules.
