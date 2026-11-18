window.kmHomeContentRequest=fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_home_content',{signal:AbortSignal.timeout(5000)})
 .then(r=>{if(!r.ok)throw Error('홈페이지 내용 연결 실패');return r.json();}).catch(()=>null);
window.kmHomeContentRequest.then(data=>{
 if(!data)return;
 const set=(root,selector,text)=>{const el=root.querySelector(selector);if(el){el.textContent=text||'';el.hidden=!text;}};
 const career=document.querySelector('#clinic-intro');
 if(career&&data.career){const c=data.career;career.hidden=c.visible===false;set(career,'.career-label',c.label);const count=career.querySelector('.count-num');if(count){count.dataset.count=c.number;count.textContent=c.number;const n=count.parentElement;[...n.childNodes].filter(x=>x.nodeType===Node.TEXT_NODE).forEach(x=>x.remove());n.append(document.createTextNode(c.unit||''));n.hidden=!c.number;}
  const h=career.querySelector('.intro-content h2');if(h){h.replaceChildren(document.createTextNode(c.title?c.title.trimEnd()+' ':''));const span=document.createElement('span');span.textContent=c.highlight||'';h.append(span);String(c.titleAfter||'').split('\n').forEach((line,i)=>{if(i)h.append(document.createElement('br'));h.append(document.createTextNode(line));});h.hidden=!(c.title||c.highlight||c.titleAfter);}
  set(career,'.intro-desc',c.description);const list=career.querySelector('.intro-values');if(list){list.replaceChildren();(c.cards||[]).forEach(card=>{const item=document.createElement('div');item.className='value-item';const title=document.createElement('h3'),desc=document.createElement('p');title.textContent=card.title||'';desc.textContent=card.description||'';item.append(title,desc);list.append(item);});}
 }
 const results=document.querySelector('.reviews-preview');if(results&&data.results){const c=data.results;results.hidden=c.visible===false;set(results,'.reviews-section__eyebrow',c.eyebrow);set(results,'#student-results-title',c.title);set(results,'.reviews-preview__heading > div > p:last-child',c.description);const link=results.querySelector('.reviews-preview__footer a');if(link){link.textContent=c.linkLabel||'';link.href=c.link||'#';link.hidden=!(c.linkLabel&&c.link);}}
 const academy=document.querySelector('#academy-about');if(academy&&data.academy){academy.hidden=data.academy.visible===false;set(academy,'#academy-about-title',data.academy.title);set(academy,'.academy-about-heading p',data.academy.description);}
});
