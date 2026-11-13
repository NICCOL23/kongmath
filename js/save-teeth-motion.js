(() => {
  const section = document.querySelector('#save-teeth');
  const content = section?.querySelector('.inner');
  if (!content || !('IntersectionObserver' in window)) return;

  // 화면에 처음 들어온 시점에만 재생하고 이후 관찰을 끝냅니다.
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-entering');
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  observer.observe(content);
})();
