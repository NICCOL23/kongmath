(() => {
  const list = document.querySelector('#academy-daily-posts');
  const status = document.querySelector('#academy-daily-status');
  const retry = document.querySelector('#academy-daily-retry');
  let requestNumber = 0;
  function openLinkedDailyPost() {
    const post = document.getElementById(location.hash.slice(1));
    if (!post?.matches('details.exam-report')) return;
    post.open = true;
    post.scrollIntoView({ block: 'start' });
  }
  function renderPost(post) {
    const item = document.createElement('li');
    const details = document.createElement('details');
    details.className = 'exam-report';
    details.id = post.id;
    const summary = document.createElement('summary');
    const title = document.createElement('span');
    title.textContent = post.title;
    const time = document.createElement('time');
    time.dateTime = post.datetime;
    time.textContent = post.date;
    summary.append(title, time);
    const body = document.createElement('div');
    body.className = 'exam-report-body';
    // 공개 발행 글만 서버에서 wp_kses_post로 정제해 제공합니다.
    body.innerHTML = post.body;
    details.append(summary, body);
    item.append(details);
    return item;
  }
  async function loadPosts() {
    const request = ++requestNumber;
    list.replaceChildren();
    list.setAttribute('aria-busy', 'true');
    status.textContent = '일상 글을 불러오는 중입니다.';
    retry.hidden = true;
    try {
      const response = await fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_daily_data', {
        credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('일상 목록 요청 실패');
      const data = await response.json();
      if (!Array.isArray(data.posts) || !Number.isInteger(data.total)) throw new Error('일상 목록 형식 오류');
      if (request !== requestNumber) return;
      list.replaceChildren(...data.posts.map(renderPost));
      status.textContent = data.total ? '' : '등록된 일상 글이 없습니다.';
      openLinkedDailyPost();
    } catch {
      if (request !== requestNumber) return;
      status.textContent = '일상 글을 불러오지 못했습니다. 다시 불러오기를 눌러 주세요.';
      retry.hidden = false;
    } finally {
      if (request === requestNumber) list.setAttribute('aria-busy', 'false');
    }
  }
  retry.addEventListener('click', loadPosts);
  window.addEventListener('hashchange', openLinkedDailyPost);
  window.addEventListener('pageshow', event => { if (event.persisted) loadPosts(); });
  loadPosts();
})();
