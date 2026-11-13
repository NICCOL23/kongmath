// 세 장면을 같은 자리에 포개고, 자동 재생 시간으로 다음 사진의 크기를 정합니다.
const track = document.querySelector('.hero-scroll-track');
const hero = track.querySelector('#main-visual');
const photos = [...hero.querySelectorAll('.visual-img .swiper-slide')];
const copies = [...hero.querySelectorAll('.visual-text-swiper .swiper-slide')];
// 화면에 보이는 막대 순서와 사진의 내부 번호를 연결합니다.
const buttons = [...hero.querySelectorAll('[data-scene]')].sort((a, b) => Number(a.dataset.scene) - Number(b.dataset.scene));
const pauseButton = hero.querySelector('.hero-pause');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.min(1, Math.max(0, value));
const ease = value => value * value * (3 - 2 * value);


function draw(position, fill = 1) {
  const current = Math.floor(position);
  const progress = position - current;
  const next = progress > 0 ? (current + 1) % photos.length : -1;
  const growth = ease(progress);
  const visible = next === -1 ? current : next;
  const incomingOpacity = ease(clamp(progress / .45));
  const outgoingTextOpacity = 1 - ease(clamp(progress / .18));
  // 새 사진과 제목은 전환 첫 프레임부터 같은 확대 진행률을 사용합니다.
  const titleGrowth = reducedMotion.matches ? 1 : growth;

  // 사진은 장면 전환과 스크롤 전환 모두 크기를 바꾸지 않습니다.
  photos.forEach((photo, index) => {
    const incoming = index === next;
    photo.style.zIndex = incoming ? 2 : 1;
    photo.style.opacity = incoming ? incomingOpacity : Number(index === current);
    photo.style.transform = 'none';
    photo.setAttribute('aria-hidden', String(index !== visible));

    // 새 제목과 사진은 함께 선명해지고, 이전 제목은 먼저 옅어집니다.
    copies[index].style.opacity = incoming ? incomingOpacity : Number(index === current) * outgoingTextOpacity;
    copies[index].style.setProperty('--title-growth', incoming ? titleGrowth : 1);
    copies[index].setAttribute('aria-hidden', String(index !== visible));
    buttons[index].setAttribute('aria-pressed', String(index === visible));
    buttons[index].style.setProperty('--scene-progress', index === visible ? (index === current ? fill : 0) : 0);
  });
}


// 자동 재생 시간에 맞춰 장면을 교차 페이드합니다. 막대를 누르면 그 장면에서 다시 시작합니다.
const dwell = 6000;
const duration = 1800;
// 첨부 화면에 나온 원본 사진을 PC와 모바일의 첫 장면에 사용합니다.
const firstScene = 0;
const firstPhoto = photos[firstScene];
firstPhoto.querySelector('img:not(.main-pc-img)').src = firstPhoto.querySelector('.main-pc-img').getAttribute('src');
// 첨부 기준 화면에 맞춰 가족 사진과 해당 문구부터 표시합니다.
let scene = firstScene;
let elapsed = 0;
let previousTime = null;
let paused = reducedMotion.matches;
let ready = false;
let frame = null;
let introTransitionActive = false;

// 사진과 막대가 같은 시계를 써서 일시정지 중에는 함께 멈춥니다.
function animate(now) {
  if (previousTime !== null) elapsed += now - previousTime;
  previousTime = now;

  if (elapsed >= dwell + duration) {
    scene = (scene + 1) % photos.length;
    elapsed = 0;
  }
  draw(scene + clamp((elapsed - dwell) / duration), clamp(elapsed / dwell));
  frame = requestAnimationFrame(animate);
}

function updatePlayback() {
  // 아이콘 상태와 버튼을 눌렀을 때 실행할 동작의 이름을 함께 바꿉니다.
  const action = paused ? '자동 재생' : '일시정지';
  pauseButton.dataset.paused = String(paused);
  pauseButton.setAttribute('aria-label', action);
  pauseButton.title = action;
  if (paused || document.hidden || reducedMotion.matches || introTransitionActive) {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
  } else if (ready && frame === null) {
    frame = requestAnimationFrame(animate);
  }
}

buttons.forEach(button => button.addEventListener('click', () => {
  scene = Number(button.dataset.scene);
  elapsed = 0;
  previousTime = null;
  draw(scene, paused ? 1 : 0);
}));
pauseButton.addEventListener('click', () => {
  if (reducedMotion.matches) return;
  paused = !paused;
  updatePlayback();
});
document.addEventListener('visibilitychange', updatePlayback);
reducedMotion.addEventListener('change', () => {
  pauseButton.disabled = reducedMotion.matches;
  if (reducedMotion.matches) {
    paused = true;
    elapsed = 0;
    draw(scene);
  }
  updatePlayback();
});
pauseButton.disabled = reducedMotion.matches;
draw(scene, paused ? 1 : 0);
updatePlayback();
Promise.all([...hero.querySelectorAll('.visual-img img')].map(image => image.decode().catch(() => {})))
  .then(() => {
    ready = true;
    updatePlayback();
  });

// 브라우저의 기본 스크롤 위치만 읽어 메시지, 축소, 소개 순서로 그립니다.
const introStage = track.querySelector('.intro-transition-stage');
const clinicIntro = track.querySelector('#clinic-intro');
const careerNumber = clinicIntro.querySelector('.count-num');
const introMessage = track.querySelector('.intro-transition-message');
const introControls = hero.querySelector('.hero-controls');
const heroDetails = hero.querySelectorAll('.visual-btn, .visual-info, .main-link');
let introFrame = null;
let careerCountStarted = false;

