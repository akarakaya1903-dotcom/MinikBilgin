/* ===== Durum, yardımcılar, soru motoru ===== */
const KEY="minik-bilgin-v2";
const today=()=>{const d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()};
const newKid=(name,grade)=>({name,grade,stars:0,stat:{},done:{},eye:0,games:0});
let S={kids:[newKid("Büyük",3),newKid("Küçük",2)],active:0,limit:45,usage:{d:"",s:0}};
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.kids)S=Object.assign(S,s)}catch(e){}
S.kids.forEach(k=>{k.stat=k.stat||{};k.done=k.done||{};k.eye=k.eye||0;k.games=k.games||0});
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const kid=()=>S.kids[S.active];
const G=()=>kid().grade>=3?3:2;
const $=s=>document.querySelector(s);
const app=document.getElementById("app");
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function speak(t,lang){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=lang||"en-US";u.rate=lang==="tr-TR"?.92:.8;speechSynthesis.speak(u)}catch(e){}}
let actx=null;function beep(f,d=.18){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(.18,actx.currentTime);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+d);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+d)}catch(e){}}
function sfx(ok){if(!S.mute){ok?(beep(660,.12),setTimeout(()=>beep(880,.16),110)):beep(220,.25)}}

function renderKids(){
  $("#kids").innerHTML=S.kids.map((k,i)=>`<button class="kid" data-kid="${i}" aria-pressed="${i===S.active}"><span class="kid-n">${esc(k.name)}</span><span class="kid-g">${k.grade}. sınıf</span><span class="star">★ ${k.stars}</span></button>`).join("");
}
function addStar(n=1){kid().stars+=n;save();renderKids();badgeCheck()}
function stat(sec,ok){const s=kid().stat;s[sec]=s[sec]||[0,0];s[sec][1]++;if(ok)s[sec][0]++;save()}
function markDone(id){const k=kid(),d=today();k.done[d]=k.done[d]||[];if(!k.done[d].includes(id)){k.done[d].push(id);save()}}
const isDone=id=>(kid().done[today()]||[]).includes(id);

/* Türkçe sayı okunuşu */
function numTr(n){const b=["","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz"],o=["","on","yirmi","otuz","kırk","elli","altmış","yetmiş","seksen","doksan"];
 if(n===0)return"sıfır";if(n===1000)return"bin";let s=[];const y=Math.floor(n/100),on=Math.floor(n%100/10),bi=n%10;
 if(y)s.push((y>1?b[y]+" ":"")+"yüz");if(on)s.push(o[on]);if(bi)s.push(b[bi]);return s.join(" ")}
