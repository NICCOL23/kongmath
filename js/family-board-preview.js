(() => {
 const dialog=document.querySelector('#write-dialog'),form=document.querySelector('#write-form'),photos=document.querySelector('#family-photos'),previews=document.querySelector('#photo-previews'),error=document.querySelector('#write-error'),stories=document.querySelector('#story-list');
 let selected=[],filter='전체',toastTimer;
 const objectURLs=[];
 function notify(message){const box=document.querySelector('#family-toast');box.textContent=message;box.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.hidden=true,5500);}
 function setFilter(value){filter=value;document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===value;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});let visible=0;stories.querySelectorAll('.story').forEach(story=>{story.hidden=filter!=='전체'&&story.dataset.category!==filter;if(!story.hidden)visible++;});document.querySelector('#empty-feed').hidden=visible>0;document.querySelector('#feed-status').textContent=visible+'개의 예시 안부';}
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
 document.querySelector('#open-write').addEventListener('click',()=>dialog.showModal());document.querySelector('#close-write').addEventListener('click',()=>dialog.close());
 photos.addEventListener('change',()=>{
  error.textContent='';selected=[];previews.replaceChildren();document.querySelector('#photo-count').textContent='0 / 3장';
  const files=[...photos.files];
  if(files.length>3){photos.value='';error.textContent='사진은 최대 3장까지 첨부할 수 있어요. 3장 이내로 다시 선택해 주세요.';return;}
  if(files.some(file=>!file.type.startsWith('image/')||file.size>10*1024*1024)){photos.value='';error.textContent='사진 파일을 선택해 주세요. 한 장당 10MB 이내로 올릴 수 있어요.';return;}
  selected=files.map(file=>{const url=URL.createObjectURL(file);objectURLs.push(url);return {url,name:file.name};});
  for(const photo of selected){const img=document.createElement('img');img.src=photo.url;img.alt='선택한 사진: '+photo.name;previews.append(img);}document.querySelector('#photo-count').textContent=selected.length+' / 3장';
 });
 function textNode(tag,text,className){const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;}
 form.addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(form),nickname=String(data.get('nickname')).trim(),title=String(data.get('title')).trim(),body=String(data.get('body')).trim();
  if(!nickname||!title||!body){error.textContent='닉네임, 제목, 안부 이야기를 적어 주세요.';return;}
  if(selected.length>3){error.textContent='사진은 최대 3장입니다.';return;}
  const article=document.createElement('article');article.className='story';article.dataset.category=data.get('category');
  const top=document.createElement('div');top.className='story-top';top.append(textNode('div',nickname.slice(0,1),'avatar mint'));const who=document.createElement('div'),name=textNode('h3',nickname);name.append(textNode('span',data.get('role')+' · 샘플 체험','badge'));who.append(name,textNode('p',data.get('category')+' · 방금','meta'));top.append(who);article.append(top,textNode('h4',title),textNode('p',body,'story-body'));
  if(selected.length){const images=document.createElement('div');images.className='uploaded-photos';for(const photo of selected){const img=document.createElement('img');img.src=photo.url;img.alt='내가 선택한 사진: '+photo.name;images.append(img);}article.append(images);}
  const actions=document.createElement('div');actions.className='story-actions';const warm=textNode('button','♡ 반가워요 ');warm.className='warm-button';warm.setAttribute('aria-pressed','false');warm.append(textNode('span','0'));actions.append(warm,textNode('button','안부 답장하기','reply-toggle'));if(selected.length)actions.append(textNode('span','사진 '+selected.length+'장'));article.append(actions);stories.prepend(article);
  form.reset();selected=[];previews.replaceChildren();document.querySelector('#photo-count').textContent='0 / 3장';error.textContent='';dialog.close();setFilter('전체');article.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});notify('샘플 화면에만 추가했습니다. 새로고침하면 사라집니다.');
 });
 stories.addEventListener('click',event=>{
  const warm=event.target.closest('.warm-button');if(warm){const active=warm.getAttribute('aria-pressed')==='true';warm.setAttribute('aria-pressed',String(!active));const count=warm.querySelector('span');count.textContent=Number(count.textContent)+(active?-1:1);return;}
  const toggle=event.target.closest('.reply-toggle');if(!toggle)return;const story=toggle.closest('.story');let replyForm=story.querySelector('.reply-form');
  if(!replyForm){replyForm=document.createElement('form');replyForm.className='reply-form';const label=textNode('label','따뜻한 답장 한 줄 (샘플 체험)'),area=document.createElement('textarea');area.rows=2;area.maxLength=500;area.required=true;area.placeholder='오랜만이야. 소식 들으니 반갑다!';label.append(area);const send=textNode('button','샘플 답장 남기기');send.type='submit';replyForm.append(label,send);replyForm.addEventListener('submit',event=>{event.preventDefault();const text=area.value.trim();if(!text)return;const reply=document.createElement('div');reply.className='reply';reply.append(textNode('strong','나의 답장 · 샘플 체험'),textNode('p',text));story.insertBefore(reply,replyForm);area.value='';notify('답장도 이 샘플 화면에만 표시됩니다.');});story.append(replyForm);}
  else replyForm.hidden=!replyForm.hidden;
  toggle.setAttribute('aria-expanded',String(!replyForm.hidden));if(!replyForm.hidden)replyForm.querySelector('textarea').focus();
 });
 window.addEventListener('beforeunload',()=>objectURLs.forEach(url=>URL.revokeObjectURL(url)));
 setFilter('전체');
})();
