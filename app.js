"use strict";
const activities=[
 {date:"2026.10.09",tag:"班级活动",category:"community",title:"班级广场舞活动",text:"在共同参与中打破最初的陌生，一次集体活动让同学之间有了更多交流。",photo:"group-dance.webp"},
 {date:"2026.10.10",tag:"班级活动",category:"community",title:"班级标识正式发布",text:"机械类2606班徽、班旗在动员大会亮相，成为班级共同的视觉符号。",photo:"class-flag.webp"},
 {date:"2026.10.11",tag:"校际交流",category:"connect",title:"四校同源联合微团课",text:"围绕交通大学共同的历史记忆，以跨校联学与地标互动建立联系。",photo:"four-schools.webp"},
 {date:"2026年10月",tag:"校史文化",category:"culture",title:"交大校史与西迁文化研学",text:"走进校园历史展陈空间，了解交大办学历程和西迁精神。",photo:"campus-history.webp"},
 {date:"2026年10月",tag:"班级活动",category:"community",title:"民族文化交流分享",text:"通过语言与文化主题的同学分享，认识不同的文化与生活经验。",photo:"cultural.webp"},
 {date:"2026年10月",tag:"校史文化",category:"culture",title:"西迁史主题学习",text:"在讲堂与讨论中理解交大历史，把西迁精神放到具体的人与时代中认识。",photo:"lecture.webp"}
];
const pictures=[
 {photo:"hero-class.webp",title:"班旗合影"},
 {photo:"four-schools.webp",title:"四校同源联合微团课"},
 {photo:"group-dance.webp",title:"班级集体活动"},
 {photo:"campus-history.webp",title:"校史研学"},
 {photo:"xian-flag.webp",title:"班旗与研学现场"},
 {photo:"four-school-group.webp",title:"微团课集体合影"},
 {photo:"class-joint.webp",title:"课堂交流"},
 {photo:"class-conversation.webp",title:"班级活动现场"},
 {photo:"cultural.webp",title:"语言文化交流"},
 {photo:"heritage.webp",title:"文化交流分享"},
 {photo:"lecture.webp",title:"西迁史讲堂"},
 {photo:"interview.webp",title:"活动交流现场"}
];
const escapeHTML = v=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const photoURL = s=>"assets/"+s;
let activeIndex=0;
function renderActivities(filter){
 const subset=(filter==="all"?activities:activities.filter(a=>a.category===filter)).slice(0,3);
 document.getElementById("eventsGrid").innerHTML=subset.map(a=>
 '<article class="event-card"><div class="event-card-photo"><img src="'+photoURL(a.photo)+'" alt="'+escapeHTML(a.title)+'相关照片" loading="lazy"><span>'+escapeHTML(a.tag)+'</span></div>'+
 '<div class="event-card-info"><div class="event-meta">'+escapeHTML(a.date)+'</div><h3>'+escapeHTML(a.title)+'</h3><p>'+escapeHTML(a.text)+'</p><footer><span>机械类2606 · 班级动态</span><span aria-hidden="true">↗</span></footer></div></article>'
 ).join("");
}
function renderPictures(){
 document.getElementById("photoGrid").innerHTML=pictures.map((p,i)=>
 '<button class="photo-item'+(i>=8?' extra':'')+'" data-index="'+i+'" type="button" aria-label="放大查看：'+escapeHTML(p.title)+'">'+
 '<img src="'+photoURL(p.photo)+'" alt="'+escapeHTML(p.title)+'" loading="lazy"><span class="photo-caption">'+escapeHTML(p.title)+'<i aria-hidden="true">↗</i></span></button>'
 ).join("");
}
function showLightbox(i){
 activeIndex=(i+pictures.length)%pictures.length;
 const p=pictures[activeIndex], dialog=document.getElementById("lightbox");
 const img=document.getElementById("lightboxImage");
 img.src=photoURL(p.photo);img.alt=p.title;
 document.getElementById("lightboxTitle").textContent=p.title;
 document.getElementById("lightboxNumber").textContent=(activeIndex+1)+" / "+pictures.length;
 if(!dialog.open){dialog.showModal();document.body.style.overflow="hidden";}
}
document.addEventListener("DOMContentLoaded",()=>{
 renderActivities("all");renderPictures();
 const menu=document.getElementById("menuButton"),nav=document.getElementById("mainNav");
 function closeMenu(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","打开导航");}
 menu.addEventListener("click",()=>{
  const visible=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(visible));menu.setAttribute("aria-label",visible?"关闭导航":"打开导航");
 });
 nav.addEventListener("click",e=>{if(e.target.closest("a"))closeMenu();});
 window.addEventListener("resize",()=>{if(window.innerWidth>870)closeMenu();});
 const buttons=[...document.querySelectorAll(".nav a")];
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){if(entry.isIntersecting){buttons.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));}}
 },{rootMargin:"-30% 0px -58% 0px"});
 for(const id of ["home","about","identity","life","gallery","events"]){const el=document.getElementById(id);if(el)observer.observe(el);}
 document.getElementById("photoGrid").addEventListener("click",e=>{const el=e.target.closest("[data-index]");if(el)showLightbox(Number(el.dataset.index));});
 const more=document.getElementById("showPhotos"),grid=document.getElementById("photoGrid");
 more.addEventListener("click",()=>{
  const expanded=grid.classList.toggle("expanded");more.innerHTML=expanded?'收起照片 <span>↑</span>':'浏览更多照片 <span>↓</span>';more.setAttribute("aria-expanded",String(expanded));
 });
 const dialog=document.getElementById("lightbox");
 document.getElementById("lightboxClose").addEventListener("click",()=>dialog.close());
 document.getElementById("lightboxPrev").addEventListener("click",()=>showLightbox(activeIndex-1));
 document.getElementById("lightboxNext").addEventListener("click",()=>showLightbox(activeIndex+1));
 dialog.addEventListener("close",()=>{document.body.style.overflow="";});
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener("keydown",e=>{if(e.key==="ArrowRight")showLightbox(activeIndex+1);if(e.key==="ArrowLeft")showLightbox(activeIndex-1);});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
});
