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
