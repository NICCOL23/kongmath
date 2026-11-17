(() => {
  const header = document.querySelector(".armi-header");
  const nav = header.querySelector(".armi-nav");
  const menu = header.querySelector(".armi-mobile-trigger");
  const panels = [...header.querySelectorAll(".armi-nav-trigger")];
  const groups = [...header.querySelectorAll(".armi-group-trigger")];
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

  // WordPress page 1042 contains the links managed by the academy.
  async function loadManagedMenu() {
    const list = nav.querySelector(".armi-nav-items");
    if (!list) return;

    const endpoint = "https://public-api.wordpress.com/wp/v2/sites/kongmathtest.wordpress.com/pages/1042?_fields=id,status,content";
    const response = await fetch(endpoint, { credentials: "omit" });
    if (!response.ok) return;
    const page = await response.json();
    if (page.id !== 1042 || page.status !== "publish" || !page.content?.rendered) return;

    const source = new DOMParser().parseFromString(page.content.rendered, "text/html");
    const entries = document.createDocumentFragment();
    const names = new Set([...list.children].map(item =>
      item.querySelector(":scope > a, :scope > button")?.textContent.trim()));
    for (const link of source.querySelectorAll("li > a[href]")) {
      const label = link.textContent.trim();
      const href = link.getAttribute("href").trim();
      let destination;
      try {
        destination = new URL(href, location.origin + "/");
      } catch {
        continue;
      }
      if (!label || !href || names.has(label) || destination.protocol !== "https:" ||
          destination.username || destination.password) continue;

      const item = document.createElement("li");
      const menuLink = document.createElement("a");
      menuLink.href = destination.href;
      menuLink.textContent = label;
      item.append(menuLink);
      entries.append(item);
      names.add(label);
    }
    list.append(entries);
    updateCurrentLinks();
  }
  loadManagedMenu().catch(error => console.warn("WordPress menu:", error));

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
  for (const buttons of [panels, groups]) {
    buttons.forEach(button => button.addEventListener("click", () => {
      const open = !isOpen(button);
      buttons.forEach(item => setOpen(item, item === button && open));
      if (buttons === panels && mobile.matches) groups.forEach(item => setOpen(item, false));
    }));
  }
  menu.addEventListener("click", () => {
    if (isOpen(menu)) closeMenus();
    else setOpen(menu, true);
  });

  // Esc로 닫은 단계의 버튼에 키보드 포커스를 돌려줍니다.
  header.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const group = mobile.matches && groups.find(button => isOpen(button) && button.parentElement.contains(event.target));
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
