(()=>{'use strict';if(!document.body.classList.contains('km-home-compact'))return;function captions(){const grid=document.querySelector('#save-teeth .study-room-photos');if(!grid)return;for(const link of grid.querySelectorAll('a')){const image=link.querySelector('img');if(!image)continue;let caption=link.querySelector('.study-photo-caption');if(!caption){caption=document.createElement('span');caption.className='study-photo-caption';caption.setAttribute('aria-hidden','true');link.append(caption);}caption.textContent=image.alt;caption.hidden=!image.alt;}}
captions();if(window.kmHomeContentRequest)window.kmHomeContentRequest.then(captions).catch(()=>{});
})();

