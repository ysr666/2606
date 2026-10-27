"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const data=window.CLASS_ARCHIVE;
 const $=id=>document.getElementById(id);
 const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const safeURL=url=>/^https:\/\//.test(url)?url:"#";
 const query=new URLSearchParams(window.location.search);
 const id=query.get("id");
 const event=id?data.entries.find(e=>e.id===id):null;
 const menu=$("archiveMenu"),nav=$("mainNav");
 function closeMenu(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","展开导航");}
 menu.addEventListener("click",()=>{const on=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(on));menu.setAttribute("aria-label",on?"关闭导航":"展开导航");});
 nav.addEventListener("click",e=>{if(e.target.closest("a"))closeMenu();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
 window.addEventListener("resize",()=>{if(window.innerWidth>870)closeMenu();});
 let viewPictures=[],lightIndex=0;
 function setAlbum(album){viewPictures=album;}
 function openLightbox(index){
   if(!viewPictures.length)return;
   lightIndex=(index+viewPictures.length)%viewPictures.length;
   const pic=viewPictures[lightIndex],dialog=$("archiveLightbox");
   $("archiveLightboxImg").src=pic.src;$("archiveLightboxImg").alt=pic.alt;
   $("archiveLightboxTitle").textContent=pic.alt;
   $("archiveLightboxCount").textContent=(lightIndex+1)+" / "+viewPictures.length;
   if(!dialog.open){dialog.showModal();document.body.style.overflow="hidden";}
 }
 $("archiveLightboxClose").addEventListener("click",()=>$("archiveLightbox").close());
 $("archiveLightboxPrev").addEventListener("click",()=>openLightbox(lightIndex-1));
 $("archiveLightboxNext").addEventListener("click",()=>openLightbox(lightIndex+1));
 $("archiveLightbox").addEventListener("close",()=>{document.body.style.overflow="";});
 $("archiveLightbox").addEventListener("click",e=>{if(e.target===$("archiveLightbox"))$("archiveLightbox").close();});
 $("archiveLightbox").addEventListener("keydown",e=>{
   if(e.key==="ArrowRight")openLightbox(lightIndex+1);
   else if(e.key==="ArrowLeft")openLightbox(lightIndex-1);
 });
 function reportLink(report){
  return '<a href="'+esc(safeURL(report.url))+'" target="_blank" rel="noopener noreferrer">'+esc(report.platform)+' · '+esc(report.title)+' ↗</a>';
 }
 function renderReportList(){
  $("reportsList").innerHTML=data.reports.map(r=>
    '<a class="report-row" href="'+esc(safeURL(r.url))+'" target="_blank" rel="noopener noreferrer">'+
    '<span class="report-platform">'+esc(r.platform)+'</span>'+
    '<strong class="report-title">'+esc(r.title)+'</strong>'+
    '<span class="report-action">阅读报道 <span aria-hidden="true">↗</span></span></a>'
  ).join("");
 }
 function renderList(){
  $("catalogueView").hidden=false;$("detailView").hidden=true;
  renderReportList();
  let active="全部",search="";
  const list=["全部",...data.chapters.map(c=>c.title)];
  $("chapterButtons").innerHTML=list.map((title,i)=>{
    const chapter=data.chapters.find(c=>c.title===title);
    return '<button type="button" data-chapter="'+esc(title)+'" aria-pressed="'+(i===0)+'" class="'+(i===0?"selected":"")+'">'+esc(title)+'<span>'+(chapter?chapter.count:data.entries.length)+'</span></button>';
  }).join("");
  function renderCards(){
   const filtered=data.entries.filter(e=>(active==="全部"||e.chapter===active)&&(!search||[e.title,e.chapter,e.place,e.summary,e.date].join(" ").toLowerCase().includes(search)));
   $("archiveCounter").textContent=filtered.length+" / "+data.entries.length+" 项活动";
   $("archiveEmpty").hidden=filtered.length>0;
   $("archiveCards").innerHTML=filtered.map(e=>{
    const picture=e.photos[0];
    const media=picture?'<img src="'+esc(picture.src)+'" alt="'+esc(picture.alt)+'" loading="lazy">':
    '<div class="image-blank" aria-hidden="true">2606</div>';
    return '<a href="tuanri.html?id='+e.id+'" class="archive-card" aria-label="查看活动：'+esc(e.title)+'">'+
       '<div class="archive-card-image">'+media+'<em>'+esc(e.chapter)+'</em></div>'+
       '<div class="archive-card-content"><div class="archive-card-meta"><span>'+esc(e.date)+'</span><span>NO. '+e.id+'</span></div>'+
       '<h3>'+esc(e.title)+'</h3><p>'+esc(e.summary.slice(0,92))+(e.summary.length>92?"…":"")+'</p>'+
       '<div class="archive-card-footer"><span>'+e.photos.length+' 张活动相关图片</span><span aria-hidden="true">↗</span></div></div></a>';
   }).join("");
  }
  $("chapterButtons").addEventListener("click",ev=>{
   const btn=ev.target.closest("button[data-chapter]");
   if(!btn)return;
   active=btn.dataset.chapter;
   $("chapterButtons").querySelectorAll("button").forEach(b=>{
     const selected=b===btn;b.classList.toggle("selected",selected);b.setAttribute("aria-pressed",String(selected));
   });renderCards();
  });
  $("archiveSearch").addEventListener("input",ev=>{search=ev.target.value.trim().toLowerCase();renderCards();});
  renderCards();
 }
 function renderDetail(e){
  $("catalogueView").hidden=true;$("detailView").hidden=false;
  document.title=e.title+"｜机械类2606团日档案";
  $("detailTrailTitle").textContent=e.title;
  $("detailChapter").textContent=e.chapter;
  $("detailNumber").textContent="NO. "+e.id+" / 32"+(e.status==="原创创编项目"?" · 创编成果":"");
  $("detailTitle").textContent=e.title;
  $("detailSummary").textContent=e.summary;
  $("detailDate").textContent=e.date;
  $("detailLocation").textContent=e.place;
  $("detailOrganizer").textContent=e.organization;
  $("detailParagraphs").innerHTML=e.paragraphs.filter(p=>!p.startsWith(e.summary.slice(0,65))).map(p=>'<p>'+esc(p)+'</p>').join("");
  const myReports=data.reports.filter(r=>e.reports.includes(data.reports.indexOf(r)));
  $("detailReports").innerHTML=myReports.length?
   '<div class="detail-related"><h3>相关公开报道</h3>'+myReports.map(reportLink).join("")+'</div>':"";
  $("detailPhotosSection").hidden=e.photos.length===0;
  $("detailPhotos").innerHTML=e.photos.map((photo,i)=>
   '<button type="button" data-index="'+i+'" aria-label="查看第 '+(i+1)+' 张图片"><img src="'+esc(photo.src)+'" alt="'+esc(photo.alt)+'" loading="lazy"><span class="photo-label">活动资料 '+String(i+1).padStart(2,"0")+' / '+String(e.photos.length).padStart(2,"0")+'</span></button>'
  ).join("");
  $("detailPhotos").addEventListener("click",ev=>{
   const btn=ev.target.closest("button[data-index]");
   if(btn){setAlbum(e.photos);openLightbox(Number(btn.dataset.index));}
  });
  const idx=data.entries.indexOf(e);
  const prev=data.entries[(idx-1+data.entries.length)%data.entries.length],next=data.entries[(idx+1)%data.entries.length];
  $("prevActivity").href="tuanri.html?id="+prev.id;$("prevActivity").textContent="← "+prev.title;
  $("nextActivity").href="tuanri.html?id="+next.id;$("nextActivity").textContent=next.title+" →";
 }
 if(event)renderDetail(event);
 else renderList();
});
