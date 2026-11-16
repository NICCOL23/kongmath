(() => {
  const grid = document.querySelector("[data-student-case-grid]");
  const filters = [...document.querySelectorAll("[data-case-filter]")];
  const count = document.querySelector("[data-case-count]");
  if (!grid) return;
  const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const renderCard = (item, index) => {
    const images = item.images.map((src, imageIndex) => `<a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} 이미지 ${imageIndex + 1}" loading="lazy" decoding="async"></a>`).join("");
    return `<details class="student-case-card" data-case-type="${escapeHtml(item.type)}"><summary class="student-case-card__summary-wrap"><span class="student-case-card__visual"><img src="${escapeHtml(item.images[0])}" alt="${escapeHtml(item.title)} 대표 이미지" loading="lazy" decoding="async"><span class="student-case-card__number">${String(index + 1).padStart(2, "0")} / 09</span></span><span class="student-case-card__body"><span class="student-case-card__meta"><span>${escapeHtml(item.typeLabel)}</span><time datetime="${escapeHtml(item.datetime)}">${escapeHtml(item.date)}</time></span><span class="student-case-card__eyebrow">${escapeHtml(item.eyebrow)}</span><span class="student-case-card__title">${escapeHtml(item.title)}</span><span class="student-case-card__summary">${escapeHtml(item.summary)}</span><span class="student-case-card__actions"><span class="student-case-card__detail">상세 기록 보기</span><span class="student-case-card__source-label">원문 ↗</span></span></span></summary><span class="student-case-card__expanded"><p>${escapeHtml(item.detail)}</p><span class="student-case-card__gallery">${images}</span><a class="student-case-card__source" href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.sourceTitle)} 원문 확인 ↗</a></span></details>`;
  };
  fetch("data/student-cases.json").then(response => { if (!response.ok) throw new Error("student-cases.json을 불러오지 못했습니다."); return response.json(); }).then(items => {
    grid.innerHTML = items.map(renderCard).join("");
    if (count) count.textContent = items.length;
    filters.forEach(filter => filter.addEventListener("click", () => { const selected = filter.dataset.caseFilter; filters.forEach(button => button.setAttribute("aria-pressed", String(button === filter))); grid.querySelectorAll("[data-case-type]").forEach(card => { card.hidden = selected !== "all" && card.dataset.caseType !== selected; }); }));
  }).catch(error => { grid.innerHTML = `<p class="student-cases-error">${escapeHtml(error.message)}</p>`; });
})();
