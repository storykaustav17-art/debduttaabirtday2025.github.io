// script.js - animations and interactions
const revealBtn = document.getElementById('revealBtn');
const card = document.getElementById('card');
const bg = document.getElementById('bg');
const gallery = document.getElementById('gallery');
const mainPhoto = document.getElementById('mainPhoto');
const playMusic = document.getElementById('playMusic');
const bgm = document.getElementById('bgm');

revealBtn.addEventListener('click', () => {
  card.classList.remove('hidden');
  revealBtn.disabled = true;
  revealBtn.style.transform = 'scale(.98)';
  // gentle pop of the main photo
  mainPhoto.style.transform = 'translateY(-6px) scale(1.02)';
  startConfetti();
});

// gallery click
gallery?.addEventListener('click', (e) => {
  if(e.target.tagName === 'IMG'){
    mainPhoto.src = e.target.src;
    mainPhoto.style.transform = 'translateY(-6px) scale(1.02)';
    setTimeout(()=> mainPhoto.style.transform = '', 900);
  }
});

// music toggle
playMusic?.addEventListener('click', () => {
  if(bgm.paused){
    bgm.play().catch(()=>{});
    playMusic.textContent = 'Pause Music';
  } else {
    bgm.pause();
    playMusic.textContent = 'Play Music';
  }
});

// canvas background - gentle floating orbs
const ctx = bg.getContext('2d');
let w, h, blobs=[];
function resize(){ w=bg.width = innerWidth; h=bg.height=innerHeight; blobs=[]; for(let i=0;i<8;i++) blobs.push(new Blob()); }
function rnd(a,b){return a + Math.random()*(b-a)}
class Blob{
  constructor(){
    this.x = rnd(0,w); this.y=rnd(0,h);
    this.r = rnd(80,220); this.vx = rnd(-0.2,0.2); this.vy = rnd(-0.1,0.1);
    this.c = `hsla(${rnd(280,330)},80%,60%,0.06)`;
  }
  step(){
    this.x += this.vx; this.y += this.vy;
    if(this.x<-300) this.x=w+300; if(this.x>w+300) this.x=-300;
    if(this.y<-300) this.y=h+300; if(this.y>h+300) this.y=-300;
    ctx.beginPath(); let g = ctx.createRadialGradient(this.x,this.y,this.r*0.1,this.x,this.y,this.r);
    g.addColorStop(0,this.c); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
  }
}
function loop(){ ctx.clearRect(0,0,w,h); for(let b of blobs) b.step(); requestAnimationFrame(loop); }
resize(); loop();
addEventListener('resize', resize);

// lightweight confetti
function startConfetti(){
  const container = document.createElement('div');
  container.className='confetti';
  document.body.appendChild(container);
  for(let i=0;i<80;i++){
    const el = document.createElement('div');
    el.className='c';
    el.style.left = Math.random()*100 + '%';
    el.style.background = `hsl(${Math.random()*360},70%,60%)`;
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    container.appendChild(el);
    // fall
    el.animate([
      {transform:el.style.transform, top:'-10vh', opacity:1},
      {transform: `translateY(${100+Math.random()*30}vh) rotate(${Math.random()*720}deg)`, top:'110vh', opacity:0.8}
    ], {duration:3000+Math.random()*3000, easing:'cubic-bezier(.2,.6,.2,1)'});
    setTimeout(()=> el.remove(), 6500);
  }
  setTimeout(()=> container.remove(),7000);
}

/* add small CSS for confetti via JS to keep single file */
const css = document.createElement('style');
css.textContent = `.confetti{position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:9999}
.c{position:absolute;width:10px;height:16px;border-radius:2px;opacity:0.95}`;
document.head.appendChild(css);
