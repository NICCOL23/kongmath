(() => {
  const list = document.querySelector('#treatment .exam-report-list');
  if (!list) return;
  let sequence = 0;
  let controller;

  function message(text, retry = false) {
    const row = document.createElement('li');
    row.className = 'exam-report';
    const label = document.createElement('p');
    label.textContent = text;
    label.setAttribute('role', 'status');
    row.append(label);
    if (retry) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '다시 불러오기';
      button.addEventListener('click', loadLatest);
      row.append(button);
    }
    list.replaceChildren(row);
  }

  async function loadLatest() {
    const current = ++sequence;
    controller?.abort();
    const requestController = new AbortController();
    controller = requestController;
    const timeout = setTimeout(() => requestController.abort(), 15000);
    list.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_exam_reports_data', {
        credentials: 'omit', cache: 'no-store', signal: requestController.signal
      });
      if (!response.ok) throw new Error('목록 연결 실패');
      const data = await response.json();
      if (!Array.isArray(data.reports)) throw new Error('목록 형식 오류');
      if (current !== sequence) return;
      const reports = data.reports.slice(0, 3);
      if (reports.some(report => !/^report-(?:wp-)?\d+$/.test(report.id) || typeof report.title !== 'string')) {
        throw new Error('분석 글 형식 오류');
      }
      const rows = reports.map(report => {
        const row = document.createElement('li');
        row.className = 'exam-report';
        const link = document.createElement('a');
        link.className = 'report-preview-link';link.dataset.kmReaderTrigger='1';
        link.href = 'reports.html?year=#' + report.id;
        const title = document.createElement('span');
        title.textContent = report.title;
        const date = document.createElement('time');
        date.textContent = report.date || '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(report.datetime)) date.dateTime = report.datetime;
        link.append(title, date);
        const template=document.createElement('template');template.dataset.kmReaderTemplate='1';template.innerHTML=report.body;row.append(link,template);
        return row;
      });
      if (rows.length) list.replaceChildren(...rows);
      else message('아직 공개된 내신리포트가 없습니다.');
    } catch (error) {
      if (current === sequence) message('최신 글을 불러오지 못했습니다. 전체 보기에서 확인하거나 다시 불러와 주세요.', true);
    } finally {
      clearTimeout(timeout);
      if (current === sequence) list.setAttribute('aria-busy', 'false');
    }
  }

  message('최신 내신리포트를 불러오는 중입니다.');
  loadLatest();
  window.addEventListener('pageshow', event => { if (event.persisted) loadLatest(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loadLatest(); });
  setInterval(() => { if (!document.hidden) loadLatest(); }, 60000);
})();
