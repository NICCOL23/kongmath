(()=>{'use strict';
 if(window.kmCompactBoards)return;window.kmCompactBoards=true;
 const main=document.querySelector('main[data-km-board],#academy-daily');if(!main)return;
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='https://kongmath.com/css/board-compact.css?v=1.31.4';document.head.append(sheet);
 function wrap(card,kind){
  if(card.dataset.kmCompact)return;card.dataset.kmCompact='1';
  const title=kind==='family'?card.querySelector(':scope>h4'):card.querySelector('.review-card__content');if(!title)return;
  const detail=document.createElement('details');detail.className='km-compact-post';
  const summary=document.createElement('summary'),heading=document.createElement('span'),meta=document.createElement('span');
  heading.className='km-compact-title';heading.textContent=kind==='review'&&card.dataset.reviewTitle?card.dataset.reviewTitle:title.textContent.trim();meta.className='km-compact-meta';
  if(kind==='family'){
   const top=card.querySelector('.story-top');
   for(const selector of ['h3','.meta']){const node=top?.querySelector(selector);const text=selector==='h3'&&node?[...node.childNodes].map(x=>x.textContent.trim()).filter(Boolean).join(' · '):node?.textContent.trim();if(text){const span=document.createElement('span');span.textContent=text;meta.append(span);}}
   const count=card.querySelectorAll(':scope>.reply').length;const comments=document.createElement('span');comments.textContent='댓글 '+count;meta.append(comments);
  }else for(const selector of ['.review-card__meta','.review-card__author','.review-card__date']){const node=card.querySelector(selector);if(node)meta.append(node);}
  summary.append(heading,meta);const body=document.createElement('div');body.className='km-compact-content';
  while(card.firstChild)body.append(card.firstChild);detail.append(summary,body);card.append(detail);
 }
 function scan(){main.querySelectorAll('.story:not([data-km-compact])').forEach(card=>wrap(card,'family'));main.querySelectorAll('.review-card:not([data-km-compact])').forEach(card=>wrap(card,'review'));}
 scan();new MutationObserver(scan).observe(main,{childList:true,subtree:true});
 const close=()=>main.querySelectorAll('details[open]').forEach(item=>item.open=false);
 main.addEventListener('toggle',event=>{const current=event.target;if(!(current instanceof HTMLDetailsElement)||!current.open)return;main.querySelectorAll('details[open]').forEach(item=>{if(item!==current&&!item.contains(current)&&!current.contains(item))item.open=false;});},true);
 main.addEventListener('submit',event=>{if(event.target.matches('#review-search,#search')||event.target.querySelector('input[type=search]'))close();});
 window.addEventListener('pagehide',close);window.addEventListener('pageshow',event=>{if(event.persisted)close();});
})();

