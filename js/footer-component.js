(() => {
  const footerHost = document.querySelector('[data-site-footer]');

  if (!footerHost) {
    return;
  }

  footerHost.innerHTML = `
    <footer class="footer" id="site-footer">
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-text">
            <h2>학생이 막히는 지점부터 함께 풀어갑니다.</h2>
            <p>1:1 맞춤 수업과 학교별 내신 대비를 안내합니다.</p>
          </div>
          <div class="footer-actions">
            <a class="reserve-btn" href="consultation.html">수업 상담 안내 <span class="footer-blog-arrow" aria-hidden="true"></span></a>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-logo">
            <img class="kong-footer-logo" src="imges/common/kong-math-navy-gold-wordmark.png" width="1695" height="397" alt="공쌤 수학원 KONG MATH">
          </div>

          <div class="footer-info">
            <p class="footer-address">부산 부산진구 신천대로 192, 3·4층</p>
            <p><a class="footer-phone" href="tel:0519137159">전화 051-913-7159</a></p>
          </div>

          <div class="footer-blog">
            <a href="https://blog.naver.com/tyk999">네이버 블로그 <span class="footer-blog-arrow" aria-hidden="true"></span></a>
          </div>
        </div>

        <p class="copyright">
          © 공쌤수학원. ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  `;

  async function applyManagedFooter() {
    const request = window.kmSiteLayoutRequest ||= fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_site_layout_data', {credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(15000)}).then(response => {
      if (!response.ok) throw new Error('홈페이지 공통 설정 요청 실패');
      return response.json();
    });
    const data = await request;
    if (!data.layout || typeof data.layout !== 'object') return;
    const value = data.layout;
    const safeURL = (raw, image = false) => {
      if (!raw) return '';
      try { const url = new URL(raw, location.origin + '/'); return (image ? ['http:','https:'] : ['http:','https:','tel:','mailto:']).includes(url.protocol) && !url.username && !url.password ? url.href : ''; } catch { return ''; }
    };
    function text(selector, content) {
      const node = footerHost.querySelector(selector);
      node.textContent = content || ''; node.hidden = !content;
    }
    text('.footer-text h2', value.footer_heading);
    text('.footer-text p', value.footer_description);
    text('.footer-address', value.footer_address);
    text('.copyright', value.footer_copyright);
    function action(selector, label, raw, arrow) {
      const link = footerHost.querySelector(selector);
      const url = safeURL(raw);
      link.textContent = label || '';
      link.hidden = !label || !url;
      link.style.display = link.hidden ? 'none' : '';
      if (!link.hidden) {
        link.href = url;
        if (arrow) { const icon=document.createElement('span');icon.className='footer-blog-arrow';icon.setAttribute('aria-hidden','true');link.append(document.createTextNode(' '),icon); }
      }
    }
    action('.reserve-btn', value.footer_cta_text, value.footer_cta_url, true);
    action('.footer-phone', value.footer_phone_text, value.footer_phone_url, false);
    const logo = footerHost.querySelector('.kong-footer-logo');
    const src = safeURL(value.footer_logo, true);
    logo.parentElement.hidden = !src;
    logo.parentElement.style.display = src ? '' : 'none';
    if (src) { logo.src=src;logo.alt=value.footer_alt || ''; }
    if (data.configured === true && Array.isArray(data.footer_menu)) {
      const target=footerHost.querySelector('.footer-blog');target.replaceChildren();
      function addLinks(rows) {
        for (const row of rows) {
          const url=safeURL(row.url);
          if(url && row.title) {
            const link=document.createElement('a');link.href=url;link.textContent=row.title;
            if(row.target==='_blank'){link.target='_blank';link.rel='noopener noreferrer';}
            const icon=document.createElement('span');icon.className='footer-blog-arrow';icon.setAttribute('aria-hidden','true');link.append(document.createTextNode(' '),icon);
            if(target.childElementCount)target.append(document.createElement('br'));
            target.append(link);
          }
          if(Array.isArray(row.children))addLinks(row.children);
        }
      }
      addLinks(data.footer_menu);target.hidden=!target.childElementCount;target.style.display=target.hidden?'none':'';
    }
  }
  applyManagedFooter().catch(error => console.warn('WordPress footer:', error));
})();
