(() => {
  const featuredRoot = document.querySelector("[data-academy-featured]");
  const archiveRoot = document.querySelector("[data-academy-archive]");
  if (!featuredRoot && !archiveRoot) return;
  document.querySelector(".academy-legacy-cards")?.remove();

  const dataUrl = "data/academy-cards.json?v=academy-cards-component-v1";
  const featuredIds = ["about-studyroom", "about-football", "about-tuition", "about-consult", "about-academy", "about-winter-2026"];

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  document.addEventListener("toggle", event => {
    const openedDetails = event.target;
    if (!(openedDetails instanceof HTMLDetailsElement) || !openedDetails.open || !openedDetails.closest(".academy-card")) return;
    document.querySelectorAll(".academy-card details[open]").forEach(details => {
      if (details !== openedDetails) details.open = false;
    });
  }, true);

  const external = href => /^https?:\/\//.test(href);
  const linkAttributes = href => external(href) ? ' target="_blank" rel="noopener noreferrer"' : "";

  const closeAcademyDetails = () => {
    document.querySelectorAll(".academy-card details[open]").forEach(details => {
      details.open = false;
    });
  };

  function renderDetails(card) {
    const paragraphs = (card.paragraphs || []).map(text => `<p>${escapeHtml(text)}</p>`).join("");
    const list = card.list?.length ? `<ul>${card.list.map(text => `<li>${escapeHtml(text)}</li>`).join("")}</ul>` : "";
    const gallery = card.gallery?.length ? `<div class="academy-card__gallery">${card.gallery.map(image => `<a href="${escapeHtml(image.src)}"${linkAttributes(image.src)}><img src="${escapeHtml(image.src)}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async"></a>`).join("")}</div>` : "";
    const links = (card.links || []).map(link => `<a href="${escapeHtml(link.href)}"${linkAttributes(link.href)}>${escapeHtml(link.label)}</a>`).join("");
    const afterGallery = (card.linksAfterGallery || []).map(link => `<a href="${escapeHtml(link.href)}"${linkAttributes(link.href)}>${escapeHtml(link.label)}</a>`).join("");
    return `<div class="academy-card__detail">${paragraphs}${list}${links}${gallery}${afterGallery}</div>`;
  }

  function renderCard(card, options = {}) {
    const slideClass = options.slide ? " swiper-slide" : "";
    const posterClass = card.poster ? " academy-card__image--poster" : "";
    return `<article class="academy-card${slideClass}" id="${escapeHtml(card.id)}">
      <a class="academy-card__image${posterClass}" href="${escapeHtml(card.href)}"${linkAttributes(card.href)}>
        <img src="${escapeHtml(card.image)}" width="${card.width}" height="${card.height}" alt="${escapeHtml(card.alt)}" loading="lazy" decoding="async">
      </a>
      <div class="academy-card__body">
        <p class="academy-card__category">${escapeHtml(card.category)} <time datetime="${escapeHtml(card.date.replaceAll(".", "-"))}">${escapeHtml(card.date)}</time></p>
        <h3 class="academy-card__title">${escapeHtml(card.title)}</h3>
        <p class="academy-card__description">${escapeHtml(card.description)}</p>
        <details>
          <summary class="academy-card__link">본문 읽기<span class="academy-card__sr"> – ${escapeHtml(card.title)}</span></summary>
          ${renderDetails(card)}
        </details>
      </div>
    </article>`;
  }

  function renderFeatured(cards) {
    featuredRoot.innerHTML = `<div class="academy-card-slider swiper" aria-label="학원 소개 카드 슬라이더">
      <div class="swiper-wrapper">${cards.map(card => renderCard(card, { slide: true })).join("")}</div>
      <button type="button" class="academy-slider-prev" aria-label="이전 학원 소개 카드">‹</button>
      <button type="button" class="academy-slider-next" aria-label="다음 학원 소개 카드">›</button>
      <div class="academy-slider-pagination" aria-label="학원 소개 카드 페이지"></div>
    </div>`;

    const slider = featuredRoot.querySelector(".academy-card-slider");
    if (!window.Swiper) return;
    const swiper = new Swiper(slider, {
      loop: true,
      speed: 560,
      spaceBetween: 20,
      slidesPerView: 1,
      autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { nextEl: ".academy-slider-next", prevEl: ".academy-slider-prev" },
      pagination: { el: ".academy-slider-pagination", clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 4 }
      }
    });

    swiper.on("slideChange", closeAcademyDetails);
    swiper.on("slideChangeTransitionStart", closeAcademyDetails);
    slider.addEventListener("click", event => {
      if (event.target.closest(".academy-slider-prev, .academy-slider-next, .academy-slider-pagination")) {
        closeAcademyDetails();
      }
    }, true);
  }

  fetch(dataUrl)
    .then(response => {
      if (!response.ok) throw new Error("academy-cards.json을 불러오지 못했습니다.");
      return response.json();
    })
    .then(cards => {
      if (featuredRoot) {
        const byId = new Map(cards.map(card => [card.id, card]));
        renderFeatured(featuredIds.map(id => byId.get(id)).filter(Boolean));
      }
      if (archiveRoot) archiveRoot.innerHTML = cards.map(card => renderCard(card)).join("");
    })
    .catch(error => {
      const message = `<p class="academy-cards-error">${escapeHtml(error.message)}</p>`;
      if (featuredRoot) featuredRoot.innerHTML = message;
      if (archiveRoot) archiveRoot.innerHTML = message;
    });
})();

