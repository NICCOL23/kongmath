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
