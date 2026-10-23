/* ===== Olaylar ve başlatma ===== */
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
 if(t.dataset.kid!=null){S.active=+t.dataset.kid;save();renderKids();lastBadges=null;badgeCheck();if(current&&current.view!=="quiz"&&VIEWS[current.view])VIEWS[current.view](current.arg);return}
 if(t.hasAttribute("data-back")){back();return}
 if(t.hasAttribute("data-again")){const o=Q;startQuiz({id:o.id,gen:o.gen,n:o.n,title:o.title,k:o.k,sec:o.sec});return}
 if(t.dataset.ans!=null){answer(+t.dataset.ans);return}
 if(t.dataset.q){launchQuiz(t.dataset.q,t.dataset.n,t.dataset.t,t.dataset.k);return}
 if(t.dataset.mission!=null){openMission(missions()[+t.dataset.mission]);return}
 if(t.dataset.say){speak(t.dataset.say,t.dataset.lang);if(!t.dataset.go)return}
 if(t.dataset.tbl){showTable(+t.dataset.tbl);return}
 if(t.dataset.storyq!=null){const i=+t.dataset.storyq,s=TR.hikaye[i],qs=shuffle(s.q);startQuiz({id:"story"+i,gen:n=>{const q=qs[n];return mk(q[0],q[1],q[2],{small:true,longopt:q[1].length>14})},n:qs.length,title:s.t,k:"--tr",sec:"tr"});return}
 if(t.hasAttribute("data-flip")){t.querySelector(".ans").hidden=!t.querySelector(".ans").hidden;return}
 if(t.hasAttribute("data-flipline")){t.classList.toggle("hide");return}
 if(t.dataset.go)go(t.dataset.go,t.dataset.arg);
});
document.addEventListener("keydown",e=>{
 const tag=document.activeElement?.tagName,typing=tag==="INPUT"||tag==="SELECT";
 if(!$("#modal").hidden&&e.key==="Escape"){$("#modal").hidden=true;return}
 if((e.key==="Escape"||e.key==="GoBack"||e.key==="BrowserBack"||(e.key==="Backspace"&&!typing))&&current&&current.view!=="home"){e.preventDefault();back();return}
 if(KEYH&&KEYH(e))return;
 const dirs={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},d=dirs[e.key];if(!d||typing)return;
 const els=[...document.querySelectorAll("button:not([disabled]),input,select,summary")].filter(x=>x.offsetParent!==null&&!x.closest("[hidden]"));
 const cur=document.activeElement;if(!els.includes(cur)){els.find(x=>x.closest("#app"))?.focus();e.preventDefault();return}
 const r=cur.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let best=null,bs=1e9;
 for(const el of els){if(el===cur)continue;const q=el.getBoundingClientRect(),dx=q.left+q.width/2-cx,dy=q.top+q.height/2-cy,main=dx*d[0]+dy*d[1];if(main<=4)continue;const side=Math.abs(dx*d[1]+dy*d[0]);const sc=main+side*2.5;if(sc<bs){bs=sc;best=el}}
 if(best){e.preventDefault();best.focus();best.scrollIntoView({block:"nearest",behavior:"smooth"})}
});
/* Süre takibi, mola ve günlük sınır */
let sinceBreak=0,limitShown=false;
setInterval(()=>{if(document.visibilityState!=="visible")return;const d=today();if(S.usage.d!==d){S.usage={d,s:0};limitShown=false}S.usage.s++;sinceBreak++;if(S.usage.s%30===0)save();
 if(sinceBreak>=20*60){sinceBreak=0;modal(`<h3>Mola zamanı! 👀</h3><p>20 dakikadır çalışıyorsun. Gözlerini dinlendirelim, biraz su iç ve gerin.</p><div class="row"><button class="btn" id="m1" style="background:var(--goz)">1 dakikalık göz molası</button><button class="btn ghost" id="m2">Sonra</button></div>`,()=>{$("#m1").onclick=()=>{closeModal();go("eye","short")};$("#m2").onclick=()=>{closeModal();sinceBreak=15*60}})}
 if(S.limit&&!limitShown&&S.usage.s>=S.limit*60){limitShown=true;modal(`<h3>Bugünlük bu kadar! 🌙</h3><p>Bugünkü ekran süren doldu. Şimdi bir kitap okumaya, dışarıda oynamaya ya da ailenle vakit geçirmeye ne dersin?</p><div class="row"><button class="btn" id="m1">Tamam</button></div>`,()=>{$("#m1").onclick=()=>{closeModal();go("home",null,false)}})}
},1000);
function modal(html,bind){const m=$("#modal");m.innerHTML=`<div class="panel" role="dialog" aria-modal="true">${html}</div>`;m.hidden=false;bind&&bind();m.querySelector("button")?.focus()}
function closeModal(){$("#modal").hidden=true}
renderKids();lastBadges=badges().filter(b=>b.ok).length;current={view:"home"};VIEWS.home();focusFirst();
