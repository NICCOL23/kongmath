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

  function move(direction) {
    const max = track.scrollWidth - track.clientWidth;
    const origin = cards[0].offsetLeft;
    const positions = [...new Set(cards.map(card => Math.min(card.offsetLeft - origin, max)))];
    const current = track.scrollLeft;
    const next = direction > 0
      ? positions.find(position => position > current + 2) ?? 0
      : positions.findLast(position => position < current - 2) ?? max;

    track.scrollTo({ left: next, behavior: reducedMotion.matches ? "instant" : "smooth" });
  }

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
    if (event.target instanceof HTMLDetailsElement && event.target.open) pause();
  }, true);

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) pause();
  });
  document.addEventListener("visibilitychange", updatePlayback);

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0 });
  observer.observe(track);
  controls.hidden = false;
  updatePlayback();
})();
