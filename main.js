const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const F=["assets/images/video-still-1.jpg","assets/images/video-still-2.jpg","assets/images/video-still-3.jpg","assets/images/video-still-4.jpg","assets/images/skyline-penthouse.jpg","assets/images/garden-residence.jpg","assets/images/terrace-residence.jpg","assets/images/balcony-bedroom.jpg","assets/images/twin-room.jpg","assets/images/palm-view-room.jpg","assets/images/city-view-room.jpg"],DAY=864e5,T0=new Date();T0.setHours(0,0,0,0);
const ds=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10),pd=s=>new Date(s+'T00:00'),fmt=d=>d.toLocaleDateString('en',{day:'numeric',month:'short'});
const L=[
{n:'The Meridian Penthouse',loc:'Dubai Marina',t:'apartment',b:'3 bedrooms',g:6,a:240,p:890,f:4,x:'50% 50%',bk:[[3,9],[20,26]]},
{n:'Atelier Loft',loc:'Milan, Brera',t:'apartment',b:'2 bedrooms',g:4,a:140,p:520,f:1,x:'40% 50%',bk:[[6,12]]},
{n:'Harbour Suite',loc:'Lisbon, Alfama',t:'apartment',b:'2 bedrooms',g:4,a:118,p:460,f:6,x:'50% 50%',bk:[[1,5],[14,19]]},
{n:'Garden Terrace Residence',loc:'Copenhagen, Nørrebro',t:'apartment',b:'3 bedrooms',g:6,a:176,p:640,f:5,x:'50% 50%',bk:[[10,16]]},
{n:'Linen Room',loc:'Lisbon, Chiado',t:'room',b:'1 bedroom',g:2,a:32,p:160,f:8,x:'50% 50%',bk:[[2,6],[18,22]]},
{n:'Skyline Room',loc:'Dubai Marina',t:'room',b:'1 bedroom',g:2,a:38,p:210,f:10,x:'50% 50%',bk:[[8,11]]},
{n:'Courtyard Room',loc:'Milan, Navigli',t:'room',b:'1 bedroom',g:3,a:30,p:140,f:9,x:'50% 50%',bk:[]},
{n:'Library Room',loc:'Copenhagen, Indre By',t:'room',b:'1 bedroom',g:2,a:34,p:185,f:7,x:'50% 50%',bk:[[4,8]]}];
const ph=l=>`<div style="height:210px;background:url(${F[l.f]}) center/cover"></div>`,free=(l,i,o)=>l.bk.every(([s,e])=>o<=+T0+s*DAY||i>=+T0+e*DAY);
let flt='all',range=null,gst=1,user=null;
const ci=$('#ci'),co=$('#co'),gs=$('#gs');
ci.min=ds(T0);ci.value=ds(new Date(+T0+30*DAY));co.value=ds(new Date(+T0+33*DAY));
gs.innerHTML=[1,2,3,4,5,6].map(n=>`<option value="${n}">${n} guest${n>1?'s':''}</option>`).join('');gs.value=2;
ci.onchange=()=>{co.min=ci.value;if(co.value<=ci.value)co.value=ds(new Date(+pd(ci.value)+DAY))};co.min=ci.value;
function render(){
 const list=L.map((l,i)=>({...l,i})).filter(l=>(flt=='all'||l.t==flt)&&l.g>=gst&&(!range||free(l,range[0],range[1])));
 $('#note').innerHTML=range?`Free ${fmt(range[0])} to ${fmt(range[1])} for ${gst} guest${gst>1?'s':''} · ${list.length} found <button id="clr">Clear dates</button>`:`${list.length} stays`;
 if(range)$('#clr').onclick=()=>{range=null;gst=1;render()};
 $('#grid').innerHTML=list.length?list.map(l=>`<article class="card"><div class="ph"><span class="tag">${l.t=='room'?'Room':'Apartment'}</span><div style="background-image:url(${F[l.f]});background-position:${l.x}"></div></div><div class="cb"><h3>${l.n}</h3><small>${l.loc}</small><small>${l.b} · ${l.a} m² · sleeps ${l.g}</small><div class="pr"><b>$${l.p} <span>/ night</span></b><button class="btn" data-id="${l.i}">Reserve</button></div></div></article>`).join(''):'<div class="empty">Nothing is free for those dates. Try shifting by a few days or choosing fewer guests.</div>';
 $$('[data-id]').forEach(b=>b.onclick=()=>book(+b.dataset.id));
 $$('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.f==flt));
}
$$('.chip').forEach(c=>c.onclick=()=>{flt=c.dataset.f;render()});
$$('[data-f]:not(.chip)').forEach(a=>a.addEventListener('click',()=>{flt=a.dataset.f;render()}));
$('#chk').onclick=()=>{const i=pd(ci.value),o=pd(co.value);if(!(o>i))return toast('Choose a check-out after check-in');range=[i,o];gst=+gs.value;flt='all';render();$('#stays').scrollIntoView({behavior:'smooth'})};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),3200)}
function book(id){
 const l=L[id],opts=Array.from({length:l.g},(_,k)=>`<option ${k+1==Math.min(gst||2,l.g)?'selected':''}>${k+1}</option>`).join('');
 $('#mc').innerHTML=ph(l)+`<div class="mb"><h3>${l.n}</h3><small style="color:var(--mut);margin-top:-8px">${l.loc} · $${l.p} per night</small>
 <div class="r2"><label>Check in<input class="in" type="date" id="bi" min="${ds(T0)}" value="${ci.value}"></label><label>Check out<input class="in" type="date" id="bo" value="${co.value}"></label></div>
 <label>Guests<select class="in" id="bg2">${opts}</select></label>
 <div class="r2"><label>Full name<input class="in" id="bn" value="${user||''}" autocomplete="name"></label><label>Email<input class="in" id="be" type="email" autocomplete="email"></label></div>
 <div class="tot" id="tot"></div><div class="err" id="err" role="alert"></div><button class="btn" id="go" style="justify-content:center;background:var(--pine);color:#f3f1ea">Confirm reservation</button></div>`;
 const calc=()=>{const i=pd($('#bi').value),o=pd($('#bo').value),n=Math.round((o-i)/DAY),ok=n>0;let e='';
  if(!ok)e='Check-out must be after check-in.';else if(!free(l,i,o))e='Those dates are taken. Pick other dates.';
  const s=ok?l.p*n:0,f=Math.round(s*.08);$('#err').textContent=e;$('#go').disabled=!!e;
  $('#tot').innerHTML=ok?`<div><span>$${l.p} × ${n} night${n>1?'s':''}</span><span>$${s}</span></div><div><span>Service fee</span><span>$${f}</span></div><div class="g"><span>Total</span><span>$${s+f}</span></div>`:''};
 ['bi','bo'].forEach(k=>$('#'+k).onchange=calc);calc();
 $('#go').onclick=()=>{const nm=$('#bn').value.trim(),em=$('#be');if(!nm||!em.checkValidity()||!em.value)return $('#err').textContent='Add your name and a valid email.';
  const ref='DRM-'+Math.random().toString(36).slice(2,8).toUpperCase();
  $('#mc').innerHTML=ph(l)+`<div class="mb"><h3>You are booked, ${nm.split(' ')[0]}.</h3><p style="margin:0">${l.n}, ${fmt(pd($('#bi').value))} to ${fmt(pd($('#bo').value))}. A confirmation is on its way to ${em.value}.</p><div class="tot"><div><span>Reference</span><b>${ref}</b></div></div><button class="btn" onclick="m.close()" style="justify-content:center;background:var(--pine);color:#f3f1ea">Done</button></div>`;
  l.bk.push([Math.round((pd($('#bi').value)-T0)/DAY),Math.round((pd($('#bo').value)-T0)/DAY)]);render()};
 m.showModal();
}
$$('[data-book]').forEach(b=>b.onclick=()=>{$('#stays').scrollIntoView({behavior:'smooth'});toast('Choose a stay and tap Reserve')});
$('#si').onclick=()=>{$('#links').classList.remove('o');$('#mc').innerHTML=`<div class="mb"><h3>${user?'Hello, '+user:'Welcome back'}</h3><label>Name<input class="in" id="sn" placeholder="Your name"></label><label>Email<input class="in" type="email" placeholder="you@email.com"></label><label>Password<input class="in" type="password"></label><button class="btn" id="sg" style="justify-content:center;background:var(--pine);color:#f3f1ea">Sign in</button></div>`;
 $('#sg').onclick=()=>{user=$('#sn').value.trim()||'guest';$('#si').textContent='Hi, '+user.split(' ')[0];m.close();toast('Signed in')};m.showModal()};
