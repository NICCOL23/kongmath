# Agent Instructions

## Academy introduction card task

- The only target area is the first four cards in `#academy-about` on `kongmath.com`.
- Preserve the existing academy card images, Korean copy, links, and details content.
- Use the Armi source at `D:\영희 핸드 폰 사진\04_팀프로젝트\armi_main_이혜연` as a visual and sizing reference only.
- Do not modify the Armi source files.
- Use the Armi `#treatment` card proportions as the reference:
  - card radius: `20px`
  - image: `width: 100%; height: 290px; object-fit: cover; display: block`
  - card body: `min-height: 145px; padding: 20px`
  - matching shadow, typography scale, spacing, and link alignment
- Keep the academy cards componentized with these BEM-style classes:
  - `.academy-card`
  - `.academy-card__image`
  - `.academy-card__body`
  - `.academy-card__category`
  - `.academy-card__title`
  - `.academy-card__description`
  - `.academy-card__link`
- Use four columns on desktop, two on tablet, and one on mobile.
- Keep `#treatment` (the exam-report section), the Armi files, and unrelated page sections unchanged.
- After changes, verify the GitHub Pages deployment and check the live academy introduction card dimensions.