// 소개 글이 보이기 시작하면 한 번만 세고, 완료된 숫자는 그대로 둡니다.
function startCareerCount() {
  if (careerCountStarted) return;
  careerCountStarted = true;
  const duration = 1100;
  let startedAt;

  function drawCareerCount(now) {
    startedAt ??= now;
    const progress = reducedMotion.matches ? 1 : clamp((now - startedAt) / duration);
    const years = String(Math.floor(ease(progress) * Number(careerNumber.dataset.count)));
    if (careerNumber.textContent !== years) careerNumber.textContent = years;
    if (progress < 1) requestAnimationFrame(drawCareerCount);
  }

  if (reducedMotion.matches) {
    careerNumber.textContent = careerNumber.dataset.count;
  } else {
    requestAnimationFrame(drawCareerCount);
  }
}

function renderIntroTransition() {
  introFrame = null;
  const enabled = !reducedMotion.matches;
  const distance = track.offsetHeight - introStage.offsetHeight;
  const progress = enabled && distance > 0
    ? clamp((-track.getBoundingClientRect().top) / distance)
    : 0;
  // 사진과 제목은 같은 자리를 유지하며 서로 다른 시점에 사라집니다.
  // 사진은 크기를 바꾸지 않고 제목처럼 투명도만 조절합니다.
  const controlsFade = ease(clamp((progress - .09) / .30));
  const titleFade = ease(clamp((progress - .18) / .28));
  // 기존 히어로가 정리된 뒤 전환 문구를 보여줍니다.
  const messageFirst = ease(clamp((progress - .34) / .08));
  const messageSecond = ease(clamp((progress - .40) / .08));
  // 전환 문구가 먼저 완전히 사라진 뒤 다음 소개 영역을 보여줍니다.
  const message = Number(messageSecond > 0) * (1 - ease(clamp((progress - .50) / .13)));
  // 배경과 소개 글이 제자리에 닿기 전에 이동 속도를 천천히 줄입니다.
  const wipeProgress = clamp((progress - .52) / .34);
  const backgroundWipe = wipeProgress ** 3 * (10 - 15 * wipeProgress + 6 * wipeProgress ** 2);
  const introReveal = ease(clamp((progress - .69) / .19));

  track.style.setProperty('--photo-scale', 1);
  track.style.setProperty('--photo-opacity', 1 - ease(clamp((progress - .20) / .25)));
  track.style.setProperty('--controls-opacity', 1 - controlsFade);
  track.style.setProperty('--title-opacity', 1 - titleFade);
  track.style.setProperty('--hero-background-inset', backgroundWipe * 100 + '%');
  track.style.setProperty('--intro-opacity', introReveal);
  track.style.setProperty('--intro-visibility', introReveal > 0 ? 'visible' : 'hidden');
  // 소개 글의 윗부분을 걷히는 배경 경계 아래에 두고 함께 올립니다.
  const backgroundEdge = hero.offsetHeight * (1 - backgroundWipe);
  track.style.setProperty('--intro-offset', backgroundEdge + 'px');
  if (!careerCountStarted && (!enabled || introReveal >= .25)) {
    const counterBounds = careerNumber.getBoundingClientRect();
    const counterIsVisible = counterBounds.height > 0
      && counterBounds.bottom > 0
      && counterBounds.top < window.innerHeight;
    if (counterIsVisible) startCareerCount();
  }
  track.style.setProperty('--message-opacity', message);
  track.style.setProperty('--message-visibility', message > 0 ? 'visible' : 'hidden');
  track.style.setProperty('--message-first', messageFirst);
  track.style.setProperty('--message-second', messageSecond);

  introMessage.setAttribute('aria-hidden', String(enabled && message === 0));
  introMessage.inert = enabled && message === 0;
  for (const detail of heroDetails) detail.inert = enabled && controlsFade === 1;
  for (const control of [...buttons, pauseButton]) control.inert = enabled && controlsFade === 1;

  hero.inert = enabled && progress >= .92;
  clinicIntro.inert = enabled && progress < .92;

  // 임시 정지는 사용자가 누른 일시정지 상태와 독립적으로 처리합니다.
  const leavingHero = enabled && window.scrollY > 0;
  if (introTransitionActive !== leavingHero) {
    introTransitionActive = leavingHero;
    updatePlayback();
  }
}

function scheduleIntroTransition() {
  if (introFrame === null) introFrame = requestAnimationFrame(renderIntroTransition);
}

function sizeIntroTransition() {
  track.classList.toggle('is-enhanced', !reducedMotion.matches);
  track.style.setProperty('--hero-center', (Math.min(window.innerHeight, hero.offsetHeight) / 2) + 'px');
  renderIntroTransition();
}

window.addEventListener('scroll', scheduleIntroTransition, { passive: true });
window.addEventListener('resize', sizeIntroTransition);
reducedMotion.addEventListener('change', sizeIntroTransition);
sizeIntroTransition();

function skipIntroTransition() {
  if (reducedMotion.matches) return;
  const start = window.scrollY + track.getBoundingClientRect().top;
  const distance = track.offsetHeight - introStage.offsetHeight;
  window.scrollTo({ top: Math.ceil(start + distance), behavior: 'instant' });
  renderIntroTransition();
  clinicIntro.focus({ preventScroll: true });
}

if (location.hash === '#clinic-intro') {
  window.addEventListener('load', skipIntroTransition, { once: true });
}

