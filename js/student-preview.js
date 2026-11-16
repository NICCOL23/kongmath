(() => {
  const grid = document.querySelector("[data-student-preview-grid]");
  if (!grid) return;

  fetch("data/student-cases.json")
    .then(response => {
      if (!response.ok) throw new Error("student-cases.json을 불러오지 못했습니다.");
      return response.json();
    })
    .then(items => {
      const achievements = items.filter(item => item.type === "achievement").slice(0, 3);
      grid.innerHTML = achievements.map(StudentCaseCard.renderPreviewCard).join("");
    })
    .catch(error => {
      grid.innerHTML = `<p class="student-preview-error">${StudentCaseCard.escapeHtml(error.message)}</p>`;
    });
})();
