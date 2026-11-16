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
})();
