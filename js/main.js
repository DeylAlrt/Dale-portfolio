(function(){
  var d=document,R=false,K=1;
  d.documentElement.classList.add('js');

  // name: one quiet entrance, then still
  var ls=[];d.querySelectorAll('#name .ln>span').forEach(function(w){var t=w.textContent;w.textContent='';t.split('').forEach(function(c){var s=d.createElement('span');s.textContent=c;s.style.display='inline-block';w.appendChild(s);ls.push(s)})});
  {ls.forEach(function(l,i){if(R){l.style.opacity='0';l.style.transition='opacity .8s ease '+(i*50)+'ms'}else{l.style.transform='translateY(100%)';l.style.fontVariationSettings='"wdth" 60';l.style.transition='transform .9s cubic-bezier(.2,.8,.2,1) '+(i*40)+'ms, font-variation-settings 1.2s cubic-bezier(.2,.8,.2,1) '+(200+i*40)+'ms'}});
    requestAnimationFrame(function(){requestAnimationFrame(function(){ls.forEach(function(l){l.style.opacity='';l.style.transform='none';l.style.fontVariationSettings='"wdth" 100'})})});
    setTimeout(function(){ls.forEach(function(l){l.style.transition='font-variation-settings .6s cubic-bezier(.2,.8,.2,1)'})},1900);
    function stretch(area,letters,lo,hi){area.addEventListener('pointermove',function(e){letters.forEach(function(l){var r=l.getBoundingClientRect(),dx=Math.abs(e.clientX-(r.left+r.width/2))/innerWidth;l.style.fontVariationSettings='"wdth" '+Math.round(Math.max(lo,hi-dx*220))})});area.addEventListener('pointerleave',function(){letters.forEach(function(l){l.style.fontVariationSettings='"wdth" 100'})})}
    stretch(d.querySelector('.hero'),ls,75,125);
    var ct=d.getElementById('ct-h'),t=ct.textContent;ct.textContent='';var cls=t.split('').map(function(c){var s=d.createElement('span');s.textContent=c===' '?'\u00a0':c;ct.appendChild(s);return s});ct.setAttribute('aria-label',t);
    stretch(ct,cls,60,140);}

  // halftone: small, slow, and only reacts when the pointer is over it
  var cv=d.getElementById('dots'),cx=cv.getContext('2d'),src=d.createElement('canvas'),sx=src.getContext('2d'),W,H,step=8,data,mx=-999,my=-999,run=false;
  function build(){if(!cv.offsetWidth)return;var dpr=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
    src.width=Math.ceil(W/step);src.height=Math.ceil(H/step);sx.fillStyle='#fff';sx.fillRect(0,0,src.width,src.height);
    var im=d.getElementById('portrait');
    if(im&&im.complete&&im.naturalWidth){var iw=im.naturalWidth,ih=im.naturalHeight,sc=Math.max(src.width/iw,src.height/ih),dw=iw*sc,dh=ih*sc;sx.drawImage(im,(src.width-dw)/2,0,dw,dh)}else{var g=sx.createRadialGradient(src.width*.5,src.height*.62,0,src.width*.5,src.height*.62,src.width*.62);g.addColorStop(0,'rgba(0,0,0,.95)');g.addColorStop(.55,'rgba(0,0,0,.45)');g.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=g;sx.fillRect(0,0,src.width,src.height);}
    var id=sx.getImageData(0,0,src.width,src.height),px=id.data;
    for(var k=0;k<px.length;k+=4){var l=(.299*px[k]+.587*px[k+1]+.114*px[k+2])/255,v=Math.pow(Math.max(0,Math.min(1,(.95-l)/.78)),1.7);px[k]=px[k+1]=px[k+2]=v*255}
    sx.putImageData(id,0,0);
    data=sx.getImageData(0,0,src.width,src.height).data;draw()}
  var T0=performance.now(),heroVisible=true,ambient=!R;
  function draw(){if(!data)return;var t=(performance.now()-T0)/1000;cx.clearRect(0,0,W,H);cx.fillStyle=getComputedStyle(d.documentElement).getPropertyValue('--dots').trim()||'#a8231a';
    var ox=W/2,oy=H*.45,front=R?1e9:t*520,fade=R?Math.min(1,t/1.2):1;
    for(var y=0;y<src.height;y++)for(var x=0;x<src.width;x++){var v=data[(y*src.width+x)*4]/255,px=x*step+step/2,py=y*step+step/2;
      var g=Math.hypot(px-ox,py-oy),intro=Math.max(0,Math.min(1,(front-g)/120));if(!intro)continue;
      var wave=ambient?.09*Math.sin(x*.28+y*.18-t*1.1):0,dd=Math.hypot(px-mx,py-my),n=dd<130?(1-dd/130)*.7:0,r=(v*.9+wave+n)*step*.48*intro*fade;
      if(r>.5){cx.beginPath();cx.arc(px,py,Math.min(r,step*.55),0,6.283);cx.fill()}}
    if(heroVisible&&!d.hidden&&(!R||t<1.3||mx>-999))requestAnimationFrame(draw)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){var was=heroVisible;heroVisible=es[0].isIntersecting;if(heroVisible&&!was)draw()}).observe(d.querySelector('.hero'))}
  var heroEl=d.querySelector('.hero');var idle=true;heroEl.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();var was=mx;mx=e.clientX-r.left;my=e.clientY-r.top;if(R&&was<=-999)draw()});
  heroEl.addEventListener('pointerleave',function(){mx=my=-999});
  addEventListener('resize',build);window.__rebuildDots=function(){build()};(d.fonts&&d.fonts.ready?d.fonts.ready:Promise.resolve()).then(build);var pim=d.getElementById('portrait');if(pim&&!pim.complete)pim.addEventListener('load',build);

  // gentle reveals
  if('IntersectionObserver' in window){var els=[].slice.call(d.querySelectorAll('.rv'));els.forEach(function(el){if(el.getBoundingClientRect().top>innerHeight*.95)el.classList.add('pre')});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}

  // skill demos: run on hover only
  var c=0,cl=d.getElementById('clicks');d.getElementById('clickbtn').addEventListener('click',function(){cl.textContent=++c});
  var hb=d.getElementById('hire');hb.addEventListener('click',function(){hb.textContent='Thanks';setTimeout(function(){hb.textContent='Hire Dale'},1400)});
  function onHover(el,start,stop){var t;el.addEventListener('pointerenter',function(){start();t=setInterval(start,1200)});el.addEventListener('pointerleave',function(){clearInterval(t);stop&&stop()})}
  var rs=[].slice.call(d.querySelectorAll('#routes div')).slice(1),ri=0;
  onHover(d.getElementById('cell-next'),function(){rs.forEach(function(x){x.classList.remove('on')});ri=(ri+1)%rs.length;rs[ri].classList.add('on')});
  var calls=[['GET /api/items','200 OK','[ 4 items ]'],['POST /api/claims','201 Created','{ "ok": true }'],['POST /api/auth/login','200 OK','{ "token": "eyJ…" }']],ci=0,req=d.getElementById('req'),st=d.getElementById('st'),res=d.getElementById('res');
  onHover(d.getElementById('cell-api'),function(){ci=(ci+1)%calls.length;var k=calls[ci];req.textContent=k[0];st.textContent='…';res.textContent='';setTimeout(function(){st.textContent=k[1];res.textContent=k[2]},350)});

  // live embeds: load when near, shield so page scroll isn't trapped
  var canEmbed=!/(^|\.)claude\.ai$|claudeusercontent|anthropic/.test(location.hostname);
  d.querySelectorAll('[data-embed]').forEach(function(em){
    var fr=em.querySelector('iframe'),url=em.querySelector('.e-url'),open=em.querySelector('.e-open'),offA=em.querySelector('.e-off a'),view=em.querySelector('.e-view'),sh=em.querySelector('.e-shield span'),poster=em.querySelector('.e-poster');
    em.classList.add('idle');sh.textContent='Load live preview';
    if(!canEmbed)em.classList.add('blocked');
    function load(){if(canEmbed&&!fr.src){fr.src=fr.dataset.src;em.classList.remove('idle');sh.textContent='Click to use'}}
    function unload(){if(fr.src){fr.removeAttribute('src');em.classList.add('idle');em.classList.remove('active');sh.textContent='Load live preview'}}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){if(!es[0].isIntersecting)unload()},{rootMargin:'150% 0px'}).observe(em);
    em.querySelector('.e-shield').addEventListener('click',function(){var first=!fr.src;load();if(!first)em.classList.add('active')});
    view.addEventListener('mouseleave',function(){em.classList.remove('active')});
    em.querySelectorAll('.e-tabs button').forEach(function(b){b.addEventListener('click',function(){em.querySelectorAll('.e-tabs button').forEach(function(x){x.classList.toggle('on',x===b)});url.textContent=b.dataset.url;open.href=b.dataset.open;offA.href=b.dataset.open;fr.dataset.src=b.dataset.src;if(poster&&b.dataset.poster)poster.src=b.dataset.poster;if(fr.src)fr.src=b.dataset.src})});
  });

  // résumé links: hidden until Dale-Alerta-Resume.pdf is in the folder, so nobody hits a broken link
  (function(){var rl=[].slice.call(d.querySelectorAll('[data-resume]'));if(!rl.length)return;rl.forEach(function(a){a.hidden=true});
    fetch('Dale-Alerta-Resume.pdf',{method:'HEAD'}).then(function(r){if(r.ok&&(r.headers.get('content-type')||'').indexOf('text/html')<0)rl.forEach(function(a){a.hidden=false})}).catch(function(){})})();

  var cp=d.getElementById('copy'),cpt=d.getElementById('copy-t');cp.addEventListener('click',function(){function done(m){cpt.textContent=m;setTimeout(function(){cpt.textContent='Copy'},1600)}
    try{navigator.clipboard.writeText('alertadale2@gmail.com').then(function(){done('Copied');cp.classList.add('ok');setTimeout(function(){cp.classList.remove('ok')},1600)},function(){done('Select it')})}catch(e){done('Select it')}});

  // ---- richer motion (fades only when reduced motion is on) ----
  {
    var below=function(el){return el.getBoundingClientRect().top>innerHeight*.9};
    var once=function(el,cls,fn,th){if(!below(el)){fn&&fn();return}el.classList.add(cls);var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){el.classList.remove(cls);fn&&fn();o.disconnect()}},{threshold:th||.2});o.observe(el)};
    // headings outside Work
    d.querySelectorAll('.h2:not(#work-h)').forEach(function(h){h.classList.remove('rv','pre');var t=h.textContent;h.innerHTML='<span class="m"><span></span></span>';h.querySelector('.m>span').textContent=t;h.classList.add('sp');once(h,'pre2')});
    // experience + skills stagger
    d.querySelectorAll('.rows .row').forEach(function(r,i){r.style.setProperty('--k',i)});
    var rows=d.querySelector('.rows');rows.classList.remove('rv','pre');once(rows,'pre3');
    d.querySelectorAll('.skills-grid .cell').forEach(function(c,i){c.style.setProperty('--k',i)});
    var sg=d.querySelector('.skills-grid');sg.classList.remove('rv','pre');
    once(sg,'pre3',function(){setTimeout(function(){d.querySelectorAll('.skills-grid .cell').forEach(function(c){c.dispatchEvent(new Event('pointerenter'));setTimeout(function(){c.dispatchEvent(new Event('pointerleave'))},1500)})},700)});
    // about: word-by-word as it scrolls
    var aw=[];d.querySelectorAll('.about .wrap>div>p').forEach(function(p){var w=p.textContent.split(' ');p.textContent='';w.forEach(function(x,i){var s=d.createElement('span');s.className='w';s.textContent=x+(i<w.length-1?' ':'');p.appendChild(s);aw.push(s)})});
    var about=d.querySelector('.about'),contact=d.getElementById('contact'),cbig=d.getElementById('ct-h');
    once(contact,'pre3',null,.35);
    function scrollFx(){
      var r=about.getBoundingClientRect(),p=(innerHeight*.85-r.top)/(r.height*.7+innerHeight*.2);p=Math.max(0,Math.min(1,p));
      var n=Math.round(p*aw.length);aw.forEach(function(s,i){s.classList.toggle('lit',i<n)});
      var c=contact.getBoundingClientRect(),q=Math.max(0,Math.min(1,(innerHeight-c.top)/(innerHeight*.75)));
      
    }
    addEventListener('scroll',scrollFx,{passive:true});scrollFx();
    // magnetic buttons
    if(matchMedia('(pointer:fine)').matches){d.querySelectorAll('.btn,.c-row button,.c-row a').forEach(function(b){b.classList.add('mag');
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.35).toFixed(1)+'px)'});
      b.addEventListener('pointerleave',function(){b.style.transform=''})})}
  }

  // ---- scroll-driven motion (positions measured once, maths only while scrolling) ----
  var clamp1=function(v){return v<0?0:v>1?1:v};
  function docTop(el){var t=0;while(el){t+=el.offsetTop;el=el.offsetParent}return t}
  function put(el,prop,val){var k='_'+prop;if(el[k]===val)return;el[k]=val;if(prop.charAt(0)==='-')el.style.setProperty(prop,val);else el.style[prop]=val}
  var lines=[].slice.call(d.querySelectorAll('#name .ln>span')),heroBits=[d.querySelector('.role'),d.querySelector('.hero .acts'),d.querySelector('.hero .now')],actorEl=d.getElementById('actor');
  var heads=[].slice.call(d.querySelectorAll('.h2:not(#work-h)')),panels=[].slice.call(d.querySelectorAll('.panel'));
  var rowEls=[].slice.call(d.querySelectorAll('.rows .row')),cells=[].slice.call(d.querySelectorAll('.skills-grid .cell')),grid=d.querySelector('.skills-grid');
  var band=d.querySelector('.band'),b1=band.querySelector('.b1 span'),story=d.getElementById('story'),sls=[].slice.call(d.querySelectorAll('.story .sl')),ctc=d.getElementById('contact'),lap=d.getElementById('lap'),lapIn=lap.querySelector('.lap-in'),big=d.getElementById('ct-h'),pg=d.getElementById('progress');
  var wide=matchMedia('(min-width:861px)'),H=innerHeight,M={},maxScroll=1,cFrom=[11,11,11],cTo=[125,25,18];
  function hex(c){c=c.trim();if(c[0]!=='#')return [11,11,11];if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return [1,3,5].map(function(i){return parseInt(c.substr(i,2),16)})}
  function colours(){var cs=getComputedStyle(d.documentElement);cFrom=hex(cs.getPropertyValue('--black'));cTo=hex(cs.getPropertyValue('--red-field'));story._background=null;frame()}
  window.__refreshColours=colours;
  function box(el){return {t:docTop(el),h:el.offsetHeight}}
  function measure(){H=innerHeight;maxScroll=Math.max(1,d.documentElement.scrollHeight-H);
    M.heads=heads.map(box);M.rows=rowEls.map(box);M.grid=box(grid);M.band=box(band);M.story=box(story);M.lap=box(lap);M.ctc=box(ctc);M.panels=panels.map(box);colours()}
  var prog=function(b,y){return (H-(b.t-y))/(H+b.h)};
  var near=function(b,y){return b.t-y<H*1.6&&b.t+b.h-y>-H*.6};
  function frame(){var y=window.lenis?lenis.scroll:scrollY;if(!M.story)return;
    put(pg,'transform','scaleX('+(y/maxScroll).toFixed(4)+')');
    // story fill + background
    var st=M.story;if(near(st,y)){var p=clamp1((-(st.t-y)+H*.15)/(st.h-H*.7)),fp=clamp1(p/.78);
      sls.forEach(function(l,i){put(l,'--f',(clamp1(fp*sls.length-i)*100).toFixed(1)+'%')});
      var bg=clamp1((p-.74)/.26);put(story,'background','rgb('+cFrom.map(function(v,i){return Math.round(v+(cTo[i]-v)*bg)}).join(',')+')');
      var on=bg>.25;if(on!==story._on){story._on=on;story.classList.toggle('onred',on)}}
    if(!K)return;
    // hero
    if(y<H*1.2){var hp=clamp1(y/(H*.9));
      put(lines[0],'translate',(-hp*16).toFixed(2)+'vw 0');put(lines[1],'translate',(hp*12).toFixed(2)+'vw 0');
      heroBits.forEach(function(b,i){put(b,'translate','0 '+(-hp*(50+i*30)).toFixed(1)+'px');put(b,'opacity',(1-hp*.9).toFixed(3))});
      put(actorEl,'translate',(hp*60).toFixed(1)+'px '+(hp*90).toFixed(1)+'px')}
    heads.forEach(function(h,i){var b=M.heads[i];if(!near(b,y))return;var x=clamp1((.42-prog(b,y))/.42)*10;put(h,'translate',x.toFixed(2)+'vw 0')});
    // stacking panels
    if(wide.matches)panels.forEach(function(pn,i){var b=M.panels[i];if(!near({t:b.t,h:b.h+H},y))return;
      var nx=M.panels[i+1],t=nx?clamp1(1-(nx.t-y)/H):0,own=clamp1(1-(b.t-y)/H);
      put(pn,'scale',(1-.07*t).toFixed(4));put(pn,'--dim',(t*.65).toFixed(3));
      put(pn._sd||(pn._sd=pn.querySelector('.p-side')),'translate','0 '+((1-own)*70).toFixed(1)+'px');
      put(pn._em||(pn._em=pn.querySelector('.embed')),'translate','0 '+((1-own)*130).toFixed(1)+'px')});
    rowEls.forEach(function(r,i){var b=M.rows[i];if(!near(b,y))return;put(r,'translate',(clamp1((.32-prog(b,y))/.32)*(70+i*22)).toFixed(1)+'px 0')});
    if(near(M.grid,y)){var gp=prog(M.grid,y),w=wide.matches;cells.forEach(function(c,i){var col=w?i%3:i%2;put(c,'translate','0 '+((.5-gp)*(col-(w?1:.5))*90).toFixed(1)+'px')})}
    if(near(M.band,y))put(b1,'translate',(-clamp1(prog(M.band,y))*38).toFixed(2)+'vw 0');
    if(near(M.lap,y)){var lp=clamp1((H-(M.lap.t-y))/(H*.8)),re=1-Math.pow(1-clamp1(lp/.62),3);
      put(lapIn,'--rise',((1-re)*100).toFixed(2)+'%');var wv=lp>.8;if(wv!==lap.classList.contains('s2'))lap.classList.toggle('s2',wv)}
    if(near(M.ctc,y)){var q=clamp1((H-(M.ctc.t-y))/(H*.8));put(big,'scale',(1-.18*(1-q)).toFixed(4))}
  }
  var lenis=null;
  if(!R&&window.Lenis&&matchMedia('(pointer:fine)').matches){lenis=new Lenis({lerp:.09,smoothWheel:true});window.lenis=lenis;lenis.on('scroll',frame);(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
    d.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');var t=id==='#top'?0:d.querySelector(id);if(t===null)return;e.preventDefault();lenis.scrollTo(t,{offset:id==='#top'?0:-64,duration:1.4})})})}
  else{var queued=false;addEventListener('scroll',function(){if(!queued){queued=true;requestAnimationFrame(function(){queued=false;frame()})}},{passive:true})}
  var mt;function remeasure(){clearTimeout(mt);mt=setTimeout(function(){measure();frame()},120)}
  addEventListener('resize',remeasure);addEventListener('load',remeasure);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(remeasure);
  if('ResizeObserver' in window)new ResizeObserver(remeasure).observe(d.body);
  measure();frame();
  // nav: mark the section you're in
  var links={};d.querySelectorAll('.top nav a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){var no=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){for(var k in links)links[k].classList.toggle('cur',k===e.target.id)}})},{rootMargin:'-45% 0px -50% 0px'});
    ['work','experience','skills','contact'].forEach(function(id){var el=d.getElementById(id);el&&no.observe(el)})}

  // ---------- editor layer ----------
  (function(){
    var html=d.documentElement,board=d.getElementById('board'),sel=d.getElementById('sel'),selL=d.getElementById('sel-l'),hint=d.getElementById('tb-hint'),tool='none',NS='http://www.w3.org/2000/svg';
    var fine=matchMedia('(pointer:fine) and (min-width:861px)').matches;
    function sizeBoard(){board.setAttribute('height',d.documentElement.scrollHeight);board.style.height=d.documentElement.scrollHeight+'px'}
    sizeBoard();addEventListener('resize',sizeBoard);setTimeout(sizeBoard,1500);
    function accent(){return getComputedStyle(html).getPropertyValue('--red').trim()}
    function hideHint(){hint.classList.add('gone')}
    setTimeout(hideHint,5000);
    // tools
    var btns=[].slice.call(d.querySelectorAll('.tb [data-tool]'));
    function setTool(t){tool=t;btns.forEach(function(b){b.classList.toggle('on',b.dataset.tool===t);b.setAttribute('aria-pressed',String(b.dataset.tool===t))});board.classList.toggle('drawing',t==='rect'||t==='ellipse'||t==='pen');html.classList.toggle('tool-move',t==='move');hideHint();if(t!=='move'){pick(null);sel.classList.remove('on')}else if(window.__placeSel)window.__placeSel()}
    btns.forEach(function(b){b.addEventListener('click',function(){setTool(tool===b.dataset.tool?'none':b.dataset.tool)})});
    addEventListener('keydown',function(e){if(e.target.closest('input,textarea,[contenteditable]'))return;var k=e.key.toLowerCase();
      if(k==='v')setTool(tool==='move'?'none':'move');else if(k==='r')setTool('rect');else if(k==='o')setTool('ellipse');else if(k==='p')setTool('pen');else if(k==='escape'){setTool('none');pick(null)}
      else if((k==='delete'||k==='backspace')&&picked){picked.remove();picked=null}});
    d.getElementById('tb-clear').addEventListener('click',function(){board.innerHTML='';picked=null});
    // drawing
    var cur=null,sx=0,sy=0,pts=[];
    board.addEventListener('pointerdown',function(e){if(!(tool==='rect'||tool==='ellipse'||tool==='pen')||e.button!==0)return;e.preventDefault();board.setPointerCapture(e.pointerId);sx=e.pageX;sy=e.pageY;var c=accent();
      if(tool==='pen'){cur=d.createElementNS(NS,'path');cur.setAttribute('fill','none');cur.setAttribute('stroke',c);cur.setAttribute('stroke-width','4');cur.setAttribute('stroke-linecap','round');cur.setAttribute('stroke-linejoin','round');pts=[[sx,sy]]}
      else{cur=d.createElementNS(NS,tool==='rect'?'rect':'ellipse');cur.setAttribute('fill',c);cur.setAttribute('fill-opacity','.9')}
      cur.classList.add('shape');board.appendChild(cur)});
    board.addEventListener('pointermove',function(e){if(!cur)return;var x=e.pageX,y=e.pageY;
      if(tool==='pen'){pts.push([x,y]);cur.setAttribute('d','M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1)}).join(' L'))}
      else if(tool==='rect'){cur.setAttribute('x',Math.min(sx,x));cur.setAttribute('y',Math.min(sy,y));cur.setAttribute('width',Math.abs(x-sx));cur.setAttribute('height',Math.abs(y-sy))}
      else{cur.setAttribute('cx',(sx+x)/2);cur.setAttribute('cy',(sy+y)/2);cur.setAttribute('rx',Math.abs(x-sx)/2);cur.setAttribute('ry',Math.abs(y-sy)/2)}});
    board.addEventListener('pointerup',function(){if(!cur)return;var b=cur.getBBox(),drawn=tool;if(b.width<4&&b.height<4)cur.remove();else{wireShape(cur);setTool('move');pick(cur)}cur=null});
    // shape select + drag
    var picked=null;function pick(el){if(picked)picked.classList.remove('picked');picked=el;if(el)el.classList.add('picked')}
    function wireShape(el){var ox=0,oy=0,px,py,on=false;el.addEventListener('pointerdown',function(e){if(tool!=='move')return;e.stopPropagation();e.preventDefault();pick(el);on=true;px=e.pageX;py=e.pageY;el.setPointerCapture(e.pointerId)});
      el.addEventListener('pointermove',function(e){if(!on)return;ox+=e.pageX-px;oy+=e.pageY-py;px=e.pageX;py=e.pageY;el.setAttribute('transform','translate('+ox+' '+oy+')')});
      el.addEventListener('pointerup',function(){on=false})}
    d.addEventListener('pointerdown',function(e){if(picked&&!e.target.closest('.shape,.tb,.dp'))pick(null)});
    // draggable text layers
    d.querySelectorAll('.dg').forEach(function(el){var dx=0,dy=0,px,py,on=false,moved=false;
      el.addEventListener('pointerdown',function(e){if(!fine||tool!=='move'||e.button!==0)return;on=true;moved=false;px=e.clientX;py=e.clientY;el.setPointerCapture(e.pointerId);el.classList.add('dragging');hideHint()});
      el.addEventListener('pointermove',function(e){if(!on)return;dx+=e.clientX-px;dy+=e.clientY-py;px=e.clientX;py=e.clientY;moved=true;el.style.transform='translate('+dx+'px,'+dy+'px)'});
      ['pointerup','pointercancel'].forEach(function(t){el.addEventListener(t,function(){on=false;el.classList.remove('dragging')})});
      el.addEventListener('dblclick',function(){dx=dy=0;el.style.transform=''})});
    // hover frames
    if(fine){var target=null,isText=false;
      function place(){if(!target||tool!=='move'){sel.classList.remove('on');return}var r=target.getBoundingClientRect();
        sel.style.left=r.left+'px';sel.style.top=Math.max(r.top,64)+'px';sel.style.width=r.width+'px';sel.style.height=Math.max(0,r.bottom-Math.max(r.top,64))+'px';
        selL.textContent=target.dataset.layer||target.dataset.frame;selL.textContent+=isText?'':'  '+Math.round(r.width)+' × '+Math.round(r.height);sel.classList.add('on');requestAnimationFrame(place)}
      window.__placeSel=function(){place()};
      d.querySelectorAll('[data-frame],[data-layer]').forEach(function(el){el.addEventListener('pointerenter',function(){var was=target;target=el;isText=!!el.dataset.layer;if(!was)place()});
        el.addEventListener('pointerleave',function(e){var to=e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('[data-layer],[data-frame]');target=to||null})})}
    // design panel
    var dp=d.getElementById('dp'),db=d.getElementById('tb-design');
    function togglePanel(open){dp.hidden=!open;db.setAttribute('aria-expanded',String(open));db.classList.toggle('on',open)}
    db.addEventListener('click',function(){togglePanel(dp.hidden)});d.getElementById('dp-x').addEventListener('click',function(){togglePanel(false)});
    var state={theme:'black',accent:'oxblood',font:'anybody'};
    var accents={oxblood:['#b3241a','#d0564c','#7d1912','#a8231a'],red:['#e10600','#ff4d42','#c40500','#e10600'],mono:['#f3f1ed','#f3f1ed','#1d1c1b','#6f6a64']};
    var fonts={anybody:'"Anybody","Arial Narrow",Impact,sans-serif',fraunces:'"Fraunces",Georgia,serif',bricolage:'"Bricolage Grotesque","Arial Narrow",sans-serif'};
    function apply(){var st=html.style;html.classList.toggle('paper',state.theme==='paper');var a=accents[state.accent].slice();
      if(state.theme==='paper'){if(state.accent==='mono')a=['#141312','#141312','#141312','#8d877f'];else a[1]=a[0]}
      st.setProperty('--red',a[0]);st.setProperty('--red-text',a[1]);st.setProperty('--red-field',a[2]);st.setProperty('--dots',a[3]);st.setProperty('--display',fonts[state.font]);
      d.querySelectorAll('.dp [data-k]').forEach(function(g){g.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.v===state[g.dataset.k])})});
      if(window.__rebuildDots)window.__rebuildDots();if(window.__refreshColours)window.__refreshColours()}
    d.querySelectorAll('.dp [data-k] button').forEach(function(b){b.addEventListener('click',function(){state[b.parentNode.dataset.k]=b.dataset.v;apply()})});
    d.getElementById('dp-reset').addEventListener('click',function(){state={theme:'black',accent:'oxblood',font:'anybody'};apply()});
  })();

  // hero frames: slide in (frame 1), then pose (frame 2)
  (function(){var a=d.getElementById('actor'),im=[].slice.call(a.querySelectorAll('img'));
    /* wait until both photos are decoded so neither frame flashes blank, then slide in and snap */
    Promise.all(im.map(function(i){return i.decode?i.decode().catch(function(){}):0})).then(function(){
      requestAnimationFrame(function(){a.classList.add('in');setTimeout(function(){a.classList.add('s2')},800)})})})();
})();