function roman(n){const m=[[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let r="";for(const[v,s]of m)while(n>=v){r+=s;n-=v}return r}
const VOW="aeıioöuüâîûAEIİOÖUÜ";
const isV=c=>VOW.includes(c);
function hecele(w){const ix=[];for(let i=0;i<w.length;i++)if(isV(w[i]))ix.push(i);const cuts=[];
 for(let k=0;k<ix.length-1;k++){const c=ix[k+1]-ix[k]-1;cuts.push(c===0?ix[k+1]:c===1?ix[k+1]-1:c===2?ix[k]+2:ix[k+1]-1)}
 const parts=[];let p=0;for(const c of cuts){parts.push(w.slice(p,c));p=c}parts.push(w.slice(p));return parts}
const TRA="abcçdefgğhıijklmnoöprsştuüvyz";
const trCmp=(a,b)=>{for(let i=0;i<Math.min(a.length,b.length);i++){const x=TRA.indexOf(a[i]),y=TRA.indexOf(b[i]);if(x!==y)return x-y}return a.length-b.length};
const lastV=w=>{for(let i=w.length-1;i>=0;i--)if(isV(w[i]))return w[i];return"a"};

/* ===== Soru motoru ===== */
let Q=null;
function startQuiz(o){Q=Object.assign({n:10,i:0,score:0,streak:0,mistakes:[]},o);if(current&&current.view!=="quiz")hist.push(current);current={view:"quiz"};nextQ()}
const mk=(q,a,w,x={})=>Object.assign({q,a:String(a),w:[...new Set(w.map(String))].filter(v=>v!==String(a))},x);
function numWrong(a,spread,min=0){const s=new Set();let t=0;while(s.size<3&&t<80){t++;const v=a+rnd(-spread,spread);if(v!==a&&v>=min)s.add(v)}while(s.size<3)s.add(a+s.size+1);return[...s]}
function nextQ(){
  if(Q.i>=Q.n)return showResult();
  let c,t=0;do{c=Q.gen(Q.i);t++}while(Q.last&&c.q===Q.last&&t<5);Q.last=c.q;Q.cur=c;Q.locked=false;
  const opts=c.keep?[c.a,...c.w].slice(0,4):shuffle([c.a,...c.w.slice(0,3)]);c.opts=opts;
  app.innerHTML=bar(Q.title,Q.k)+`<section class="panel quiz" style="--k:var(${Q.k})">
   <div class="qhead"><span>Soru ${Q.i+1} / ${Q.n}</span><span>${Q.streak>=3?`<span class="fire">${Q.streak} doğru üst üste!</span> `:""}<span class="star">★ ${Q.score}</span></span></div>
   <div class="prog"><i style="width:${Q.i/Q.n*100}%"></i></div>
   ${c.pic?`<div class="qpic">${c.pic}</div>`:""}
   <div class="question ${c.small?"small":""} ${c.ar?"arq":""}">${c.q}</div>
   ${c.say?`<div class="row"><button class="btn ghost" data-say="${esc(c.say)}" data-lang="${c.lang||"en-US"}">🔊 Dinle</button></div>`:""}
   <div class="opts ${opts.length===2?"two":""} ${c.longopt?"long":""}">${opts.map((o,j)=>`<button class="opt ${c.optar?"ar-o":""}" data-ans="${j}">${c.raw?o:esc(o)}</button>`).join("")}</div>
   <div class="feedback" id="fb" aria-live="polite"></div></section>`;
  if(c.say&&c.autosay!==false)speak(c.say,c.lang);
  requestAnimationFrame(()=>app.querySelector(".opt")?.focus({preventScroll:true}));
}
function answer(j){
  if(Q.locked)return;Q.locked=true;const c=Q.cur;const btns=app.querySelectorAll(".opt");
  const ok=c.opts[j]===c.a;
  btns.forEach((b,x)=>{if(c.opts[x]===c.a)b.classList.add("ok");else if(x===j)b.classList.add("no")});
  const fb=$("#fb");stat(Q.sec||"genel",ok);sfx(ok);
  if(ok){Q.score++;Q.streak++;addStar();fb.className="feedback good";fb.textContent=pick(["Aferin!","Harika!","Süpersin!","Doğru, maşallah!","Çok güzel!","Tebrikler!","Bravo!"])+(c.why?" "+c.why:"")}
  else{Q.streak=0;Q.mistakes.push(c);fb.className="feedback bad";fb.innerHTML="Doğru cevap: <b>"+(c.raw?c.a:esc(c.a))+"</b>"+(c.why?"<br><span>"+c.why+"</span>":"")}
  Q.i++;setTimeout(nextQ,ok?(c.why?1700:950):(c.why?3400:2400));
}
function showResult(){
  const p=Q.score/Q.n;if(p>=.6&&Q.id)markDone(Q.id);
  const msg=p===1?"Mükemmel! Hepsini bildin!":p>=.8?"Çok iyi! Neredeyse tam puan!":p>=.6?"Güzel! Biraz daha pratikle daha da iyi olacak.":p>=.4?"İyi başlangıç, bir tur daha yapalım!":"Hiç sorun değil. Konu anlatımına bakıp tekrar deneyelim!";
  if(p===1)addStar(3);
  app.innerHTML=bar(Q.title,Q.k)+`<section class="panel result"><div class="score" style="color:var(${Q.k})">${Q.score}<small>/${Q.n}</small></div>
  <div class="medal">${p===1?"🏆":p>=.8?"🥇":p>=.6?"🥈":p>=.4?"🥉":"💪"}</div>
  <h3>${msg}</h3><p class="note">Bu turda ${Q.score+(p===1?3:0)} yıldız kazandın${p===1?" (tam puan bonusu +3)":""}. Toplam yıldızın: <b class="star">★ ${kid().stars}</b></p>
  ${Q.mistakes.length?`<details class="review"><summary>Yanlış yaptığın sorular (${Q.mistakes.length})</summary><ul>${Q.mistakes.map(m=>`<li><span>${m.q.replace(/<[^>]+>/g," ")}</span> <b>→ ${m.raw?m.a.replace(/<[^>]+>/g,""):esc(m.a)}</b></li>`).join("")}</ul></details>`:""}
  <div class="row"><button class="btn" data-again data-autofocus>Tekrar oyna</button><button class="btn ghost" data-back>Menüye dön</button></div></section>`;
  focusFirst();
}

/* ===== SVG çizimleri ===== */
function clockSVG(h,m){const a=(m/60)*360,ha=((h%12)+m/60)*30;let t="";
 for(let i=1;i<=12;i++){const r=(i*30-90)*Math.PI/180;t+=`<text x="${100+76*Math.cos(r)}" y="${100+76*Math.sin(r)+7}" text-anchor="middle" style="font:700 19px var(--display);fill:var(--ink)">${i}</text>`}
 for(let i=0;i<60;i++){const r=(i*6-90)*Math.PI/180,l=i%5?4:9;t+=`<line x1="${100+92*Math.cos(r)}" y1="${100+92*Math.sin(r)}" x2="${100+(92-l)*Math.cos(r)}" y2="${100+(92-l)*Math.sin(r)}" style="stroke:var(--muted);stroke-width:${i%5?1.5:3}"/>`}
 const hand=(ang,len,w,col)=>{const r=(ang-90)*Math.PI/180;return`<line x1="100" y1="100" x2="${100+len*Math.cos(r)}" y2="${100+len*Math.sin(r)}" style="stroke:${col};stroke-width:${w};stroke-linecap:round"/>`};
 return`<svg viewBox="0 0 200 200" class="clock" role="img" aria-label="Saat"><circle cx="100" cy="100" r="97" style="fill:var(--surface);stroke:var(--ink);stroke-width:5"/>${t}${hand(ha,48,7,"var(--ink)")}${hand(a,72,4,"var(--tr)")}<circle cx="100" cy="100" r="6" style="fill:var(--ink)"/></svg>`}
function pieSVG(n,k){let s="";if(n===1)return`<svg viewBox="0 0 200 200" class="fig"><circle cx="100" cy="100" r="90" style="fill:var(--math);stroke:var(--ink);stroke-width:3"/></svg>`;
 for(let i=0;i<n;i++){const a1=i/n*2*Math.PI-Math.PI/2,a2=(i+1)/n*2*Math.PI-Math.PI/2,lg=(a2-a1)>Math.PI?1:0;
  s+=`<path d="M100 100 L${100+90*Math.cos(a1)} ${100+90*Math.sin(a1)} A90 90 0 ${lg} 1 ${100+90*Math.cos(a2)} ${100+90*Math.sin(a2)}Z" style="fill:${i<k?"var(--math)":"var(--surface)"};stroke:var(--ink);stroke-width:3"/>`}
 return`<svg viewBox="0 0 200 200" class="fig" role="img" aria-label="Kesir şekli">${s}</svg>`}
function barSVG(n,k){let s="";const w=300/n;for(let i=0;i<n;i++)s+=`<rect x="${10+i*w}" y="20" width="${w}" height="80" style="fill:${i<k?"var(--math)":"var(--surface)"};stroke:var(--ink);stroke-width:3"/>`;return`<svg viewBox="0 0 320 120" class="fig wide">${s}</svg>`}
const SHAPES={"üçgen":[3,"M100 20 L180 170 L20 170Z"],"kare":[4,"M35 35 H165 V165 H35Z"],"dikdörtgen":[4,"M15 55 H185 V145 H15Z"],"beşgen":[5,(()=>{let p=[];for(let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;p.push((100+85*Math.cos(a)).toFixed(1)+" "+(105+85*Math.sin(a)).toFixed(1))}return"M"+p.join(" L")+"Z"})()],"altıgen":[6,(()=>{let p=[];for(let i=0;i<6;i++){const a=(i*60)*Math.PI/180;p.push((100+85*Math.cos(a)).toFixed(1)+" "+(100+85*Math.sin(a)).toFixed(1))}return"M"+p.join(" L")+"Z"})()],"daire":[0,"M100 15 A85 85 0 1 1 99.9 15Z"]};
function shapeSVG(n){return`<svg viewBox="0 0 200 200" class="fig" role="img" aria-label="Şekil"><path d="${SHAPES[n][1]}" style="fill:color-mix(in srgb,var(--math) 30%,var(--surface));stroke:var(--math);stroke-width:5;stroke-linejoin:round"/></svg>`}
function rectSVG(a,b,lab){const W=Math.min(260,40+a*14),H=Math.min(140,30+b*12);return`<svg viewBox="0 0 320 210" class="fig wide"><rect x="${160-W/2}" y="${100-H/2}" width="${W}" height="${H}" style="fill:color-mix(in srgb,var(--math) 22%,var(--surface));stroke:var(--math);stroke-width:4"/><text x="160" y="${100-H/2-10}" text-anchor="middle" style="font:800 20px var(--display);fill:var(--ink)">${a} cm</text><text x="${160+W/2+8}" y="106" style="font:800 20px var(--display);fill:var(--ink)">${b} cm</text>${lab||""}</svg>`}
function chartSVG(items){const max=Math.max(...items.map(i=>i[1]));const top=Math.ceil(max/2)*2;let s="",bw=52,gap=22,x0=48;
 for(let v=0;v<=top;v+=2){const y=170-v/top*140;s+=`<line x1="${x0-4}" x2="${x0+items.length*(bw+gap)}" y1="${y}" y2="${y}" style="stroke:var(--line);stroke-width:1"/><text x="${x0-10}" y="${y+5}" text-anchor="end" style="font:600 13px var(--body);fill:var(--muted)">${v}</text>`}
 items.forEach((it,i)=>{const h=it[1]/top*140,x=x0+gap/2+i*(bw+gap);s+=`<rect x="${x}" y="${170-h}" width="${bw}" height="${h}" rx="4" style="fill:var(--math)"/><text x="${x+bw/2}" y="194" text-anchor="middle" style="font:700 14px var(--body);fill:var(--ink)">${it[0]}</text>`});
 return`<svg viewBox="0 0 ${x0+items.length*(bw+gap)+10} 205" class="fig wide chart" role="img" aria-label="Sütun grafiği">${s}</svg>`}
const MONEY={"100 TL":["#2E7D9A",100],"50 TL":["#C9741C",50],"20 TL":["#2F8F4E",20],"10 TL":["#B8344A",10],"5 TL":["#6E5BAE",5],"1 TL":["#C9A227",1],"50 kr":["#A7A9AC",.5],"25 kr":["#B58A5B",.25]};
const moneyHTML=list=>`<div class="money">${list.map(m=>`<span class="${m.includes("kr")||m==="1 TL"?"coin":"note-b"}" style="--mc:${MONEY[m][0]}">${m}</span>`).join("")}</div>`;
const fmtTL=v=>{const tl=Math.floor(v),kr=Math.round((v-tl)*100);return kr?`${tl} TL ${kr} kr`:`${tl} TL`};
