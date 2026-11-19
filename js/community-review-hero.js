(()=>{'use strict';const hero=document.querySelector('.community-review-hero');if(!hero)return;
 fetch('https://kongmath.mycafe24.com/wp-admin/admin-post.php?action=km_review_hero_data',{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{for(const key of ['description','paper','recipient','signature','button']){const node=hero.querySelector('[data-review-hero="'+key+'"]');if(node&&typeof data[key]==='string')node.textContent=data[key];}}).catch(()=>{});
})();