(()=>{'use strict';
 if(window.kmDailyNoticeClose)return;
 const daily=document.querySelector('#academy-daily #post-list');
 const notice=document.querySelector('main[data-km-board] .notice-body');
 const root=daily||(notice&&notice.closest('main'));
 if(!root)return;window.kmDailyNoticeClose=true;
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='https://kongmath.com/css/exam-report-close.css?v=1';document.head.append(sheet);
 let serial=0;
 function scan(){root.querySelectorAll('details').forEach(details=>{
  const body=details.querySelector(daily?':scope > .post-body':':scope > .notice-body');
  const summary=details.querySelector(':scope > summary');
  if(!body||!summary||body.querySelector(':scope > .km-post-close-actions'))return;
  if(!details.id)details.id='km-notice-close-'+(++serial);
  const actions=document.createElement('div');actions.className='exam-report-actions km-post-close-actions';
  const button=document.createElement('button');button.type='button';button.className='exam-report-close';button.style.color='#fff';button.textContent='글 접고 목록으로 ↑';button.setAttribute('aria-controls',details.id);
  button.addEventListener('click',()=>{details.open=false;summary.focus({preventScroll:true});const headerBottom=Math.max(0,document.querySelector('header')?.getBoundingClientRect().bottom||0);const top=summary.getBoundingClientRect().top+window.scrollY-headerBottom-16;window.scrollTo({top:Math.max(0,top),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
  actions.append(button);body.append(actions);
 });}
 scan();new MutationObserver(scan).observe(root,{childList:true,subtree:true});
})();

(()=>{'use strict';
 if(window.kmDailyNoticeViewer)return;
 const daily=document.querySelector('#academy-daily #post-list');
 const notice=document.querySelector('main[data-km-board] .notice-body');
 const list=daily||(notice&&notice.closest('main'));if(!list)return;window.kmDailyNoticeViewer=true;
 const css=document.createElement('link');css.rel='stylesheet';css.href='https://kongmath.com/css/report-image-viewer.css?v=1';document.head.append(css);
 const imageSelector=daily?'.post-body img':'.notice-body img';
 let viewer,photo,stage,label,minus,plus,reset,origin,scale=1,previousOverflow='';
 const isAnalysis=image=>{try{const u=new URL(image.currentSrc||image.src);return /^https?:$/.test(u.protocol)&&!image.classList.contains('report-sticker')&&!/sticker|ogq_|staticmap/i.test(u.pathname)&&!/(^|\.)(storep-phinf|simg)\.pstatic\.net$/i.test(u.hostname);}catch{return false;}};
 function resize(){if(!photo?.naturalWidth)return;const fit=Math.min(photo.naturalWidth,Math.max(1,stage.clientWidth-32));photo.style.width=Math.round(fit*scale)+'px';label.textContent=Math.round(scale*100)+'%';minus.disabled=scale<=1;plus.disabled=scale>=4;reset.disabled=scale===1;}
 function build(){viewer=document.createElement('dialog');viewer.className='km-report-viewer';viewer.setAttribute('aria-label','게시판 사진 확대');
 const toolbar=document.createElement('div');toolbar.className='km-report-viewer__toolbar';const title=document.createElement('strong');title.textContent='사진';const controls=document.createElement('div');controls.className='km-report-viewer__controls';
 const button=(text,name,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',name);b.addEventListener('click',fn);return b;};
 minus=button('−','사진 축소',()=>{scale=Math.max(1,scale-.5);resize();});plus=button('+','사진 확대',()=>{scale=Math.min(4,scale+.5);resize();});reset=button('맞춤','화면에 맞추기',()=>{scale=1;resize();stage.scrollTo(0,0);});label=document.createElement('span');label.setAttribute('aria-live','polite');const close=button('닫기 ×','확대 사진 닫기',()=>viewer.close());controls.append(minus,label,plus,reset,close);toolbar.append(title,controls);
 stage=document.createElement('div');stage.className='km-report-viewer__stage';stage.tabIndex=0;stage.setAttribute('aria-label','확대한 사진. 확대 후 상하좌우로 이동할 수 있습니다.');photo=document.createElement('img');photo.alt='게시판 사진';photo.referrerPolicy='no-referrer';photo.addEventListener('load',resize);stage.append(photo);viewer.append(toolbar,stage);document.body.append(viewer);
 viewer.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;photo.removeAttribute('src');origin?.isConnected&&origin.focus({preventScroll:true});});window.addEventListener('resize',()=>{if(viewer.open)resize();});}
 function open(image){if(!viewer)build();origin=image.closest('a')||image;scale=1;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';photo.alt=image.alt||'게시판 사진';photo.src=image.currentSrc||image.src;viewer.showModal();resize();stage.scrollTo(0,0);}
 function decorate(){list.querySelectorAll(imageSelector).forEach(image=>{if(!isAnalysis(image)||image.dataset.kmBoardZoom)return;image.dataset.kmBoardZoom='1';image.classList.add('km-report-zoomable');const trigger=image.closest('a')||image;trigger.setAttribute('role','button');trigger.setAttribute('tabindex','0');trigger.setAttribute('aria-label',(image.alt||'사진')+' 크게 보기');trigger.setAttribute('aria-haspopup','dialog');});}
 list.addEventListener('click',event=>{const image=event.target.closest('img[data-km-board-zoom]');if(!image)return;event.preventDefault();open(image);});
 list.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const trigger=event.target.closest('[aria-haspopup="dialog"]');const image=trigger?.matches('img')?trigger:trigger?.querySelector('img[data-km-board-zoom]');if(!image)return;event.preventDefault();open(image);});
 decorate();new MutationObserver(decorate).observe(list,{childList:true,subtree:true});
})();

(()=>{'use strict';
 if(window.kmFamilyReviewViewer)return;
 const list=document.querySelector('main[data-km-board]');if(!list||(!list.querySelector('.story-list')&&!list.querySelector('#review-results,#review-list,[data-review-list],.review-list,.review-card')))return;window.kmFamilyReviewViewer=true;
 const css=document.createElement('link');css.rel='stylesheet';css.href='https://kongmath.com/css/report-image-viewer.css?v=1';document.head.append(css);
 const imageSelector='.story-body img,.uploaded-photos img,.story .reply img,.review-card__content img,.review-body img,.review img';
 let viewer,photo,stage,label,minus,plus,reset,origin,scale=1,previousOverflow='';
 const isAnalysis=image=>{try{const u=new URL(image.currentSrc||image.src);return /^https?:$/.test(u.protocol)&&!image.classList.contains('report-sticker')&&!/sticker|ogq_|staticmap/i.test(u.pathname)&&!/(^|\.)(storep-phinf|simg)\.pstatic\.net$/i.test(u.hostname);}catch{return false;}};
 function resize(){if(!photo?.naturalWidth)return;const fit=Math.min(photo.naturalWidth,Math.max(1,stage.clientWidth-32));photo.style.width=Math.round(fit*scale)+'px';label.textContent=Math.round(scale*100)+'%';minus.disabled=scale<=1;plus.disabled=scale>=4;reset.disabled=scale===1;}
 function build(){viewer=document.createElement('dialog');viewer.className='km-report-viewer';viewer.setAttribute('aria-label','게시판 사진 확대');
 const toolbar=document.createElement('div');toolbar.className='km-report-viewer__toolbar';const title=document.createElement('strong');title.textContent='사진';const controls=document.createElement('div');controls.className='km-report-viewer__controls';
 const button=(text,name,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',name);b.addEventListener('click',fn);return b;};
 minus=button('−','사진 축소',()=>{scale=Math.max(1,scale-.5);resize();});plus=button('+','사진 확대',()=>{scale=Math.min(4,scale+.5);resize();});reset=button('맞춤','화면에 맞추기',()=>{scale=1;resize();stage.scrollTo(0,0);});label=document.createElement('span');label.setAttribute('aria-live','polite');const close=button('닫기 ×','확대 사진 닫기',()=>viewer.close());controls.append(minus,label,plus,reset,close);toolbar.append(title,controls);
 stage=document.createElement('div');stage.className='km-report-viewer__stage';stage.tabIndex=0;stage.setAttribute('aria-label','확대한 사진. 확대 후 상하좌우로 이동할 수 있습니다.');photo=document.createElement('img');photo.alt='게시판 사진';photo.referrerPolicy='no-referrer';photo.addEventListener('load',resize);stage.append(photo);viewer.append(toolbar,stage);document.body.append(viewer);
 viewer.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;photo.removeAttribute('src');origin?.isConnected&&origin.focus({preventScroll:true});});window.addEventListener('resize',()=>{if(viewer.open)resize();});}
 function open(image){if(!viewer)build();origin=image.closest('a')||image;scale=1;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';photo.alt=image.alt||'게시판 사진';const link=image.closest('a');let source=image.currentSrc||image.src;try{if(image.closest('.uploaded-photos')&&link&&/^https?:$/.test(new URL(link.href).protocol))source=link.href;}catch{}photo.src=source;viewer.showModal();resize();stage.scrollTo(0,0);}
 function decorate(){list.querySelectorAll(imageSelector).forEach(image=>{if(!isAnalysis(image)||image.dataset.kmBoardZoom)return;image.dataset.kmBoardZoom='1';image.classList.add('km-report-zoomable');const trigger=image.closest('a')||image;trigger.setAttribute('role','button');trigger.setAttribute('tabindex','0');trigger.setAttribute('aria-label',(image.alt||'사진')+' 크게 보기');trigger.setAttribute('aria-haspopup','dialog');});}
 list.addEventListener('click',event=>{const image=event.target.closest('img[data-km-board-zoom]');if(!image)return;event.preventDefault();open(image);});
 list.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const trigger=event.target.closest('[aria-haspopup="dialog"]');const image=trigger?.matches('img')?trigger:trigger?.querySelector('img[data-km-board-zoom]');if(!image)return;event.preventDefault();open(image);});
 decorate();new MutationObserver(decorate).observe(list,{childList:true,subtree:true});
})();

(()=>{if(window.kmSiteImageViewer||document.querySelector('script[data-km-site-viewer]'))return;const s=document.createElement('script');s.src='https://kongmath.com/js/site-image-viewer.js?v=1';s.dataset.kmSiteViewer='1';s.defer=true;document.body.append(s);})();
