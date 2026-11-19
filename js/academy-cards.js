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

  const asElement = target => target instanceof Element ? target : null;
  const isInsideAcademyDetails = target => Boolean(asElement(target)?.closest(".academy-card details, .academy-card__image"));
  const closeOtherAcademyDetails = currentDetails => {
    document.querySelectorAll(".academy-card details[open]").forEach(details => {
      if (details !== currentDetails) details.open = false;
    });
  };
  const handleAcademyPointer = event => {
    const target = asElement(event.target);
    if(target?.closest(".km-report-viewer"))return;
    const summary = target?.closest(".academy-card details > summary");
    if (summary) {
      closeOtherAcademyDetails(summary.parentElement);
      return;
    }
    if (!event.target.closest(".km-report-viewer") && !isInsideAcademyDetails(event.target)) closeAcademyDetails();
  };
  document.addEventListener("pointerdown", handleAcademyPointer, true);
  document.addEventListener("click", handleAcademyPointer, true);
  document.addEventListener("touchstart", handleAcademyPointer, { capture: true, passive: true });
  document.addEventListener("focusin", event => {
    if (!event.target.closest(".km-report-viewer") && !isInsideAcademyDetails(event.target)) closeAcademyDetails();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !document.querySelector(".km-report-viewer[open]")) closeAcademyDetails();
  });
  let linkedOpening=false;
  // Keep the opened article while scrolling or viewing its photo.
  function openArchiveCard(){if(!archiveRoot||!location.hash)return;let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const card=document.getElementById(id);if(!card||!archiveRoot.contains(card))return;const details=card.querySelector('details');if(!details)return;linkedOpening=true;card.scrollIntoView({block:'center',behavior:'instant'});details.open=true;setTimeout(()=>{linkedOpening=false;},400);}
  if(archiveRoot){new MutationObserver(openArchiveCard).observe(archiveRoot,{childList:true});window.addEventListener('hashchange',openArchiveCard);archiveRoot.addEventListener('click',event=>{const link=event.target.closest('.km-card-title-link,.km-card-description-link');if(!link)return;const u=new URL(link.href);if(u.pathname===location.pathname&&u.hash){event.preventDefault();history.replaceState(null,'',u.hash);openArchiveCard();}});}

  function renderDetails(card) {
    const paragraphs = (card.paragraphs || []).map(text => `<p>${escapeHtml(text)}</p>`).join("");
    const list = card.list?.length ? `<ul>${card.list.map(text => `<li>${escapeHtml(text)}</li>`).join("")}</ul>` : "";
    const gallery = card.gallery?.length ? `<div class="academy-card__gallery">${card.gallery.map(image => `<a href="${escapeHtml(image.src)}"${linkAttributes(image.src)}><img src="${escapeHtml(image.src)}" width="${Number(image.width)||900}" height="${Number(image.height)||900}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async"></a>`).join("")}</div>` : "";
    const links = (card.links || []).map(link => `<a href="${escapeHtml(link.href)}"${linkAttributes(link.href)}>${escapeHtml(link.label)}</a>`).join("");
    const afterGallery = (card.linksAfterGallery || []).map(link => `<a href="${escapeHtml(link.href)}"${linkAttributes(link.href)}>${escapeHtml(link.label)}</a>`).join("");
    return `<div class="academy-card__detail">${paragraphs}${list}${links}${gallery}${afterGallery}</div>`;
  }

  function detailURL(card){try{const u=new URL(card.href,location.href);if(!/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(u.pathname))return card.href;}catch{}return 'academy.html#'+encodeURIComponent(card.id);}
  function photoURL(card){try{const u=new URL(card.href,location.href);if(/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(u.pathname))return card.href;}catch{}return card.image;}
  function renderCard(card, options = {}) {
    const slideClass = options.slide ? " swiper-slide" : "";
    const posterClass = card.poster ? " academy-card__image--poster" : "";
    return `<article class="academy-card${slideClass}" id="${escapeHtml(card.id)}">
      <a class="academy-card__image${posterClass}" href="${escapeHtml(photoURL(card))}" aria-label="${escapeHtml(card.title)} 사진 확대" title="사진 확대">
        <img src="${escapeHtml(card.image)}" width="${Number(card.width)||900}" height="${Number(card.height)||900}" alt="${escapeHtml(card.alt)}" loading="lazy" decoding="async">
      </a>
      <div class="academy-card__body">
        <p class="academy-card__category">${escapeHtml(card.category)} <time datetime="${escapeHtml(card.date.replaceAll(".", "-"))}">${escapeHtml(card.date)}</time></p>
        <h3 class="academy-card__title"><a class="km-card-title-link" href="${escapeHtml(detailURL(card))}">${escapeHtml(card.title)}</a></h3>
        <p class="academy-card__description"><a class="km-card-description-link" href="${escapeHtml(detailURL(card))}">${escapeHtml(card.description)}</a></p>
        ${options.slide ? `<a class="academy-card__link km-card-detail-link" href="${escapeHtml(detailURL(card))}">자세히 보기<span class="academy-card__sr"> – ${escapeHtml(card.title)}</span></a>` : `<details><summary class="academy-card__link">본문 읽기<span class="academy-card__sr"> – ${escapeHtml(card.title)}</span></summary>${renderDetails(card)}</details>`}
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
      loop: cards.length > 4,
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

  Promise.all([fetch(dataUrl),window.kmHomeContentRequest||Promise.resolve(null)])
    .then(async ([response,managed]) => {
      if(archiveRoot&&managed?.academyfull)return {managedArchive:true,cards:managed.academyfull.cards};
      if(managed?.academy&&!archiveRoot)return {managed:true,cards:managed.academy.cards};
      if (!response.ok) throw new Error("academy-cards.json을 불러오지 못했습니다.");
      return response.json();
    })
    .then(cards => {
      if(cards.managedArchive){archiveRoot.innerHTML=cards.cards.map(card=>renderCard(card)).join("");return;}
      if (featuredRoot) {
        if(cards.managed){renderFeatured(cards.cards);return;}
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

