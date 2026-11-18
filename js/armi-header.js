(() => {
  const header = document.querySelector(".armi-header");
  const nav = header.querySelector(".armi-nav");
  const menu = header.querySelector(".armi-mobile-trigger");
  let panels = [...header.querySelectorAll(".armi-nav-trigger")];
  let groups = [...header.querySelectorAll(".armi-group-trigger")];
  const mobile = matchMedia("(max-width: 960px)");

  // 주소가 일치하는 메뉴에만 현재 페이지 또는 현재 구역을 표시합니다.
  function updateCurrentLinks() {
    const current = new URL(window.location.href);
    nav.querySelectorAll("a[href]").forEach(link => {
      const destination = new URL(link.href);
      if (destination.pathname === current.pathname && destination.origin === current.origin &&
          destination.protocol === current.protocol && destination.hash === current.hash) {
        link.setAttribute("aria-current", destination.hash ? "location" : "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }
  updateCurrentLinks();
  window.addEventListener("hashchange", updateCurrentLinks);

  // 카페24 워드프레스에서 주 메뉴·하위 메뉴와 헤더 로고를 관리합니다.
  async function loadManagedMenu() {
    const list = nav.querySelector('.armi-nav-items');
    if (!list) return;
    const request = window.kmSiteLayoutRequest ||= fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_site_layout_data', {credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(15000)}).then(response => {
      if (!response.ok) throw new Error('홈페이지 공통 설정 요청 실패');
      return response.json();
    });
    const data = await request;
    const safeURL = value => {
      try { const url = new URL(value, location.origin + '/'); return ['https:','http:','tel:','mailto:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; } catch { return ''; }
    };
    if (data.layout && typeof data.layout === 'object') {
      const logo = header.querySelector('.kong-header-logo');
      if (logo) {
        const src = safeURL(data.layout.header_logo || '');
        const visible = Boolean(data.layout.header_logo && /^https?:/i.test(src));
        logo.closest('h1').hidden = !visible;
        if (visible) { logo.src = src; logo.alt = data.layout.header_alt || ''; }
        const link = logo.closest('a');
        const home = data.layout.header_home ? safeURL(data.layout.header_home) : '';
        if (home) link.href = home; else link.removeAttribute('href');
      }
    }
    if (data.configured !== true || !Array.isArray(data.menu)) return;
    function anchor(row) {
      const url = safeURL(row.url);
      if (!url || !row.title) return null;
      const link = document.createElement('a');
      link.href = url; link.textContent = row.title;
      if (row.target === '_blank') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      return link;
    }
    function buildRows(rows, depth = 0) {
      const result = document.createDocumentFragment();
      for (const row of rows) {
        const link = anchor(row);
        if (!link) continue;
        const item = document.createElement('li');
        const children = Array.isArray(row.children) ? row.children : [];
        const directFamilyPage = depth === 0 && new URL(link.href).origin === 'https://kongmath.com' &&
          new URL(link.href).pathname === '/family.html';
        const reportChild = depth === 0 && row.title === '내신리포트' ? children.find(child => {try {const u=new URL(child.url);return u.origin==='https://kongmath.com' && u.pathname==='/reports.html';} catch {return false;}}) : null;
        if(reportChild) link.href=reportChild.url;
        if (children.length && depth < 20 && !directFamilyPage && !reportChild) {
          const button = document.createElement('button');
          button.type = 'button'; button.textContent = row.title;
          button.className = depth === 0 ? 'armi-nav-trigger' : 'armi-group-trigger km-nav-nested-toggle';
          const panel = document.createElement('div');
          panel.id = 'km-nav-panel-' + row.id;
          panel.className = depth === 0 ? 'armi-nav-panel' : 'km-nav-nested-panel';
          panel.hidden = true;
          button.setAttribute('aria-controls', panel.id); button.setAttribute('aria-expanded', 'false');
          const links = document.createElement('ul');
          if (row.url !== 'https://kongmath.com/#' && !children.some(child => child.url === row.url)) {
            const parentItem = document.createElement('li'); parentItem.append(link); links.append(parentItem);
          }
          links.append(buildRows(children, depth + 1)); panel.append(links); item.append(button, panel);
        } else item.append(link);
        result.append(item);
      }
      return result;
    }
    const replacement = buildRows(data.menu);
    list.replaceChildren(replacement);
    panels = [...list.querySelectorAll('.armi-nav-trigger')];
    groups = [...list.querySelectorAll('.armi-group-trigger')];
    panels.forEach(button => bindToggle(button, panels));
    groups.forEach(button => bindToggle(button, groups));
    closeMenus(); updateCurrentLinks();
  }
  loadManagedMenu().catch(error => console.warn('WordPress menu:', error));

  // 버튼의 열림 상태와 실제 패널을 한 번에 갱신합니다.
  function setOpen(button, open) {
    button.setAttribute("aria-expanded", String(open));
    document.getElementById(button.getAttribute("aria-controls")).hidden = !open;
  }
  const isOpen = button => button.getAttribute("aria-expanded") === "true";
  function closeMenus() {
    panels.forEach(button => setOpen(button, false));
    groups.forEach(button => setOpen(button, !mobile.matches));
    setOpen(menu, !mobile.matches);
  }
  closeMenus();
  mobile.addEventListener("change", closeMenus);
  window.addEventListener("scroll", closeMenus, { passive: true });

  // 같은 단계에서는 한 번에 한 메뉴만 엽니다.
  function bindToggle(button, buttons) {
    button.addEventListener("click", () => {
      const open = !isOpen(button);
      buttons.filter(item => item.parentElement.parentElement === button.parentElement.parentElement).forEach(item => setOpen(item, item === button && open));
      if (buttons === panels && mobile.matches) groups.forEach(item => setOpen(item, false));
    });
  }
  panels.forEach(button => bindToggle(button, panels));
  groups.forEach(button => bindToggle(button, groups));
  menu.addEventListener("click", () => {
    if (isOpen(menu)) closeMenus();
    else setOpen(menu, true);
  });

  // Esc로 닫은 단계의 버튼에 키보드 포커스를 돌려줍니다.
  header.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const group = mobile.matches && [...groups].reverse().find(button => isOpen(button) && button.parentElement.contains(event.target));
    const button = group || panels.find(isOpen) || (mobile.matches && isOpen(menu) ? menu : null);
    if (!button) return;
    event.preventDefault();
    setOpen(button, false);
    button.focus();
  });
  document.addEventListener("click", event => {
    if (!header.contains(event.target)) closeMenus();
  });
  header.addEventListener("focusout", event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenus();
  });
  // 상단 메뉴의 같은 페이지 링크와 방문 정보 바로가기는 즉시 이동합니다.
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || event.button !== 0) return;

    const inMenu = nav.contains(link);
    if (inMenu) {
      closeMenus();
      return;
    }
    if (!link.getAttribute("href").startsWith("#") || !link.hash) return;
    const visitShortcut = link.hash === "#location" && link.textContent.trim() === "오시는 길";
    const noticeShortcut = link.matches('.notice-body a:is([href="#save-teeth"], [href="#tuition"])');
    if (!inMenu && !visitShortcut && !noticeShortcut) return;

    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== link.hash) {
      history.pushState(null, "", link.hash);
      updateCurrentLinks();
    }
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "instant" });
  });
  // 모바일에서는 전화, 데스크톱에서는 메인 첫 페이지로 이동합니다.
  const floatingChat = document.querySelector(".floating-chat");
  if (floatingChat) {
    const desktopHref = floatingChat.getAttribute("href") || "index.html";
    const mobileHref = floatingChat.dataset.mobileHref || "tel:0519137159";
    const floatingMedia = matchMedia("(max-width: 768px)");
    const updateFloatingChat = () => {
      const isMobile = floatingMedia.matches;
      floatingChat.setAttribute("href", isMobile ? mobileHref : desktopHref);
      floatingChat.setAttribute(
        "aria-label",
        isMobile
          ? (floatingChat.dataset.mobileLabel || "전화 상담하기")
          : (floatingChat.dataset.desktopLabel || "메인 페이지로 이동")
      );
    };
    updateFloatingChat();
    floatingMedia.addEventListener("change", updateFloatingChat);
  }

})();


