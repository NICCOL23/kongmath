(() => {
  const grid = document.querySelector("[data-student-case-grid]");
  const filters = [...document.querySelectorAll("[data-case-filter]")];
  const count = document.querySelector("[data-case-count]");
  if (!grid) return;
  fetch("data/student-cases.json").then(response => { if (!response.ok) throw new Error("student-cases.json을 불러오지 못했습니다."); return response.json(); }).then(items => {
    grid.innerHTML = items.map(StudentCaseCard.renderArchiveCard).join("");
    grid.querySelectorAll(".student-case-card").forEach(card => {
      card.addEventListener("toggle", () => {
        if (!card.open) return;
        grid.querySelectorAll(".student-case-card[open]").forEach(other => {
          if (other !== card) other.removeAttribute("open");
        });
      });
    });
    if (count) count.textContent = items.length;
    filters.forEach(filter => filter.addEventListener("click", () => { const selected = filter.dataset.caseFilter; filters.forEach(button => button.setAttribute("aria-pressed", String(button === filter))); grid.querySelectorAll("[data-case-type]").forEach(card => { card.hidden = selected !== "all" && card.dataset.caseType !== selected; }); }));
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    const linkedCard = hashId ? document.getElementById(hashId) : null;
    if (linkedCard?.matches(".student-case-card")) {
      linkedCard.open = true;
      requestAnimationFrame(() => linkedCard.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
  }).catch(error => { grid.innerHTML = `<p class="student-cases-error">${StudentCaseCard.escapeHtml(error.message)}</p>`; });
})();
