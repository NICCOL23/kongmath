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
- The shared header CSS must apply the same wordmark size rule to every page so dedicated pages do not fall back to the smaller legacy header image size.

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

## Site-wide logo color rule

- All pages must use the shared `imges/common/kong-math-navy-gold-wordmark.png` asset for the header and footer wordmark.
- The attached logo reference colors are: blue `#023D89`, orange `#E28E02`, and navy `#091840`.
- Keep the header and footer logo free of filters, opacity changes, or blend modes so the same source image keeps the same colors on every page.

- The `studyroom.html` page must not contain a `네이버 블로그에서 자습실 공지 보기` button or the specific Naver post URL; keep the reconstructed study-room notice content on the site instead.

## Header submenu scroll behavior

- Header submenus must close automatically when page scrolling starts, whether the viewport is desktop or mobile.
- Reuse `closeMenus()` so `aria-expanded`, panel `hidden`, and active menu state stay synchronized.

- Preserve the original submenu hierarchy, markup, item order, and per-menu positioning at all times. Do not flatten, reparent, or globally reposition a submenu while fixing a page-specific navigation issue; apply only the smallest scoped change required.

## Shared footer logo sizing

- Every page uses the shared `js/footer-component.js` footer.
- The footer wordmark must preserve the source image aspect ratio with `height: auto`, `max-width: 100%`, and `object-fit: contain`; never stretch it vertically or horizontally on page-specific layouts.


## Student and parent reviews

- The student/parent review board is maintained at `reviews.html`.
- The home page may show only a small preview; the full review page must link to the official Naver Place review page.
- Do not scrape, iframe, copy, or bulk-republish Naver Place review text, nicknames, profile images, photos, or videos.
- Publish student or parent reviews only after public-display consent; anonymize author labels and omit personal information.
- Content from the Kong Math blog student category is labeled as `학생 성과 사례`, not as a student or parent testimonial.
- Review display data currently comes from `data/reviews.json`; keep the fields compatible with a future Supabase table/API.
- Future Supabase integration should replace the data-loading layer without changing the review card markup or consent rules.

- The main page places the `학생 성과 사례` section immediately after `#clinic-intro` and before `#academy-about`; each card keeps the original blog link at the top right beside `학생 성과 사례`, and the section ends with a direct `students.html` link.

## Student achievement archive

- `students.html` is the dedicated `학생 성과 사례` archive and must reflect all 9 verified posts from the blog category `공쌤수학원생 코너`.
- Use the existing local assets in `imges/students/` for every verified post; do not invent performance data or download unrelated images.
- Keep the 7 exam/scholarship records classified as `학생 성과 사례`, and classify the 2 non-performance posts as `학원 일상` or `학생 관심사` so the archive remains factually accurate.
- Each archive card must provide the verified summary, original blog link, and all images belonging to that post. Keep student and school identifiers anonymized in the site copy.
- The archive data is maintained in `data/student-cases.json`, rendered by `js/student-cases.js`, and styled by `css/student-cases.css`.
