const implantCard = document.querySelector('.implant-motion');
const implantCrown = implantCard.querySelector('.implant-motion-crown');
const implantReplay = document.querySelector('.implant-replay');
const implantMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');

function playImplantMotion() {
  if (implantMotionPreference.matches) return;
  implantCard.classList.remove('is-playing');
  // 이전 애니메이션을 브라우저에 반영한 뒤 첫 프레임부터 다시 시작합니다.
  void implantCrown.offsetWidth;
  implantCard.classList.add('is-playing');
  implantReplay.hidden = false;
}

// 화면에 카드가 충분히 들어오면 한 번만 재생합니다.
const implantObserver = new IntersectionObserver(([entry], observer) => {
  if (!entry.isIntersecting || entry.intersectionRatio < .6) return;
  observer.disconnect();
  playImplantMotion();
}, { threshold: .6 });
implantObserver.observe(implantCard);
implantReplay.addEventListener('click', playImplantMotion);