// 상단 블로그 버튼과 중복 홈 링크 정리. 개별 원문 링크는 유지합니다.
(()=>{
 const header=document.querySelector('.armi-header');if(!header)return;
 const style=document.createElement('style');style.textContent=`
 .armi-header .km-header-blog{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-height:34px;padding:6px 12px;border:1px solid #168349;border-radius:20px;background:#fff;color:#087239;font:600 13px/1.3 pretendard,sans-serif;white-space:nowrap;text-decoration:none}
 .armi-header .km-header-blog:hover{background:#edf9f1}.armi-header .km-header-blog:focus-visible{outline:2px solid #087239;outline-offset:3px}
 @media(min-width:961px){.armi-header .armi-header-row{gap:12px}.armi-header .km-header-blog{margin-left:0}}
 @media(max-width:960px){.armi-header .armi-header-row{gap:6px;padding-inline:10px}.armi-header .inner h1 a img.kong-header-logo{width:100px}.armi-header .km-header-blog{font-size:11px;padding:5px 7px;min-height:32px}.armi-header .armi-header-login{font-size:11px;padding:5px 9px;min-height:32px}.armi-header .armi-mobile-trigger{font-size:12px;padding:6px 8px;min-height:36px}.armi-header .km-header-blog{order:0}}
 `;document.head.append(style);
 const button=document.createElement('a');button.className='km-header-blog';button.href='https://blog.naver.com/tyk999';button.textContent='네이버 블로그';button.target='_blank';button.rel='noopener noreferrer';button.setAttribute('aria-label','네이버 블로그 (새 창)');
 const mobile=header.querySelector('.armi-mobile-trigger');if(mobile)mobile.before(button);else header.querySelector('.armi-header-row')?.append(button);
 const isGeneralBlog=raw=>{try{const u=new URL(raw,location.href);if(!['blog.naver.com','m.blog.naver.com'].includes(u.hostname))return false;return /^\/tyk999\/?$/.test(u.pathname)||(/^\/(PostList\.naver|)$/.test(u.pathname)&&u.searchParams.get('blogId')==='tyk999');}catch{return false;}};
 const clean=()=>{for(const link of document.querySelectorAll('a[href]')){if(link===button||!isGeneralBlog(link.href))continue;const parent=link.parentElement;if(parent?.tagName==='LI'&&parent.children.length===1)parent.remove();else{link.remove();if(parent?.tagName==='P'&&!parent.textContent.trim()&&!parent.children.length)parent.remove();}}};
 clean();new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length))clean();}).observe(document.body,{childList:true,subtree:true});
})();
