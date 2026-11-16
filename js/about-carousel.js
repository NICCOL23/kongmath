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
    playButton.textContent = playing ? "Ⅱ 일시정지" : "▶ 재생";
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

  let cardWidth, pitch;
  let animation;

  function measure() {
    const first = slides[0].getBoundingClientRect();
    width = track.clientWidth;
    cardWidth = first.width;
    pitch = slides[1].getBoundingClientRect().left - first.left;
  }

  function showSlide(target) {
    track.scrollTo({ left: target * pitch, behavior: "instant" });
  }

  function nearestSlide() {
    return Math.round(track.scrollLeft / pitch);
  }

  function updateVisibleSlides() {
    const offset = track.scrollLeft;
    slides.forEach((slide, number) => {
      const left = number * pitch - offset;
      const right = left + cardWidth;
      const outside = right <= 1 || left >= width - 1;
      if (slide.inert !== outside) slide.inert = outside;
    });
  }

  function stopAnimation() {
    if (!animation) return;
    cancelAnimationFrame(animation);
    animation = 0;
    active = -1;
    track.style.removeProperty("scroll-snap-type");
  }

  function settle() {
    if (animation) return;
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
    if (reducedMotion.matches) {
      showSlide(active);
      stopAnimation();
      settle();
      return;
    }
    cancelAnimationFrame(animation);
    const from = track.scrollLeft;
    const to = active * pitch;
    track.style.scrollSnapType = "none";
    let start;
    function animate(now) {
      start ??= now;
      const progress = Math.min((now - start) / 520, 1);
      const eased = progress * progress * (3 - 2 * progress);
      track.scrollTo({ left: from + (to - from) * eased, behavior: "instant" });
      if (progress < 1) {
        animation = requestAnimationFrame(animate);
      } else {
        animation = 0;
        settle();
        track.style.removeProperty("scroll-snap-type");
      }
    }
    animation = requestAnimationFrame(animate);
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
    stopAnimation();
    measure();
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

  function pauseOnContact() {
    pause();
    stopAnimation();
  }

  track.addEventListener("pointerdown", pauseOnContact);
  track.addEventListener("touchstart", pauseOnContact, { passive: true });
  track.addEventListener("focusin", event => {
    // A fragment link can focus the track without any carousel interaction.
    if (event.target !== track) pause();
  });
  track.addEventListener("keydown", event => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) pause();
  });
  track.addEventListener("wheel", event => {
    if (event.deltaX || event.shiftKey) pauseOnContact();
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
    if (reducedMotion.matches) pauseOnContact();
  });
  document.addEventListener("visibilitychange", updatePlayback);

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0 });
  measure();
  showSlide(index);
  updateVisibleSlides();
  observer.observe(track);
  controls.hidden = false;
  updatePlayback();
})();
