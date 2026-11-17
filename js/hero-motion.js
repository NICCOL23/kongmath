async function loadHeroSlides(hero) {
  let slides;
  try {
    const response = await fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_hero_copy', {
      signal: AbortSignal.timeout(2200),
      credentials: 'omit',
    });
    if (!response.ok) return;
    const data = await response.json();
    slides = data.slides;
    if (!Array.isArray(slides) || !slides.length || slides.length > 12 || !slides.every(slide =>
      slide && ['image', 'alt', 'eyebrow', 'heading', 'accent', 'suffix', 'description'].every(key => typeof slide[key] === 'string') &&
      /^https:\/\/(?:kongmath\.com|kongmath\.mycafe24\.com)\//.test(slide.image)
    )) return;
  } catch {
    return;
  }

  const photoList = hero.querySelector('.visual-img .swiper-wrapper');
  const copyList = hero.querySelector('.visual-text-swiper .swiper-wrapper');
  const controls = hero.querySelector('.hero-controls');
  const photoTemplate = photoList.firstElementChild;
  const copyTemplate = copyList.firstElementChild;
  const labels = [...controls.querySelectorAll('[data-scene]')].map(button =>
    button.getAttribute('aria-label').split(' · ')[0]
  );

  const photos = [];
  const copies = [];
  const buttons = [];
  slides.forEach((slide, index) => {
    const photo = photoTemplate.cloneNode(true);
    photo.querySelectorAll('img').forEach(img => {
      img.src = slide.image;
      img.alt = slide.alt;
    });
    photos.push(photo);

    const copy = copyTemplate.cloneNode(true);
    copy.querySelector('.visual-en').textContent = slide.eyebrow;
    const title = copy.querySelector('h2');
    const accent = document.createElement('span');
    accent.textContent = slide.accent;
    title.replaceChildren(slide.heading);
    if (slide.heading && (slide.accent || slide.suffix)) title.append(document.createElement('br'));
    title.append(accent, slide.suffix);
    const description = copy.querySelector('.visual-desc');
    description.replaceChildren();
    slide.description.split('\n').forEach((line, lineIndex) => {
      if (lineIndex) description.append(document.createElement('br'));
      description.append(line);
    });
    copies.push(copy);

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.scene = index;
    const label = labels[index] || (index + 1) + '번 장면';
    const titleLabel = slide.original === 2 || slide.original === -1 ? slide.accent || slide.heading : '';
    button.setAttribute('aria-label', titleLabel ? label + ' · ' + titleLabel : label);
    button.setAttribute('aria-pressed', String(index === 0));
    buttons.push(button);
  });
  photoList.replaceChildren(...photos);
  copyList.replaceChildren(...copies);
  controls.replaceChildren(...buttons);
}

async function startHeroMotion() {
  // 세 장면을 같은 자리에 포개고, 자동 재생 시간으로 다음 사진의 크기를 정합니다.
  const track = document.querySelector('.hero-scroll-track');
  const hero = track.querySelector('#main-visual');
  await loadHeroSlides(hero);
  const photos = [...hero.querySelectorAll('.visual-img .swiper-slide')];
  const copies = [...hero.querySelectorAll('.visual-text-swiper .swiper-slide')];
  // 화면에 보이는 막대 순서와 사진의 내부 번호를 연결합니다.
  const buttons = [...hero.querySelectorAll('[data-scene]')].sort((a, b) => Number(a.dataset.scene) - Number(b.dataset.scene));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => value * value * (3 - 2 * value);


  function draw(position) {
    const current = Math.floor(position);
    const progress = position - current;
    const next = progress > 0 ? (current + 1) % photos.length : -1;
    const growth = ease(progress);
    const visible = next === -1 ? current : next;
    const incomingOpacity = ease(clamp(progress / .45));
    const outgoingTextOpacity = 1 - ease(clamp(progress / .18));
    // 새 사진과 제목은 전환 첫 프레임부터 같은 확대 진행률을 사용합니다.
    const titleGrowth = reducedMotion.matches ? 1 : growth;

    // 새 사진이 제목과 같은 진행률로 커집니다.
    photos.forEach((photo, index) => {
      const incoming = index === next;
      photo.style.zIndex = incoming ? 2 : 1;
      photo.style.opacity = incoming ? incomingOpacity : Number(index === current);
      photo.style.transform = incoming ? 'scale(' + (.70 + .30 * titleGrowth) + ')' : 'none';
      photo.setAttribute('aria-hidden', String(index !== visible));

      // 새 제목과 사진은 함께 선명해지고, 이전 제목은 먼저 옅어집니다.
      copies[index].style.opacity = incoming ? incomingOpacity : Number(index === current) * outgoingTextOpacity;
      copies[index].style.setProperty('--title-growth', incoming ? titleGrowth : 1);
      copies[index].setAttribute('aria-hidden', String(index !== visible));
      buttons[index].setAttribute('aria-pressed', String(index === visible));
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
  let ready = false;
  let frame = null;
  let heroVisible = true;

  function animate(now) {
    if (previousTime !== null) elapsed += now - previousTime;
    previousTime = now;

    if (elapsed >= dwell + duration) {
      scene = (scene + 1) % photos.length;
      elapsed = 0;
    }
    draw(scene + clamp((elapsed - dwell) / duration));
    frame = requestAnimationFrame(animate);
  }

  function updatePlayback() {
    if (photos.length < 2 || document.hidden || reducedMotion.matches || !heroVisible) {
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
    draw(scene);
  }));
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      elapsed = 0;
      draw(scene);
    }
    updatePlayback();
  });
  draw(scene);
  updatePlayback();
  Promise.all([...hero.querySelectorAll('.visual-img img')].map(image => image.decode().catch(() => {})))
    .then(() => {
      ready = true;
      updatePlayback();
    });

  const careerNumber = track.querySelector('#clinic-intro .count-num');
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

  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === hero) {
        heroVisible = entry.isIntersecting;
        updatePlayback();
      } else if (entry.isIntersecting) {
        startCareerCount();
        sectionObserver.unobserve(careerNumber);
      }
    }
  });

  sectionObserver.observe(hero);
  sectionObserver.observe(careerNumber);
}

startHeroMotion();
