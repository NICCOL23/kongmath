(()=>{'use strict';
if(!document.body.classList.contains('km-home-compact'))return;
const apply=()=>document.querySelectorAll('#save-teeth .study-room-photos>a').forEach(link=>{
 const img=link.querySelector('img');if(!img)return;
 const match=new URL(img.src,location.href).pathname.match(/\/about-studyroom-([1-4])\.jpg$/);
 if(!match)return;
 const wide=`imges/main/studyroom-wide-${match[1]}.jpg`;
 img.src=wide;img.width=1448;img.height=1086;link.href=wide;
});
apply();
if(window.kmHomeContentRequest?.then)window.kmHomeContentRequest.then(apply).catch(()=>{});
})();