$('#cf').onsubmit=e=>{e.preventDefault();e.target.reset();toast('Message sent. We will reply soon.')};
const bgb=$('#bg'),lk=$('#links');bgb.onclick=()=>{const o=lk.classList.toggle('o');bgb.classList.toggle('x',o);bgb.setAttribute('aria-expanded',o)};
lk.addEventListener('click',e=>{if(e.target.closest('a,button')){lk.classList.remove('o');bgb.classList.remove('x')}});
// scroll-controlled video
const v=$('#v'),hero=$('#hero'),chs=$$('.ch'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;let cur=0;
const unlock=()=>v.play().then(()=>v.pause()).catch(()=>{});v.addEventListener('loadeddata',unlock,{once:true});addEventListener('touchstart',unlock,{once:true,passive:true});
const mm=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function tick(){
 const r=hero.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(hero.offsetHeight-innerHeight))),d=v.duration||10;
 cur+=(p*d-cur)*(RM?1:.12);
 if(v.readyState>1&&Math.abs(v.currentTime-cur)>.02&&!v.seeking)v.currentTime=cur;
 chs.forEach((c,i)=>c.classList.toggle('on',p>=i/3&&(p<(i+1)/3||i==2)));
 $('#ri').style.height=p*100+'%';$('#tc').textContent=mm(cur)+' / '+mm(d);$('#cue').style.opacity=p>.03?0:1;
 $('#nav').classList.toggle('s',scrollY>40);requestAnimationFrame(tick)}
render();tick();