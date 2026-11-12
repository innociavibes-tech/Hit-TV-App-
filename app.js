const DB = "https://hit-tv-app-40fb9-default-rtdb.firebaseio.com";
const DEFAULT_CONFIG = { liveTitle:"Hit TV Live", liveDesc:"Live from Kampala", liveUrl:"", liveType:"youtube", programmes:[{name:"Morning Show", time:"7:00 AM - 9:00 AM"}], inbox:[{from:"Hit TV Admin", msg:"Welcome to Hit TV!", time:"Now"}], banners:[], songs:[], nowPlaying:-1 };
async function loadApp(){
  let cfg = DEFAULT_CONFIG;
  try{ const res=await fetch(DB+"/config.json"); const data=await res.json(); if(data) cfg=data; localStorage.setItem('hit_tv_config', JSON.stringify(cfg)); }catch(e){ cfg=JSON.parse(localStorage.getItem('hit_tv_config')||JSON.stringify(DEFAULT_CONFIG)); }
  document.getElementById('videoTitle').innerText = cfg.liveTitle;
  document.getElementById('videoDesc').innerText = cfg.liveDesc;
  const row=document.getElementById('channelRow');
  if(row){ row.innerHTML=''; cfg.programmes.forEach(p=>{ const d=document.createElement('div'); d.className='channel-card'; d.innerHTML=`<b>${p.name}</b><small>${p.time}</small><br><span>PROGRAMME</span>`; row.appendChild(d); }); }
  const inbox=document.getElementById('inboxList'); inbox.innerHTML='';
  cfg.inbox.forEach(m=>{ const d=document.createElement('div'); d.className='inbox-item'; d.innerHTML=`<div><b>${m.from}:</b> ${m.msg}</div><span>${m.time}</span>`; inbox.appendChild(d); });
  const banners=document.getElementById('bannerList'); banners.innerHTML='';
  cfg.banners.forEach(b=>{ const img=document.createElement('img'); img.src=b; img.className='banner-img'; banners.appendChild(img); });
  const list=document.getElementById('songList'); list.innerHTML='';
  if(cfg.nowPlaying===-1){ const stop=document.createElement('div'); stop.className='song-item'; stop.innerHTML=`<div><b>Line Up Stopped</b><br><small>Admin stopped playback</small></div>`; list.appendChild(stop); }
  cfg.songs.forEach((s,i)=>{ const d=document.createElement('div'); d.className='song-item'; d.innerHTML=`<div><b>${i+1}. ${s.title}</b><br><small>${s.artist} ${cfg.nowPlaying===i?' - NOW PLAYING':''}</small></div><button onclick="playSong('${s.src}')">Play</button>`; list.appendChild(d); });
  if(cfg.nowPlaying>=0 && cfg.songs[cfg.nowPlaying]){ const p=document.getElementById('audioPlayer'); if(p.src!==cfg.songs[cfg.nowPlaying].src){ p.src=cfg.songs[cfg.nowPlaying].src; } }
  // HOME LIVE - YOUTUBE / DIRECT LINK - FIXED
  const mainVideo=document.getElementById('mainVideo');
  const ytBox=document.getElementById('youtubePlayer');
  const ytFrame=document.getElementById('youtubeFrame');
  if(cfg.liveUrl && (cfg.liveType==='youtube' || cfg.liveUrl.includes('youtu'))){
    if(mainVideo) mainVideo.style.display='none';
    if(ytBox) ytBox.style.display='block';
    let videoId='';
    if(cfg.liveUrl.includes('youtu.be/')) videoId=cfg.liveUrl.split('youtu.be/')[1].split('?')[0].split('&')[0];
    else if(cfg.liveUrl.includes('v=')) videoId=cfg.liveUrl.split('v=')[1].split('&')[0];
    else videoId=cfg.liveUrl;
    const embed='https://www.youtube.com/embed/'+videoId+'?autoplay=1&rel=0';
    if(ytFrame && ytFrame.src!==embed) ytFrame.src=embed;
  } else if(cfg.liveUrl){
    if(mainVideo) mainVideo.style.display='block';
    if(ytBox) ytBox.style.display='none';
    const vs=document.getElementById('videoSource'); if(vs){ vs.src=cfg.liveUrl; mainVideo.load(); }
  }
  document.getElementById('commentsList').innerHTML=`<div class="comment"><b>Hit TV:</b> Welcome to live comments</div>`;
}
window.addEventListener('load', ()=>{ setTimeout(()=>{ document.getElementById('splash').style.display='none'; },2500); loadApp(); setInterval(loadApp, 15000); });
function showTab(name,btn){ document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); document.getElementById('tab-'+name).classList.add('active'); document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
function addComment(){ const input=document.getElementById('commentInput'); if(!input.value) return; const div=document.createElement('div'); div.className='comment'; div.innerHTML=`<b>You:</b> ${input.value}`; document.getElementById('commentsList').appendChild(div); input.value=''; }
function playSong(src){ const p=document.getElementById('audioPlayer'); p.src=src; p.play(); }
function rateApp(){ alert('Thank you for rating Hit TV!'); }
async function submitArtist(e){ e.preventDefault(); const data={artist:document.getElementById('artistName').value, real:document.getElementById('realName').value, phone:document.getElementById('artistPhone').value, location:document.getElementById('artistLocation').value, genre:document.getElementById('artistGenre').value, song:document.getElementById('songTitle').value, msg:document.getElementById('artistMsg').value, link:document.getElementById('songLink').value, date:new Date().toLocaleString()}; await fetch(DB+"/artists.json",{method:"POST", body:JSON.stringify(data)}); document.getElementById('artistSuccess').innerText=`Submitted! Thank you ${data.artist}.`; e.target.reset(); }
