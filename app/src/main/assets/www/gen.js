/* ===== Soru üreteçleri ===== */
const PEOPLE=[["Ali","Ali'nin"],["Zeynep","Zeynep'in"],["Ömer","Ömer'in"],["Elif","Elif'in"],["Yusuf","Yusuf'un"],["Meryem","Meryem'in"],["Emir","Emir'in"],["Hatice","Hatice'nin"]];
const THINGS=[["elma","elması"],["kalem","kalemi"],["bilye","bilyesi"],["ceviz","cevizi"],["çikolata","çikolatası"],["kitap","kitabı"],["balon","balonu"],["çıkartma","çıkartması"]];
function fromList(list,sm=true){return()=>{const d=pick(list);return mk(d[0],d[1],d[2],{small:sm})}}
const GEN={
/* --- Matematik --- */
"m-add":()=>{const g=G();let a,b;if(g===2){a=rnd(5,70);b=rnd(3,99-a)}else{a=rnd(100,650);b=rnd(25,999-a)}return mk(`${a} + ${b} = ?`,a+b,numWrong(a+b,g===2?10:30),{why:g===3?"Önce birlikleri, sonra onlukları, en son yüzlükleri topla.":""})},
"m-sub":()=>{const g=G();let a,b;if(g===2){a=rnd(20,99);b=rnd(3,a-2)}else{a=rnd(200,999);b=rnd(40,a-30)}return mk(`${a} − ${b} = ?`,a-b,numWrong(a-b,g===2?10:30),{why:"Kontrol: sonucu çıkanla toplarsan eksilen sayıyı bulursun."})},
"m-miss":()=>{const g=G(),t=rnd(0,2);let a=g===2?rnd(10,50):rnd(100,450),x=g===2?rnd(5,40):rnd(20,400);
 if(t===0)return mk(`${a} + ? = ${a+x}`,x,numWrong(x,8));if(t===1)return mk(`? − ${x} = ${a}`,a+x,numWrong(a+x,10));
 const m=g===2?rnd(2,5):rnd(2,10),n=rnd(2,10);return mk(`${m} × ? = ${m*n}`,n,numWrong(n,3,1))},
"m-mul":()=>{const g=G();const a=g===2?pick([2,3,4,5,10]):rnd(2,10),b=rnd(1,10);return mk(`${a} × ${b} = ?`,a*b,numWrong(a*b,Math.max(3,a)),{why:`${a} × ${b}, ${b} tane ${a}'nın toplamıdır.`})},
"m-div":()=>{const g=G();const b=g===2?pick([2,3,4,5]):rnd(2,10),q=rnd(1,10);return mk(`${b*q} ÷ ${b} = ?`,q,numWrong(q,3,1),{why:`Çünkü ${b} × ${q} = ${b*q}.`})},
"m-word":()=>{const g=G(),[n,ng]=pick(PEOPLE),[it,its]=pick(THINGS),k=rnd(0,g===2?3:6);let q,ans;
 if(k===0){const a=rnd(10,50),b=rnd(5,40);ans=a+b;q=`${ng} ${a} ${its} vardı. Annesi ${b} tane daha aldı. Şimdi kaç ${its} var?`}
 else if(k===1){const a=rnd(20,90),b=rnd(5,a-5);ans=a-b;q=`${ng} ${a} ${its} vardı. ${b} tanesini kardeşine verdi. Kaç ${its} kaldı?`}
 else if(k===2){const a=rnd(2,5),b=rnd(2,10);ans=a*b;q=`Bir kutuda ${b} ${it} var. ${a} kutuda toplam kaç ${it} vardır?`}
 else if(k===3){const b=rnd(2,5),c=rnd(2,6);ans=c;q=`${ng} ${b*c} ${its} var. Bunları ${b} arkadaşına eşit paylaştırırsa her birine kaç tane düşer?`}
 else if(k===4){const a=rnd(120,500),b=rnd(50,300);ans=a+b;q=`Bir kütüphanede ${a} hikâye kitabı ve ${b} bilim kitabı var. Toplam kaç kitap vardır?`}
 else if(k===5){const p=rnd(3,9),c=rnd(3,9);ans=p*c;q=`Bir kalem ${p} lira. ${c} kalem kaç lira eder?`}
 else{const a=rnd(300,900),b=rnd(100,a-50);ans=a-b;q=`Bir okulda ${a} öğrenci var. ${b} öğrenci geziye gitti. Okulda kaç öğrenci kaldı?`}
 return mk(q,ans,numWrong(ans,Math.max(4,Math.round(ans*.2)),1),{small:true})},
"m-place":()=>{const g=G(),t=rnd(0,2);
 if(g===2){const n=rnd(11,99),o=Math.floor(n/10),b=n%10;if(t===0)return mk(`${o} onluk ${b} birlik kaçtır?`,n,[b*10+o,o+b,o*100+b].filter(x=>x!==n));
  if(t===1)return mk(`${n} sayısında kaç onluk vardır?`,o,numWrong(o,3,0));return mk(`${n} sayısının okunuşu hangisidir?`,numTr(n),[numTr(b*10+o||n+1),numTr(n+10>99?n-10:n+10),numTr(n%10?n-1:n+1)],{small:true,longopt:true})}
 let n;do{n=rnd(111,999)}while(String(n).includes("0"));const y=Math.floor(n/100),o=Math.floor(n%100/10),b=n%10;
 if(t===0)return mk(`${y} yüzlük ${o} onluk ${b} birlik kaçtır?`,n,[y*100+b*10+o,b*100+o*10+y,y*100+o+b].filter(x=>x!==n));
 if(t===1){const d=pick([[y,100,"yüzler"],[o,10,"onlar"],[b,1,"birler"]]);return mk(`${n} sayısında ${d[0]} rakamının basamak değeri kaçtır?`,d[0]*d[1],[d[0],d[0]*10===d[0]*d[1]?d[0]*100:d[0]*10,d[0]*1000],{why:`${d[0]} rakamı ${d[2]} basamağında.`})}
 return mk(`${n} sayısının okunuşu hangisidir?`,numTr(n),[numTr(b*100+o*10+y||n+1),numTr(n>=900?n-100:n+100),numTr(y*100+b*10+o===n?n+1:y*100+b*10+o)],{small:true,longopt:true})},
"m-rhythm":()=>{const g=G(),st=g===2?pick([2,3,4,5,10]):pick([2,3,4,5,6,7,8,9,10,25,50,100]),start=st*rnd(0,g===2?6:10),down=g===3&&Math.random()<.35;
 let s=[0,1,2,3,4].map(i=>down?start+st*(4-i):start+st*i);if(down)s=s.map(x=>x+st*2);const hole=rnd(1,4),ans=s[hole];s[hole]="?";
 return mk(s.join(", "),ans,numWrong(ans,st+2,0),{why:`${down?"Geriye":"İleriye"} doğru ${st}'er ${st}'er sayıyoruz.`})},
"m-oddeven":()=>{const odd=Math.random()<.5,mx=G()===2?99:999;const pickN=f=>{let n;do{n=rnd(1,mx)}while(n%2!==f);return n};
 const a=pickN(odd?1:0),w=[pickN(odd?0:1),pickN(odd?0:1),pickN(odd?0:1)];return mk(`Hangisi ${odd?"tek":"çift"} sayıdır?`,a,w,{why:"Birler basamağı 0, 2, 4, 6, 8 olanlar çift; 1, 3, 5, 7, 9 olanlar tektir."})},
"m-compare":()=>{const mx=G()===2?99:999;let a=rnd(1,mx),b=Math.random()<.15?a:rnd(1,mx);if(Math.random()<.4&&a>10){const s=String(a);b=+s.split("").reverse().join("")||a}
 const ans=a>b?">":a<b?"<":"=";return mk(`${a} ◯ ${b}`,ans,["<",">","="].filter(x=>x!==ans),{keep:true,why:"Ağzı büyük olan sayıya bakar: 8 > 3"})},
"m-order":()=>{const mx=G()===2?99:999,s=new Set();while(s.size<4)s.add(rnd(10,mx));const a=[...s],big=Math.random()<.5;const ans=big?Math.max(...a):Math.min(...a);
 return mk(`Hangisi en ${big?"büyük":"küçük"} sayıdır?`,ans,a.filter(x=>x!==ans))},
"m-round":()=>{const g=G();if(g===3&&Math.random()<.4){const n=rnd(101,949),r=Math.round(n/100)*100;return mk(`${n} sayısı en yakın yüzlüğe yuvarlanırsa kaç olur?`,r,[r-100,r+100,Math.round(n/10)*10].filter(x=>x>0),{why:"Onlar basamağı 5 veya büyükse yukarı, 5'ten küçükse aşağı yuvarlanır."})}
 const n=rnd(11,g===2?99:999);let r=Math.round(n/10)*10;if(n%10===5)r=n+5;return mk(`${n} sayısı en yakın onluğa yuvarlanırsa kaç olur?`,r,[r-10,r+10,n-n%10===r?n-n%10+10:n-n%10].filter(x=>x>0),{why:"Birler basamağı 5 veya büyükse yukarı, 5'ten küçükse aşağı yuvarlanır."})},
"m-frac":()=>{const g=G();const n=g===2?pick([2,4]):pick([2,3,4,5,6,8]),k=g===2?rnd(1,n===2?2:4):rnd(1,n);
 const nm={2:"yarım",4:"çeyrek"};if(Math.random()<.5){const ans=k===n?"1 bütün":`${k}/${n}`;const w=[`${n}/${k}`,`${Math.max(1,k-1)}/${n}`,`${Math.min(n,k+1)}/${n}`,`1/${n+1}`,`${k}/${n+2}`];
  return mk("Şeklin kaçta kaçı boyalıdır?",ans,w.map(x=>x===`${n}/${n}`?"1 bütün":x),{pic:Math.random()<.6?pieSVG(n,k):barSVG(n,k),why:`Bütün ${n} eş parçaya bölünmüş, ${k} parçası boyalı.`})}
 if(g===2){const t=pick([["Bir bütün kaç yarımdan oluşur?","2",["4","3","1"]],["Bir bütün kaç çeyrekten oluşur?","4",["2","3","8"]],["Bir yarım kaç çeyrekten oluşur?","2",["4","1","3"]],["Bir elmayı iki eş parçaya bölersek her parçaya ne denir?","yarım",["çeyrek","bütün","üçte bir"]],["Bir pizzayı dört eş parçaya bölersek her parçaya ne denir?","çeyrek",["yarım","bütün","beşte bir"]]]);return mk(t[0],t[1],t[2],{small:true})}
 const a=pick([2,3,4,5,6,8,10]),b=pick([2,3,4]),tot=a*b*rnd(1,3);return mk(`${tot} sayısının ${b}'te 1'i kaçtır?`.replace("2'te","2'de").replace("3'te","3'te").replace("4'te","4'te"),tot/b,numWrong(tot/b,3,1),{why:`${tot} ÷ ${b} = ${tot/b}`})},
"m-clock":()=>{const g=G();let h=rnd(1,12),m=g===2?pick([0,0,30,15,45]):pick([0,5,10,15,20,25,30,35,40,45,50,55]);
 const f=(H,M)=>`${H}:${String(M).padStart(2,"0")}`;const ans=f(h,m);
 const w=[f(m===0?12:Math.max(1,Math.round(m/5))||12,h*5%60),f(h%12+1,m),f(h,(m+30)%60),f(h===1?12:h-1,m)];
 return mk("Saat kaçı gösteriyor?",ans,w,{pic:clockSVG(h,m),why:"Kısa kol (akrep) saati, uzun kol (yelkovan) dakikayı gösterir."})},
"m-money":()=>{const g=G();const pool=g===2?["20 TL","10 TL","5 TL","1 TL"]:["50 TL","20 TL","10 TL","5 TL","1 TL","50 kr","25 kr"];
 const n=rnd(2,g===2?4:5),list=[];for(let i=0;i<n;i++)list.push(pick(pool));list.sort((a,b)=>MONEY[b][1]-MONEY[a][1]);const v=list.reduce((s,m)=>s+MONEY[m][1],0);
 if(g===3&&Math.random()<.35){const pr=rnd(5,Math.floor(v)-1);if(pr>0&&pr<v)return mk(`Bu paralarla ${pr} TL'lik bir kitap alırsak kaç para üstü alırız?`,fmtTL(v-pr),[fmtTL(v-pr+1),fmtTL(Math.max(.5,v-pr-1)),fmtTL(v)],{pic:moneyHTML(list),small:true})}
 return mk("Toplam kaç para var?",fmtTL(v),[fmtTL(v+5),fmtTL(Math.max(1,v-5)),fmtTL(v+1),fmtTL(v+.5)],{pic:moneyHTML(list),why:"1 TL = 100 kuruş"})},
"m-measure":()=>{const g=G(),t=rnd(0,g===2?4:9);
 if(t===0)return mk("1 metre kaç santimetredir?",100,[10,1000,50]);
 if(t===1){const m=rnd(2,9);return mk(`${m} metre kaç santimetredir?`,m*100,[m*10,m*1000,m+100])}
 if(t===2)return mk("Hangisini ölçmek için metre kullanırız?","Sınıfın uzunluğu",["Bir silginin boyu","Bir karıncanın boyu","Suyun ağırlığı"],{small:true});
 if(t===3)return mk("Hangisini ölçmek için santimetre kullanırız?","Kalemin boyu",["İki şehir arası","Okul bahçesi","Yolun uzunluğu"],{small:true});
 if(t===4){const a=rnd(10,60),b=rnd(5,40);return mk(`${a} cm + ${b} cm = ? cm`,a+b,numWrong(a+b,8))}
 if(t===5)return mk("1 kilogram kaç gramdır?",1000,[100,10,500]);
 if(t===6)return mk("Yarım kilogram kaç gramdır?",500,[50,250,1000]);
 if(t===7){const m=rnd(1,4),c=pick([20,50,75]);return mk(`${m} m ${c} cm kaç santimetredir?`,m*100+c,[m*10+c,m*1000+c,m+c])}
 if(t===8)return mk("1 litre kaç yarım litredir?",2,[4,1,10]);
 const k=rnd(2,5),gr=pick([250,500]);return mk(`${k} kg ${gr} g kaç gramdır?`,k*1000+gr,[k*100+gr,k*1000,k+gr])},
"m-shape":()=>{const names=Object.keys(SHAPES);const n=pick(G()===2?names.filter(x=>x!=="altıgen"):names);
 if(Math.random()<.5||n==="daire")return mk("Bu şeklin adı nedir?",n,names.filter(x=>x!==n),{pic:shapeSVG(n)});
 return mk("Bu şeklin kaç köşesi vardır?",SHAPES[n][0],[3,4,5,6,0].filter(x=>x!==SHAPES[n][0]),{pic:shapeSVG(n),why:`${n[0].toUpperCase()+n.slice(1)} şeklinin ${SHAPES[n][0]} köşesi ve ${SHAPES[n][0]} kenarı vardır.`})},
"m-solid":fromList([["Futbol topu hangi geometrik cisme benzer?","Küre",["Küp","Silindir","Koni"]],["Oyun zarı hangi geometrik cisme benzer?","Küp",["Küre","Koni","Silindir"]],["Konserve kutusu hangi geometrik cisme benzer?","Silindir",["Küp","Küre","Koni"]],["Dondurma külahı hangi geometrik cisme benzer?","Koni",["Silindir","Küp","Küre"]],["Ayakkabı kutusu hangi geometrik cisme benzer?","Kare / dikdörtgen prizma",["Küre","Koni","Silindir"]],["Küpün kaç yüzü vardır?","6",["4","8","12"]],["Küpün kaç köşesi vardır?","8",["6","4","12"]],["Kürenin kaç köşesi vardır?","0",["1","2","8"]],["Hangisi yuvarlanabilir?","Küre",["Küp","Kare prizma","Üçgen prizma"]],["Karpuz hangi geometrik cisme benzer?","Küre",["Koni","Küp","Prizma"]]]),
"m-perim":()=>{const t=rnd(0,2);if(t===0){const a=rnd(3,15),b=rnd(2,10);return mk("Bu dikdörtgenin çevresi kaç cm'dir?",2*(a+b),[a+b,a*b,2*a+b],{pic:rectSVG(a,b),why:`Çevre = ${a} + ${b} + ${a} + ${b} = ${2*(a+b)} cm`})}
 if(t===1){const a=rnd(2,12);return mk(`Bir kenarı ${a} cm olan karenin çevresi kaç cm'dir?`,4*a,[2*a,a*a===4*a?a+4:a*a,3*a],{small:true,why:`Karenin 4 kenarı eşittir: 4 × ${a} = ${4*a}`})}
 const a=rnd(3,12),b=rnd(3,12),c=rnd(3,12);return mk(`Kenarları ${a} cm, ${b} cm ve ${c} cm olan üçgenin çevresi kaç cm'dir?`,a+b+c,numWrong(a+b+c,5,3),{small:true})},
"m-chart":()=>{const ACC={Elma:"Elmayı",Armut:"Armudu",Muz:"Muzu",Çilek:"Çileği",Kiraz:"Kirazı"};const items=shuffle([["Elma"],["Armut"],["Muz"],["Çilek"],["Kiraz"]]).slice(0,4).map(x=>[x[0],rnd(1,10)]);
 const t=rnd(0,3),it=pick(items),mx=items.reduce((a,b)=>b[1]>a[1]?b:a),mn=items.reduce((a,b)=>b[1]<a[1]?b:a);
 const pic=chartSVG(items),lead="Grafik, sınıftaki öğrencilerin en sevdiği meyveleri gösteriyor. ";
 if(t===0)return mk(lead+`${ACC[it[0]]} seven kaç öğrenci var?`,it[1],numWrong(it[1],3,0),{pic,small:true});
 if(t===1&&items.filter(i=>i[1]===mx[1]).length===1)return mk(lead+"En çok sevilen meyve hangisidir?",mx[0],items.map(i=>i[0]).filter(x=>x!==mx[0]),{pic,small:true});
 if(t===2&&items.filter(i=>i[1]===mn[1]).length===1)return mk(lead+"En az sevilen meyve hangisidir?",mn[0],items.map(i=>i[0]).filter(x=>x!==mn[0]),{pic,small:true});
 const tot=items.reduce((s,i)=>s+i[1],0);return mk(lead+"Grafikte toplam kaç öğrenci var?",tot,numWrong(tot,5,1),{pic,small:true})},
"m-roman":()=>{const n=rnd(1,20);if(Math.random()<.5)return mk(`${roman(n)} hangi sayıdır?`,n,numWrong(n,3,1),{why:"I = 1, V = 5, X = 10. Küçük sayı büyüğün solundaysa çıkarılır: IV = 4."});return mk(`${n} sayısı Roma rakamıyla nasıl yazılır?`,roman(n),[roman(Math.max(1,n-1)),roman(n+1),roman(n===4?6:n===9?11:Math.min(20,n+5))])},
"m-mix":()=>{const ks=G()===2?["m-add","m-sub","m-mul","m-miss","m-rhythm","m-compare","m-clock","m-money","m-frac","m-shape","m-word","m-place"]:["m-add","m-sub","m-mul","m-div","m-word","m-miss","m-round","m-clock","m-money","m-frac","m-perim","m-chart","m-roman","m-measure","m-place"];return GEN[pick(ks)]()},
/* --- Türkçe --- */
"t-alfabe":()=>{const A=TR.alfabe,t=rnd(0,2);if(t===0){const i=rnd(0,A.length-2);return mk(`Alfabede “${A[i]}” harfinden sonra hangi harf gelir?`,A[i+1],shuffle(A.filter((x,j)=>j!==i+1)).slice(0,3))}
 if(t===1){const i=rnd(1,A.length-1);return mk(`Alfabede “${A[i]}” harfinden önce hangi harf gelir?`,A[i-1],shuffle(A.filter((x,j)=>j!==i-1)).slice(0,3))}
 const v="AEIİOÖUÜ".split(""),c=A.filter(x=>!v.includes(x));return Math.random()<.5?mk("Hangisi sesli (ünlü) harftir?",pick(v),shuffle(c).slice(0,3),{why:"Sesli harfler: a, e, ı, i, o, ö, u, ü"}):mk("Hangisi sessiz (ünsüz) harftir?",pick(c),shuffle(v).slice(0,3),{why:"Türkçede 8 sesli, 21 sessiz harf vardır."})},
"t-sirala":()=>{const pool=[...new Set(TR.sozluk.map(x=>x[0].split(" ")[0]).concat(TR.es.flat()))];let w;do{w=shuffle(pool).slice(0,4)}while(new Set(w.map(x=>x[0])).size<4);
 const ans=[...w].sort(trCmp)[0];return mk("Hangi kelime sözlükte en önce gelir?",ans,w.filter(x=>x!==ans),{why:"Kelimelerin ilk harflerine alfabe sırasıyla bakarız."})},
"t-hece":()=>{const w=pick(TR.hece||[]);const n=hecele(w).length;return mk(`“${w}” kelimesi kaç hecelidir?`,n,[1,2,3,4,5,6].filter(x=>x!==n).sort(()=>Math.random()-.5),{why:`${hecele(w).join("-")}: Her hecede bir sesli harf vardır.`})},
"t-heceayir":()=>{const w=pick(TR.hece.filter(x=>hecele(x).length>1));const p=hecele(w),ans=p.join("-");const wr=new Set();
 for(let i=0;i<p.length-1;i++){const a=[...p];if(a[i].length>1){a[i+1]=a[i].slice(-1)+a[i+1];a[i]=a[i].slice(0,-1);wr.add(a.join("-"))}const b=[...p];if(b[i+1].length>1){b[i]=b[i]+b[i+1][0];b[i+1]=b[i+1].slice(1);wr.add(b.join("-"))}}
 wr.add(w.split("").join("-"));wr.delete(ans);return mk(`“${w}” kelimesi nasıl hecelenir?`,ans,shuffle([...wr]),{why:"Her hecede yalnızca bir sesli harf bulunur."})},
"t-es":()=>{const p=pick(TR.es),[x,y]=Math.random()<.5?p:[p[1],p[0]];return mk(`“${x}” kelimesinin eş anlamlısı hangisidir?`,y,shuffle(TR.es.filter(e=>e!==p).flat()).slice(0,3),{small:true})},
"t-zit":()=>{const p=pick(TR.zit),[x,y]=Math.random()<.5?p:[p[1],p[0]];return mk(`“${x}” kelimesinin zıt anlamlısı hangisidir?`,y,shuffle(TR.zit.filter(e=>e!==p).flat()).slice(0,3),{small:true})},
"t-sestes":()=>{const s=pick(TR.sesteş),i=rnd(1,2),strip=t=>t.replace(/\s*\(.*\)/,"");const m=s[i].match(/\((.*)\)/)[1];
 const others=shuffle(TR.sesteş.filter(x=>x!==s)).slice(0,2).map(x=>strip(x[rnd(1,2)]));
 return mk(`Hangi cümlede “${s[0]}” kelimesi “${m}” anlamında kullanılmıştır?`,strip(s[i]),[strip(s[3-i]),...others],{small:true,longopt:true,why:"Yazılışı aynı, anlamı farklı kelimelere sesteş kelimeler denir."})},
"t-deyim":()=>{const d=pick(TR.deyim);return mk(`“${d[0]}” ne anlama gelir?`,d[1],shuffle(TR.deyim.filter(x=>x!==d)).slice(0,3).map(x=>x[1]),{small:true,longopt:true})},
"t-atasozu":()=>{const d=pick(TR.atasozu);return mk(`“${d[0]}” atasözü ne anlatır?`,d[1],shuffle(TR.atasozu.filter(x=>x!==d)).slice(0,3).map(x=>x[1]),{small:true,longopt:true})},
"t-nokta":()=>{const d=pick(TR.noktalama),nm={".":"Nokta (.)","?":"Soru işareti (?)","!":"Ünlem (!)"};return mk(`“${d[0]}…” cümlesinin sonuna hangi işaret konur?`,nm[d[1]],Object.values(nm),{small:true,keep:false,why:d[1]==="."?"Bilgi veren cümlelerin sonuna nokta konur.":d[1]==="?"?"Soru soran cümlelerin sonuna soru işareti konur.":"Sevinç, korku, şaşkınlık bildiren cümlelerin sonuna ünlem konur."})},
"t-buyuk":()=>{const d=pick(TR.buyuk);return mk("Hangi cümlede büyük harfler doğru kullanılmıştır?",d[0],d.slice(1),{small:true,longopt:true,why:"Cümleler, özel isimler (kişi, şehir, ülke, hayvan adları) ve bayram adları büyük harfle başlar."})},
"t-cogul":()=>{const w=pick(["kitap","kalem","ev","okul","çiçek","kuş","göz","kapı","araba","defter","ağaç","köpek","top","gül","masa","pencere","bulut","yıldız","öğrenci","çocuk","kedi","balık","elma","üzüm","göl","dağ","tren","kutu","süt","resim"]);
 const back="aıou".includes(lastV(w)),ans=w+(back?"lar":"ler"),wr=w+(back?"ler":"lar");return mk(`“${w}” kelimesinin çoğulu hangisidir?`,ans,[wr],{why:`Son sesli harf “${lastV(w)}” olduğu için “-${back?"lar":"ler"}” eki gelir.`})},
"t-tur":()=>{const t=rnd(0,1);if(t===0){const a=pick(TR.fiil);return mk("Hangisi bir eylem (fiil) bildirir?",a,shuffle(TR.isim.concat(TR.sifat)).slice(0,3),{why:"Fiiller iş, oluş, hareket bildirir: koşmak, okudu, gel."})}
 const oz=["Ankara","Ali","Zeynep","İstanbul","Türkiye","Karadeniz","Pamuk","Ayşe"];return mk("Hangisi bir özel isimdir?",pick(oz),shuffle(["masa","kedi","kitap","deniz","ağaç","kalem","şehir","okul","bulut"]).slice(0,3),{why:"Tek olan varlıklara verilen adlara özel isim denir, büyük harfle başlar."})},
"t-sozluk":()=>{const d=pick(TR.sozluk);return Math.random()<.5?mk(`“${d[0]}” kelimesinin anlamı nedir?`,d[1],shuffle(TR.sozluk.filter(x=>x!==d)).slice(0,3).map(x=>x[1]),{small:true,longopt:true}):mk(`“${d[1]}” anlamına gelen kelime hangisidir?`,d[0],shuffle(TR.sozluk.filter(x=>x!==d)).slice(0,3).map(x=>x[0]),{small:true})},
"t-bilmece":()=>{const d=pick(TR.bilmece);return mk(d[0],d[1],shuffle(TR.bilmece.filter(x=>x!==d)).slice(0,3).map(x=>x[1]),{small:true})},
"t-mix":()=>GEN[pick(["t-es","t-zit","t-hece","t-alfabe","t-sirala","t-nokta","t-cogul","t-deyim","t-atasozu","t-sozluk","t-buyuk","t-tur","t-sestes"])](),
/* --- İngilizce --- */
"e-all":()=>enQ(pick(EN.filter(c=>!c.nopic))),
"e-listen":()=>{const c=pick(EN),e=pick(c.w);return mk("Dinle. Duyduğun kelimenin Türkçesi hangisi?",e[1],shuffle(c.w.filter(x=>x!==e)).slice(0,3).map(x=>x[1]),{say:e[0],small:true})},
"e-trn":()=>{const c=pick(EN),e=pick(c.w);return mk(`“${e[1]}” İngilizcede hangisidir?`,e[0],shuffle(c.w.filter(x=>x!==e)).slice(0,3).map(x=>x[0]),{small:true})},
"e-phr":()=>{const p=pick(EN_PHRASES);return Math.random()<.5?mk(`“${p[0]}” ne demektir?`,p[1],shuffle(EN_PHRASES.filter(x=>x!==p)).slice(0,3).map(x=>x[1]),{small:true,longopt:true,say:p[0],autosay:false}):mk(`“${p[1]}” İngilizcede nasıl söylenir?`,p[0],shuffle(EN_PHRASES.filter(x=>x!==p)).slice(0,3).map(x=>x[0]),{small:true,longopt:true})},
"e-abc":()=>{const a=pick(EN_ALPHABET);return mk(`“${a[1]}” kelimesi hangi harfle başlar?`,a[0],shuffle(EN_ALPHABET.filter(x=>x!==a)).slice(0,3).map(x=>x[0]),{pic:`<div class="pic">${a[3]}</div>`,say:a[1]})},
/* --- Din --- */
"d-harf":()=>{const l=pick(DIN.elifba);return mk(`<span class="ar">${l[0]}</span><br>Bu harfin adı nedir?`,l[1],shuffle(DIN.elifba.filter(x=>x!==l)).slice(0,3).map(x=>x[1]),{ar:true})},
"d-harfbul":()=>{const l=pick(DIN.elifba);return mk(`“${l[1]}” harfi hangisidir?`,l[0],shuffle(DIN.elifba.filter(x=>x!==l)).slice(0,3).map(x=>x[0]),{optar:true})},
"d-hareke":()=>{const l=pick(DIN.elifba.filter(x=>x[2].split(" ").length===3&&x[0]!=="ا")),i=rnd(0,2),mark=["َ","ِ","ُ"][i],syl=l[2].split(" ");
 return mk(`<span class="ar">${l[0]+mark}</span><br>Nasıl okunur?`,syl[i],[...syl.filter((x,j)=>j!==i),pick(DIN.elifba.filter(x=>x!==l&&x[2].split(" ").length===3))[2].split(" ")[i]],{ar:true,why:["Üstün harfe e/a sesi verir.","Esre harfe i/ı sesi verir.","Ötre harfe ü/u sesi verir."][i]})},
"d-quiz":fromList(DIN.quiz),
"d-esma":()=>{const e=pick(DIN.esma.slice(1));return Math.random()<.5?mk(`“${e[0]}” ne demektir?`,e[1],shuffle(DIN.esma.slice(1).filter(x=>x!==e)).slice(0,3).map(x=>x[1]),{small:true,longopt:true}):mk(`“${e[1]}” anlamına gelen isim hangisidir?`,e[0],shuffle(DIN.esma.slice(1).filter(x=>x!==e)).slice(0,3).map(x=>x[0]),{small:true})},
"d-sure":()=>{const s=pick(DIN.sureler);const line=pick(s.o);return mk(`“${line}” ayeti hangi surededir?`,s.n,shuffle(DIN.sureler.filter(x=>x!==s)).slice(0,3).map(x=>x.n),{small:true})},
"d-dua":()=>{const d=pick(DIN.dualar);return mk(`“${d[1]}” ne anlama gelir?`,d[2],shuffle(DIN.dualar.filter(x=>x!==d)).slice(0,3).map(x=>x[2]),{small:true,longopt:true})},
"d-siyer":()=>{const s=pick(DIN.siyer);return mk(`${s[1]} Bu olay hangi yılda oldu?`,s[0],shuffle(DIN.siyer.filter(x=>x!==s)).slice(0,3).map(x=>x[0]),{small:true})},
"d-peyg":()=>{const p=pick(DIN.peygamberler);return mk("Hangisi Kur'an'da adı geçen 25 peygamberden biridir?","Hz. "+p,shuffle(["Hz. Ebû Bekir","Hz. Ömer","Hz. Osman","Hz. Ali","Hz. Bilâl","Hz. Hamza","Hz. Selmân"]).slice(0,3),{small:true})},
"d-melek":()=>{const m=pick(DIN.melekler);return mk(`${m[1]} Bu görev hangi meleğindir?`.replace("melektir. Bu görev hangi meleğindir?","melek hangisidir?"),m[0],shuffle(DIN.melekler.filter(x=>x!==m)).slice(0,3).map(x=>x[0]),{small:true})},
"d-namaz":()=>{const n=pick(DIN.namaz);return Math.random()<.5?mk(`${n[0]} namazı toplam kaç rekâttır?`,n[2],shuffle(DIN.namaz.filter(x=>x!==n)).map(x=>x[2]).slice(0,3),{why:n[1]}):mk(`${n[0]} namazı nasıl kılınır?`,n[1],DIN.namaz.filter(x=>x!==n).map(x=>x[1]).slice(0,3),{small:true,longopt:true})},
"d-ay":()=>{const A=DIN.aylar,i=rnd(0,10);return mk(`Hicri takvimde ${A[i]} ayından sonra hangi ay gelir?`,A[i+1],shuffle(A.filter((x,j)=>j!==i+1)).slice(0,3),{small:true})},
"d-mix":()=>GEN[pick(["d-quiz","d-quiz","d-esma","d-sure","d-dua","d-siyer","d-peyg","d-melek","d-namaz","d-harf"])](),
/* --- Bilgi ve zekâ --- */
"b-all":()=>{const t=pick(BILGI),d=pick(t.q);return mk(d[0],d[1],d[2],{small:true})},
"z-seq":()=>{const g=G(),t=rnd(0,g===2?3:6);let s=[];
 if(t===0){const a=rnd(1,20),k=rnd(2,g===2?5:10);for(let i=0;i<5;i++)s.push(a+k*i)}
 else if(t===1){const k=rnd(2,g===2?5:9),a=rnd(40,100);for(let i=0;i<5;i++)s.push(a-k*i)}
 else if(t===2){const a=rnd(1,10),x=rnd(1,4),y=rnd(5,9);let v=a;for(let i=0;i<5;i++){s.push(v);v+=i%2?y:x}}
 else if(t===3){const a=rnd(1,5);let v=a;for(let i=0;i<5;i++){s.push(v);v+=i+1}}
 else if(t===4){const a=rnd(1,4);for(let i=0;i<5;i++)s.push(a*2**i)}
 else if(t===5){let x=1,y=1;for(let i=0;i<6;i++){s.push(x);[x,y]=[y,x+y]}s.shift()}
 else{for(let i=1;i<=5;i++)s.push(i*i)}
 const ans=s.pop();return mk(s.join(", ")+", ?",ans,numWrong(ans,6,0),{why:"Sayıların arasındaki farka ya da kata bak."})},
"z-shape":()=>{const sets=[["🔴","🔵"],["⭐","🌙"],["🍎","🍌","🍇"],["🐱","🐶"],["▲","■","●"],["🟥","🟨","🟦"]];const set=pick(sets);const len=rnd(set.length*2+1,set.length*3);const s=[];for(let i=0;i<len;i++)s.push(set[i%set.length]);const ans=set[len%set.length];
 return mk(`<span class="seq">${s.join(" ")} ?</span><br>Sıradaki hangisi?`,ans,shuffle(set.filter(x=>x!==ans).concat(["⬛","💚","🍓"])).slice(0,3),{raw:true})},
"z-odd":()=>{const keys=Object.keys(ODD);const g1=pick(keys);let g2;do{g2=pick(keys)}while(g2===g1);const three=shuffle(ODD[g1]).slice(0,3),odd=pick(ODD[g2]);return mk("Hangisi diğerlerinden farklıdır?",odd,three,{small:true,why:`Diğerleri ${g1}.`})},
"z-mantik":fromList(MANTIK),
"z-analoji":fromList([["Kuş havada uçar, balık ... yüzer.","suda",["havada","karada","ağaçta"]],["Göz görmek içindir, kulak ... içindir.","duymak",["koklamak","yürümek","yemek"]],["Gündüz güneş doğar, gece ... çıkar.","ay",["bulut","yağmur","gökkuşağı"]],["Kalem yazmak için, makas ... için.","kesmek",["çizmek","silmek","boyamak"]],["Ağaç ormanda, balık ...","denizde",["çölde","dağda","tarlada"]],["Kuzu koyunun yavrusudur, civciv ... yavrusudur.","tavuğun",["ördeğin","kuşun","kazın"]],["Kış soğuk, yaz ...","sıcak",["karlı","rüzgârlı","serin"]],["Doktor hastanede, öğretmen ... çalışır.","okulda",["fırında","çiftlikte","bankada"]],["Ayakkabı ayağa, eldiven ... giyilir.","ele",["başa","boyna","dize"]],["Bir haftada 7 gün, bir yılda ... ay vardır.","12",["7","10","30"]],["Arı bal yapar, inek ... verir.","süt",["yumurta","yün","bal"]],["Fırıncı ekmek yapar, terzi ... diker.","elbise",["ayakkabı","masa","ev"]]])
};
const ODD={"meyve":["elma","armut","muz","çilek","kiraz","üzüm","karpuz","şeftali"],"sebze":["havuç","patates","ıspanak","soğan","lahana","pırasa","brokoli"],"hayvan":["kedi","köpek","at","inek","aslan","tavşan","zürafa","penguen"],"taşıt":["araba","otobüs","uçak","gemi","tren","bisiklet","helikopter"],"renk":["kırmızı","mavi","yeşil","sarı","mor","turuncu","pembe"],"okul eşyası":["kalem","silgi","defter","cetvel","kitap","çanta","makas"],"mevsim":["ilkbahar","yaz","sonbahar","kış"],"meslek":["doktor","öğretmen","aşçı","pilot","çiftçi","polis"],"gezegen":["Merkür","Venüs","Mars","Jüpiter","Satürn"],"çalgı":["saz","keman","davul","ney","piyano","ud"]};
TR.hece=["kalem","okul","kitap","bilgisayar","çiçek","elma","öğretmen","kelebek","ay","su","pencere","tavşan","bahçe","kardeşim","arkadaşlık","göz","çikolata","uçurtma","süt","kurbağa","domates","defter","televizyon","ağaç","kütüphane","gökkuşağı","sandalye","bisiklet","penguen","ördek","yıldız","masa","kulak","dondurma","harita","buzdolabı","türkçe","merdiven","portakal","çanta"];
/* İngilizce kategorilerini hazırla */
const EN=EN_CATS.map(c=>{const w=c[2].split(";").map(x=>x.split("|"));return{t:c[0],en:c[1],w,nopic:/^\d+$/.test(w[0][2])&&c[0]!=="Sayılar 1-20"&&c[0]!=="Onluklar"}});
function enPic(e){const p=e[2];if(!p)return"";if(p[0]==="#")return`<div class="swatch" style="background:${p}"></div>`;if(/^\d+$/.test(p))return`<div class="pic num">${p}</div>`;return`<div class="pic">${p}</div>`}
function enQ(c){const e=pick(c.w),o=shuffle(c.w.filter(x=>x!==e)).slice(0,3),t=c.nopic?rnd(1,2):rnd(0,2);
 if(t===0)return mk("Bu İngilizcede nedir?",e[0],o.map(x=>x[0]),{pic:enPic(e)});
 if(t===1)return mk(`“${e[0]}” ne demektir?`,e[1],o.map(x=>x[1]),{say:e[0],small:true});
 return mk(`“${e[1]}” İngilizcede nasıl söylenir?`,e[0],o.map(x=>x[0]),{small:true})}
