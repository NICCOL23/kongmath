(() => {
  const grid = document.querySelector("[data-student-preview-grid]");
  if (!grid) return;

  Promise.all([fetch("data/student-cases.json?v=homepage-preview-05"),window.kmHomeContentRequest||Promise.resolve(null)])
    .then(async ([response,managed]) => {
      if(managed?.results)return {managed:true,cards:managed.results.cards};
      if (!response.ok) throw new Error("student-cases.json을 불러오지 못했습니다.");
      return response.json();
    })
    .then(items => {
      // 메인 미리보기는 노출 순서를 별도로 관리합니다. 전체 기록의 순서는 유지하면서
      // 두 번째 카드에는 05/09 기말고사 장학금 사례를 노출합니다.
      const previewIds = ["224470495734", "224369881711", "224369893942"];
      if(items.managed){grid.innerHTML=items.cards.map(StudentCaseCard.renderPreviewCard).join("");return;}
      const byId = new Map(items.filter(item => item.type === "achievement").map(item => [item.id, item]));
      const achievements = previewIds.map(id => byId.get(id)).filter(Boolean);
      grid.innerHTML = achievements.map(StudentCaseCard.renderPreviewCard).join("");
    })
    .catch(error => {
      grid.innerHTML = `<p class="student-preview-error">${StudentCaseCard.escapeHtml(error.message)}</p>`;
    });
})();
