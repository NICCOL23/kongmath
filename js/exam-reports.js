(() => {
  const form = document.querySelector('#exam-report-search');
  const list = document.querySelector('#exam-report-results');
  const status = document.querySelector('#exam-report-status');
  const paging = document.querySelector('#exam-report-paging');
  const retry = document.querySelector('#exam-report-retry');
  const schoolSelect = document.querySelector('#report-school');
  const schoolOptions = document.querySelector('#report-school-options');
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
      if (Array.isArray(data.schools)) {
        schoolOptions.replaceChildren(...data.schools.filter(name => typeof name === 'string').map(name => new Option(name, name)));
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
    const params = searchParams();
    for (const [key, value] of [...params]) if (!value) params.delete(key);
    history.replaceState(null, '', location.pathname + (params.size ? '?' + params : ''));
    loadReports();
  });
  form.addEventListener('reset', () => {
    history.replaceState(null, '', location.pathname);
    requestAnimationFrame(() => {

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
