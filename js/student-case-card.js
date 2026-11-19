(() => {
  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const renderPreviewCard = (item, index) => {
    const previewNumber = Number(item.previewNumber) || (item.id === "224369881711" ? 5 : index + 1);
    return `<article class="student-preview-card">
    <a class="student-preview-card__visual" href="${escapeHtml(item.images[0] || "")}" aria-label="${escapeHtml(item.title)} 사진 확대" title="사진 확대">
      <img src="${escapeHtml(item.images[0] || "")}" alt="${escapeHtml(item.title)} 대표 이미지" loading="lazy" decoding="async">
      <span class="student-preview-card__number">${String(previewNumber).padStart(2, "0")} / 09</span>
    </a>
    <div class="student-preview-card__body">
      <div class="student-preview-card__head"><p class="student-preview-card__meta">${escapeHtml(item.typeLabel)}</p></div>
      <p class="student-preview-card__eyebrow">${escapeHtml(item.eyebrow)} · ${escapeHtml(item.date)}</p>
      <h3><a class="km-card-title-link" href="${escapeHtml(item.href || 'students.html#student-'+item.id)}">${escapeHtml(item.title)}</a></h3>
      <p class="student-preview-card__description"><a class="km-card-description-link" href="${escapeHtml(item.href || 'students.html#student-'+item.id)}">${escapeHtml(item.summary)}</a></p>
    </div>
  </article>`;

  };

  const renderArchiveCard = (item, index) => {
    const images = item.images.map((src, imageIndex) => `<a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} 이미지 ${imageIndex + 1}" loading="lazy" decoding="async"></a>`).join("");
    return `<details id="student-${escapeHtml(item.id)}" class="student-case-card" data-case-type="${escapeHtml(item.type)}"><summary class="student-case-card__summary-wrap"><span class="student-case-card__visual" role="button" tabindex="0" aria-haspopup="dialog" aria-label="${escapeHtml(item.title)} 사진 확대" data-km-image="${escapeHtml(item.images[0])}"><img src="${escapeHtml(item.images[0])}" alt="${escapeHtml(item.title)} 대표 이미지" loading="lazy" decoding="async"><span class="student-case-card__number">${String(index + 1).padStart(2, "0")} / 09</span></span><span class="student-case-card__body"><span class="student-case-card__meta"><span>${escapeHtml(item.typeLabel)}</span><time datetime="${escapeHtml(item.datetime)}">${escapeHtml(item.date)}</time></span><span class="student-case-card__eyebrow">${escapeHtml(item.eyebrow)}</span><span class="student-case-card__title">${escapeHtml(item.title)}</span><span class="student-case-card__summary">${escapeHtml(item.summary)}</span><span class="student-case-card__actions"><span class="student-case-card__detail">상세 기록 보기</span></span></span></summary><span class="student-case-card__expanded"><p>${escapeHtml(item.detail)}</p><span class="student-case-card__gallery">${images}</span></span></details>`;
  };

  window.StudentCaseCard = Object.freeze({ escapeHtml, renderPreviewCard, renderArchiveCard });
})();

