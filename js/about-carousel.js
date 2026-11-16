(() => {
  const track = document.getElementById("about-story-track");
  const controls = document.querySelector(".about-story-controls");
  const playButton = controls.querySelector("[data-story-play]");
  const cards = [...track.children];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let playing = !reducedMotion.matches;
  let inView = false;
  let timer;

  function updatePlayback() {
    clearInterval(timer);
    playButton.textContent = playing ? "일시정지" : "재생";
    if (playing && inView && !document.hidden) {
      timer = setInterval(() => move(1), 5500);
    }
  }

  function pause() {
    playing = false;
    updatePlayback();
  }

  // Repeat the cards on both sides so each step has a neighbor at either edge.
  function copies() {
    return cards.map(card => {
      const copy = card.cloneNode(true);
      copy.removeAttribute("id");
      copy.inert = true;
      return copy;
    });
  }

  track.prepend(...copies());
  track.append(...copies());
  const slides = [...track.children];
  let active = -1;
  const linkedCard = cards.findIndex(card => "#" + card.id === window.location.hash);
  let index = cards.length + Math.max(0, linkedCard);
  let width;
  let settleTimer;

  function cardPitch() {
    return slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
  }

  function peekInset() {
    const cardWidth = slides[0].getBoundingClientRect().width;
    return cardPitch() - cardWidth / 2;
  }

  function showSlide(target, behavior = "instant") {
    track.scrollTo({ left: target * cardPitch() - peekInset(), behavior });
  }

  function nearestSlide() {
    return Math.round((track.scrollLeft + peekInset()) / cardPitch());
  }

  function updateVisibleSlides() {
    const bounds = track.getBoundingClientRect();
    slides.forEach(slide => {
      const card = slide.getBoundingClientRect();
      slide.inert = card.right <= bounds.left + 1 || card.left >= bounds.right - 1;
    });
  }

  function settle() {
    const current = nearestSlide();
    const normalized = cards.length + current % cards.length;
    if (current !== normalized) {
      const source = slides[current];
      const focused = document.activeElement;
      const focusable = "a[href], summary";
      const focusedIndex = source ? [...source.querySelectorAll(focusable)].indexOf(focused) : -1;
      showSlide(normalized);
      updateVisibleSlides();
      if (focusedIndex >= 0) {
        slides[normalized].querySelectorAll(focusable)[focusedIndex]?.focus({ preventScroll: true });
      }
    }
    index = normalized;
    active = -1;
    updateVisibleSlides();
  }

  function move(direction) {
    const current = active < 0 ? nearestSlide() : active;
    active = Math.max(0, Math.min(slides.length - 1, current + direction));
    showSlide(active, reducedMotion.matches ? "instant" : "smooth");
  }

  track.addEventListener("scroll", () => {
    updateVisibleSlides();
    if (!("onscrollend" in track)) {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }
  }, { passive: true });
  track.addEventListener("scrollend", settle);

  new ResizeObserver(() => {
    if (track.clientWidth === width) return;
    width = track.clientWidth;
    showSlide(index);
    updateVisibleSlides();
  }).observe(track);

  controls.querySelectorAll("[data-story-step]").forEach(button => {
    button.addEventListener("click", () => {
      pause();
      move(Number(button.dataset.storyStep));
    });
  });

  playButton.addEventListener("click", () => {
    playing = !playing;
    if (playing) {
      track.querySelectorAll("details[open]").forEach(story => { story.open = false; });
    }
    updatePlayback();
  });

  track.addEventListener("pointerdown", pause);
  track.addEventListener("focusin", pause);
  track.addEventListener("wheel", event => {
    if (event.deltaX || event.shiftKey) pause();
  }, { passive: true });
  track.addEventListener("toggle", event => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement)) return;
    if (details.open) pause();
    const storyIndex = slides.indexOf(details.closest(".about-story")) % cards.length;
    for (let copy = storyIndex; copy < slides.length; copy += cards.length) {
      slides[copy].querySelector("details").open = details.open;
    }
  }, true);

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) pause();
  });
  document.addEventListener("visibilitychange", updatePlayback);

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0 });
  showSlide(index);
  updateVisibleSlides();
  observer.observe(track);
  controls.hidden = false;
  updatePlayback();
})();
