(() => {
  const list = document.querySelector("[data-review-list]");
  const empty = document.querySelector("[data-review-empty]");
  if (!list || !empty) return;

  const escapeText = value => String(value ?? "").trim();

  fetch("data/reviews.json", { headers: { Accept: "application/json" } })
    .then(response => {
      if (!response.ok) throw new Error("후기 데이터를 불러오지 못했습니다.");
      return response.json();
    })
    .then(data => {
      const reviews = Array.isArray(data.reviews)
        ? data.reviews.filter(review => review && review.approved === true)
        : [];

      if (!reviews.length) {
        empty.hidden = false;
        return;
      }

      reviews.forEach(review => {
        const card = document.createElement("article");
        card.className = "review-card";

        const meta = document.createElement("p");
        meta.className = "review-card__meta";
        meta.textContent = review.type === "parent" ? "학부모 후기" : "학생 후기";

        const title = document.createElement("h3");
        title.className = "review-card__author";
        title.textContent = escapeText(review.author) || "익명";

        const content = document.createElement("p");
        content.className = "review-card__content";
        content.textContent = escapeText(review.content);

        const date = document.createElement("time");
        date.className = "review-card__date";
        date.dateTime = escapeText(review.date);
        date.textContent = escapeText(review.date);

        card.append(meta, title, content, date);
        list.appendChild(card);
      });
    })
    .catch(() => {
      empty.hidden = false;
    });
})();
