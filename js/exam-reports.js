(() => {
  const form = document.querySelector('#exam-report-search');
  const list = document.querySelector('#exam-report-results');
  const status = document.querySelector('#exam-report-status');
  const paging = document.querySelector('#exam-report-paging');
  const retry = document.querySelector('#exam-report-retry');
  const schoolSelect = document.querySelector('#report-school');
  const schoolOptions = document.querySelector('#report-school-options');
  const schoolToggle = document.querySelector('#report-school-toggle');
  let schools = [];
  let activeSchool = -1;
  let filterSchools = false;
  function chooseSchool(value) {
    const direct = value === '__direct';
    schoolSelect.value = direct ? '' : value;
    schoolSelect.placeholder = direct ? '학교명 직접 입력' : '전체 학교';
    closeSchools();
    schoolSelect.focus();
  }
  function closeSchools() {
    schoolOptions.hidden = true;
    schoolSelect.setAttribute('aria-expanded', 'false');
    schoolToggle.setAttribute('aria-expanded', 'false');
    schoolToggle.setAttribute('aria-label', '학교 목록 열기');
    schoolSelect.removeAttribute('aria-activedescendant');
    activeSchool = -1;
  }
  function showSchools(filter = false) {
    filterSchools = filter;
    const query = filter ? schoolSelect.value.trim().toLocaleLowerCase() : '';
    const matches = schools.filter(name => name.toLocaleLowerCase().includes(query));
    schoolOptions.replaceChildren();
    const values = query ? matches.slice(0, 50) : ['', ...matches.slice(0, 50)];
    for (const [index, name] of values.entries()) {
      const option = document.createElement('li');
      option.id = 'school-option-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.dataset.value = name;
      option.textContent = name || '전체 학교';
      option.addEventListener('mousedown', event => event.preventDefault());
      option.addEventListener('click', () => {
        chooseSchool(name);
      });
      schoolOptions.append(option);
    }
    if (!matches.length || matches.length > 50) {
      const hint = document.createElement('li');
      hint.setAttribute('role', 'presentation');
      hint.className = 'school-options-hint';
      hint.textContent = matches.length > 50 ? '앞 50개 표시 · 학교명을 더 입력하세요.' : '일치하는 학교 없음 · 직접 입력해 검색하세요.';
      schoolOptions.append(hint);
    }
    const directOption = document.createElement('li');
    directOption.id = 'school-option-direct';
    directOption.setAttribute('role', 'option');
    directOption.setAttribute('aria-selected', 'false');
    directOption.dataset.value = '__direct';
    directOption.textContent = '직접 입력';
    directOption.addEventListener('mousedown', event => event.preventDefault());
    directOption.addEventListener('click', () => chooseSchool('__direct'));
    schoolOptions.append(directOption);
    activeSchool = -1;
    schoolSelect.removeAttribute('aria-activedescendant');
    schoolOptions.hidden = false;
    schoolSelect.setAttribute('aria-expanded', 'true');
    schoolToggle.setAttribute('aria-expanded', 'true');
    schoolToggle.setAttribute('aria-label', '학교 목록 닫기');
  }
  schoolToggle.addEventListener('click', () => {
    if (schoolOptions.hidden) { schoolSelect.focus(); showSchools(); }
    else closeSchools();
  });
  schoolSelect.addEventListener('click', () => showSchools(false));
  schoolSelect.addEventListener('input', () => showSchools(true));
  schoolSelect.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') { closeSchools(); return; }
    if (event.key === 'Tab') { closeSchools(); return; }
    if (event.key === 'Enter' && !schoolOptions.hidden && activeSchool >= 0) {
      event.preventDefault();
      chooseSchool(schoolOptions.querySelectorAll('[role="option"]')[activeSchool].dataset.value);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (schoolOptions.hidden) showSchools();
    const options = [...schoolOptions.querySelectorAll('[role="option"]')];
    if (!options.length) return;
    activeSchool = activeSchool < 0 ? (event.key === 'ArrowDown' ? 0 : options.length - 1)
      : (activeSchool + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    options.forEach((option, index) => option.setAttribute('aria-selected', String(index === activeSchool)));
    schoolSelect.setAttribute('aria-activedescendant', options[activeSchool].id);
    options[activeSchool].scrollIntoView({ block: 'nearest' });
  });
  document.addEventListener('click', event => {
    if (!schoolSelect.closest('.school-combobox').contains(event.target)) closeSchools();
  });
  document.addEventListener('focusin', event => {
    if (!schoolSelect.closest('.school-combobox').contains(event.target)) closeSchools();
  });
  const keywordChoice = document.querySelector('#report-keyword-choice');
  const keywordInput = document.querySelector('#report-keyword');
  const endpoint = 'https://kongmath.mycafe24.com/wp-admin/admin-post.php';
  let requestNumber = 0;
  let currentPage = 1;

  function searchParams() {
    const params = new URLSearchParams(new FormData(form));
    params.set('school', schoolSelect.value.trim());
    return params;
  }

  keywordChoice.addEventListener('change', () => {
    keywordInput.value = keywordChoice.value === '__direct' ? '' : keywordChoice.value;
    if (keywordChoice.value === '__direct') keywordInput.focus();
  });
  keywordInput.addEventListener('input', () => {
    const predefined = [...keywordChoice.options].some(option => option.value === keywordInput.value);
    keywordChoice.value = predefined ? keywordInput.value : '__direct';
  });

  function openLinkedReport() {
    const details = document.getElementById(location.hash.slice(1));
    if (!details?.matches('details.exam-report')) return false;
    details.open = true;
    details.scrollIntoView({ block: 'start' });
    return true;
  }

  function renderReport(report) {
    const item = document.createElement('li');
    const details = document.createElement('details');
    details.className = 'exam-report';
    details.id = report.id;
    const summary = document.createElement('summary');
    const title = document.createElement('span');
    title.textContent = report.title;
    const time = document.createElement('time');
    time.dateTime = report.datetime;
    time.textContent = report.date;
    summary.append(title, time);
    const body = document.createElement('div');
    body.className = 'exam-report-body';
    // 서버는 공개 발행 글만 조회하고 WordPress의 wp_kses_post로 본문을 정제합니다.
    body.innerHTML = report.body;
    if (report.blog && /^https?:\/\//.test(report.blog) &&
        ![...body.querySelectorAll('a')].some(link => link.href === report.blog)) {
      const paragraph = document.createElement('p');
      const link = document.createElement('a');
      link.href = report.blog;
      link.textContent = '네이버 블로그에서도 보기 ↗';
      link.target = '_blank';
      link.rel = 'noopener';
      paragraph.append(link);
      body.append(paragraph);
    }
    details.append(summary, body);
    item.append(details);
    return item;
  }

  function renderPaging(page, pages) {
    paging.replaceChildren();
    if (pages < 2) return;
    for (const [label, destination] of [['이전', page - 1], ['다음', page + 1]]) {
      if (destination < 1 || destination > pages) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        loadReports(destination);
        form.scrollIntoView({ block: 'start' });
      });
      paging.append(button);
    }
  }

  async function loadReports(page = 1, findAnchor = false) {
    const thisRequest = ++requestNumber;
    currentPage = page;
    const params = searchParams();
    params.set('action', 'km_exam_reports_data');
    params.set('report_page', page);
    if (findAnchor && /^#report-(?:wp-)?\d+$/.test(location.hash)) {
      params.set('anchor', location.hash.slice(1));
    }
    status.textContent = '분석 글을 불러오는 중입니다.';
    list.replaceChildren();
    paging.replaceChildren();
    retry.hidden = true;
    list.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(endpoint + '?' + params, {
        credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('분석 목록 요청 실패');
      const data = await response.json();
      if (!Array.isArray(data.reports) || !Number.isInteger(data.total)) {
        throw new Error('분석 목록 형식 오류');
      }
      if (thisRequest !== requestNumber) return;
      if (data.intro && typeof data.intro === 'object') {
        const intro = data.intro;
        const title = document.querySelector('#exam-reports-title');
        const area = title.closest('.treatment-title');
        const description = area.querySelector('p');
        const linkRow = area.querySelectorAll('p')[1];
        const link = linkRow?.querySelector('a');
        title.replaceChildren(document.createTextNode(intro.heading || ''));
        if (intro.accent) {
          const accent = document.createElement('span');
          accent.textContent = intro.accent;
          title.append(document.createTextNode(intro.heading ? ' ' : ''), accent);
        }
        title.hidden = !intro.heading && !intro.accent;
        const section = title.closest('section');
        if (title.hidden) { section.removeAttribute('aria-labelledby'); section.setAttribute('aria-label', '학교별 시험 분석'); }
        else { section.setAttribute('aria-labelledby', title.id); section.removeAttribute('aria-label'); }
        description.textContent = intro.description || '';
        description.hidden = !intro.description;
        if (linkRow && link) {
          link.textContent = intro.link_text || '';
          const validLink = typeof intro.link_url === 'string' && /^https?:\/\//i.test(intro.link_url);
          linkRow.hidden = !intro.link_text || !validLink;
          link.href = validLink ? intro.link_url : '#';
        }
      }
      if (Array.isArray(data.schools)) {
        schools = data.schools.filter(name => typeof name === 'string');
        if (!schoolOptions.hidden) showSchools(filterSchools);
      }
      list.replaceChildren(...data.reports.map(renderReport));
      status.textContent = data.total ? '전체 ' + data.total + '건' : '조건에 맞는 분석 글이 없습니다.';
      renderPaging(data.page, data.pages);
      openLinkedReport();
    } catch {
      if (thisRequest !== requestNumber) return;
      status.textContent = '분석 글을 불러오지 못했습니다. 다시 불러오기를 눌러 주세요.';
      retry.hidden = false;
    } finally {
      if (thisRequest === requestNumber) list.setAttribute('aria-busy', 'false');
    }
  }

  const initialParams = new URLSearchParams(location.search);

  for (const element of form.elements) {
    if (element.name && initialParams.has(element.name)) element.value = initialParams.get(element.name);
  }
  keywordChoice.value = [...keywordChoice.options].some(option => option.value === keywordInput.value)
    ? keywordInput.value : '__direct';

  form.addEventListener('submit', event => {
    event.preventDefault();
    closeSchools();
    const params = searchParams();
    for (const [key, value] of [...params]) if (!value) params.delete(key);
    history.replaceState(null, '', location.pathname + (params.size ? '?' + params : ''));
    loadReports();
  });
  form.addEventListener('reset', () => {
    closeSchools();
    history.replaceState(null, '', location.pathname);
    requestAnimationFrame(() => {
      schoolSelect.value = '';
      schoolSelect.placeholder = '전체 학교';

      loadReports();
    });
  });
  retry.addEventListener('click', () => loadReports(currentPage, Boolean(location.hash)));
  window.addEventListener('hashchange', () => {
    if (!openLinkedReport()) loadReports(1, true);
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) loadReports(currentPage, Boolean(location.hash));
  });
  loadReports(1, Boolean(location.hash));
})();
