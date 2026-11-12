// HIT TV - Connected to Firebase Cloud
const DB = "https://hit-tv-app-40fb9-default-rtdb.firebaseio.com";
const DEFAULT_CONFIG = {
  liveTitle: "Hit TV Live - Morning Show",
  liveDesc: "Live from Kampala - Hit TV",
  liveUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  channels: [
    { name: "Hit TV Main", desc: "Main Channel", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { name: "Hit News", desc: "News 24/7", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
  ],
  inbox: [{ from: "Hit TV Admin", msg: "Welcome to Hit TV!", time: "Now" }],
  banners: ["https://via.placeholder.com/600x200/122A4F/ffffff?text=HIT+TV+LIVE+EVERY+DAY"],
  songs: [{ title: "Hit Anthem", artist: "Hit TV All Stars", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }]
};

async function loadApp() {
  let cfg = DEFAULT_CONFIG;
  try {
    const res = await fetch(DB + "/config.json");
    const data = await res.json();
    if (data) cfg = data;
    localStorage.setItem('hit_tv_config', JSON.stringify(cfg));
  } catch(e) {
    cfg = JSON.parse(localStorage.getItem('hit_tv_config') || JSON.stringify(DEFAULT_CONFIG));
  }

  document.getElementById('videoTitle').innerText = cfg.liveTitle;
  document.getElementById('videoDesc').innerText = cfg.liveDesc;
  document.getElementById('videoSource').src = cfg.liveUrl;
  document.getElementById('mainVideo').load();

  const row = document.getElementById('channelRow');
  row.innerHTML = '';
  cfg.channels.forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'channel-card' + (i===0?' active':'');
    d.innerHTML = `<b>${c.name}</b><small>${c.desc}</small><br><span>LIVE</span>`;
    d.onclick = () => {
      document.querySelectorAll('.channel-card').forEach(x=>x.classList.remove('active'));
      d.classList.add('active');
      document.getElementById('videoTitle').innerText = c.name + ' - Live';
      document.getElementById('videoSource').src = c.url;
      document.getElementById('mainVideo').load();
      document.getElementById('mainVideo').play();
    };
    row.appendChild(d);
  });

  const inbox = document.getElementById('inboxList');
  inbox.innerHTML = '';
  cfg.inbox.forEach(m=>{
    const d=document.createElement('div'); d.className='inbox-item';
    d.innerHTML=`<div><b>${m.from}:</b> ${m.msg}</div><span>${m.time}</span>`;
    inbox.appendChild(d);
  });

  const banners=document.getElementById('bannerList');
  banners.innerHTML='';
  cfg.banners.forEach(b=>{
    const img=document.createElement('img'); img.src=b; img.className='banner-img'; banners.appendChild(img);
  });

  const list=document.getElementById('songList');
  list.innerHTML='';
  cfg.songs.forEach(s=>{
    const d=document.createElement('div'); d.className='song-item';
    d.innerHTML=`<div><b>${s.title}</b><br><small>${s.artist}</small></div><button onclick="playSong('${s.src}')">Play</button>`;
    list.appendChild(d);
  });
  document.getElementById('commentsList').innerHTML=`<div class="comment"><b>Hit TV:</b> Welcome to live comments</div>`;
}

window.addEventListener('load', ()=>{
  setTimeout(()=>{ document.getElementById('splash').style.display='none'; },2500);
  loadApp();
});
function showTab(name,btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
function addComment(){
  const input=document.getElementById('commentInput'); if(!input.value) return;
  const div=document.createElement('div'); div.className='comment';
  div.innerHTML=`<b>You:</b> ${input.value}`;
  document.getElementById('commentsList').appendChild(div); input.value='';
}
function playSong(src){ const p=document.getElementById('audioPlayer'); p.src=src; p.play(); }
function rateApp(){ alert('Thank you for rating Hit TV!'); }
async function submitArtist(e){
  e.preventDefault();
  const data={
    artist: document.getElementById('artistName').value,
    real: document.getElementById('realName').value,
    phone: document.getElementById('artistPhone').value,
    location: document.getElementById('artistLocation').value,
    genre: document.getElementById('artistGenre').value,
    song: document.getElementById('songTitle').value,
    msg: document.getElementById('artistMsg').value,
    link: document.getElementById('songLink').value,
    date: new Date().toLocaleString()
  };
  await fetch(DB + "/artists.json", { method:"POST", body: JSON.stringify(data) });
  document.getElementById('artistSuccess').innerText = `Submitted! Thank you ${data.artist}. Admin will contact you.`;
  e.target.reset();
}
function updateOnline(){
  const dot=document.getElementById('onlineDot'); const txt=document.getElementById('onlineText');
  if(navigator.onLine){ dot.className='dot online'; txt.innerText='Online'; } else { dot.className='dot offline'; txt.innerText='Offline'; }
}
window.addEventListener('online',updateOnline); window.addEventListener('offline',updateOnline);
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }
