(() => {
  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const renderPreviewCard = (item, index) => {
    const previewNumber = item.previewNumber ?? (item.id === "224369881711" ? 5 : index + 1);
    return `<article class="student-preview-card">
    <a class="student-preview-card__visual" href="students.html#student-${escapeHtml(item.id)}">
      <img src="${escapeHtml(item.images[0])}" alt="${escapeHtml(item.title)} 대표 이미지" loading="lazy" decoding="async">
      <span class="student-preview-card__number">${String(previewNumber).padStart(2, "0")} / 09</span>
    </a>
    <div class="student-preview-card__body">
      <div class="student-preview-card__head">
        <p class="student-preview-card__meta">${escapeHtml(item.typeLabel)}</p>
        <a class="student-preview-card__source" href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">블로그 원문 확인 ↗</a>
      </div>
      <p class="student-preview-card__eyebrow">${escapeHtml(item.eyebrow)} · ${escapeHtml(item.date)}</p>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="student-preview-card__description">${escapeHtml(item.summary)}</p>
      <div class="student-preview-card__actions">
        <a href="students.html#student-${escapeHtml(item.id)}">상세 기록 보기 <span aria-hidden="true">↗</span></a>
        <a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </div>
    </div>
  </article>`;
  };

  const renderArchiveCard = (item, index) => {
    const images = item.images.map((src, imageIndex) => `<a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} 이미지 ${imageIndex + 1}" loading="lazy" decoding="async"></a>`).join("");
    return `<details id="student-${escapeHtml(item.id)}" class="student-case-card" data-case-type="${escapeHtml(item.type)}"><summary class="student-case-card__summary-wrap"><span class="student-case-card__visual"><img src="${escapeHtml(item.images[0])}" alt="${escapeHtml(item.title)} 대표 이미지" loading="lazy" decoding="async"><span class="student-case-card__number">${String(index + 1).padStart(2, "0")} / 09</span></span><span class="student-case-card__body"><span class="student-case-card__meta"><span>${escapeHtml(item.typeLabel)}</span><time datetime="${escapeHtml(item.datetime)}">${escapeHtml(item.date)}</time></span><span class="student-case-card__eyebrow">${escapeHtml(item.eyebrow)}</span><span class="student-case-card__title">${escapeHtml(item.title)}</span><span class="student-case-card__summary">${escapeHtml(item.summary)}</span><span class="student-case-card__actions"><span class="student-case-card__detail">상세 기록 보기</span><span class="student-case-card__source-label">원문 ↗</span></span></span></summary><span class="student-case-card__expanded"><p>${escapeHtml(item.detail)}</p><span class="student-case-card__gallery">${images}</span><a class="student-case-card__source" href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.sourceTitle)} 원문 확인 ↗</a></span></details>`;
  };

  window.StudentCaseCard = Object.freeze({ escapeHtml, renderPreviewCard, renderArchiveCard });
})();
