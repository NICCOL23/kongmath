(()=>{'use strict';
 if(window.kmCompactBoards)return;window.kmCompactBoards=true;
 const main=document.querySelector('main[data-km-board],#academy-daily');if(!main)return;
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='https://kongmath.com/css/board-compact.css?v=1.31.2';document.head.append(sheet);
 function wrap(card,kind){
  if(card.dataset.kmCompact)return;card.dataset.kmCompact='1';
  const title=kind==='family'?card.querySelector(':scope>h4'):card.querySelector('.review-card__content');if(!title)return;
  const detail=document.createElement('details');detail.className='km-compact-post';
  const summary=document.createElement('summary'),heading=document.createElement('span'),meta=document.createElement('span');
  heading.className='km-compact-title';heading.textContent=title.textContent.trim();meta.className='km-compact-meta';
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
