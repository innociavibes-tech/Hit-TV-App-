// HIT TV - Viewers App - Super Working
let queue = JSON.parse(localStorage.getItem('hitTV_queue')||'[]');
let played = JSON.parse(localStorage.getItem('hitTV_played')||'[]');
let currentIndex = 0;
let isMuted = true;

const video = document.getElementById('mp4Player');
const ytBox = document.getElementById('ytPlayer');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');

// DEFAULT DEMO - Admin will replace with real links in Admin Page
if(queue.length===0){
  queue=[
    {title:"Hit TV Intro - Welcome",artist:"Hit TV",url:"https://www.w3schools.com/html/mov_bbb.mp4",type:"mp4",audio:"https://www.w3schools.com/html/mov_bbb.mp4"},
    {title:"Sample Song 2",artist:"Hit Artist",url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ",type:"youtube",audio:""}
  ];
  localStorage.setItem('hitTV_queue',JSON.stringify(queue));
}

function getYTId(url){
  let m=url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m?m[1]:null;
}
function playCurrent(){
  if(queue.length===0) return;
  // No repeat: skip already played
  let item = queue[currentIndex];
  if(!item) { currentIndex=0; item=queue[0]; }
  nowTitle.textContent=item.title;
  nowArtist.textContent=item.artist||"Hit TV";
  document.getElementById('dlVideo').href=item.url;
  document.getElementById('dlAudio').href=item.audio||item.url;
  document.getElementById('noVideo').style.display='none';
  if(item.type==='youtube'){
    video.style.display='none'; video.pause();
    ytBox.style.display='block';
    let id=getYTId(item.url);
    ytBox.innerHTML=`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&disablekb=1&rel=0" allow="autoplay; encrypted-media" frameborder="0"></iframe>`;
  } else {
    ytBox.style.display='none'; ytBox.innerHTML='';
    video.style.display='block';
    video.src=item.url;
    video.controls=false; video.muted=true; isMuted=true;
    video.play().catch(()=>{});
  }
  renderQueue();
}
video.onended = ()=>{ nextSong(); };
function nextSong(){
  played.push(queue[currentIndex].url);
  localStorage.setItem('hitTV_played',JSON.stringify(played));
  currentIndex++;
  if(currentIndex>=queue.length){ currentIndex=0; played=[]; localStorage.setItem('hitTV_played','[]'); }
  playCurrent();
}
function renderQueue(){
  document.getElementById('queueList').innerHTML = queue.map((q,i)=>`<li style="padding:10px;background:var(--card);margin:5px 0;border-radius:10px">${i===currentIndex?'▶ ':''}${q.title} - ${q.artist}</li>`).join('');
}
// Sound Button - Top of video
document.getElementById('soundBtn').onclick=()=>{
  isMuted=!isMuted;
  if(video.style.display==='block'){ video.muted=isMuted; }
  else{
    // For YouTube, reload with sound
    let item=queue[currentIndex]; let id=getYTId(item.url);
    ytBox.innerHTML=`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted?1:0}&controls=0&rel=0" allow="autoplay" frameborder="0"></iframe>`;
  }
  document.getElementById('soundBtn').textContent = isMuted?'🔊 Sound':'🔇 Mute';
};
// Rotate Button
document.getElementById('rotateBtn').onclick=()=>{
  let box=document.getElementById('videoBox');
  if(document.fullscreenElement) document.exitFullscreen();
  else box.requestFullscreen().catch(()=>{});
};
// Tabs - All Working
document.querySelectorAll('#bottomNav button').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('#bottomNav button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    if(btn.dataset.tab==='notif') loadNotif();
    if(btn.dataset.tab==='audio') loadAudio();
  };
});
// Settings
document.getElementById('settingsBtn').onclick=()=>document.getElementById('settingsBox').classList.toggle('hidden');
document.getElementById('closeSettings').onclick=()=>document.getElementById('settingsBox').classList.add('hidden');
document.getElementById('themeToggle').onchange=(e)=>{
  document.body.classList.toggle('dark',e.target.checked);
  localStorage.setItem('hitTV_theme',e.target.checked?'dark':'light');
};
// Auto White/Black - System
if(localStorage.getItem('hitTV_theme')==='dark'){document.body.classList.add('dark');document.getElementById('themeToggle').checked=true;}
else if(!localStorage.getItem('hitTV_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches){document.body.classList.add('dark');document.getElementById('themeToggle').checked=true;}
document.getElementById('feedbackBtn').onclick=()=>{let f=prompt('Send Feedback to Admin:'); if(f){let arr=JSON.parse(localStorage.getItem('hitTV_feedback')||'[]'); arr.push({name:localStorage.getItem('hitTV_name')||'Viewer',text:f,time:Date.now()}); localStorage.setItem('hitTV_feedback',JSON.stringify(arr)); alert('Feedback sent to Admin. Thank you!');}};
document.getElementById('updateBtn').onclick=()=>alert('Hit TV is up to date. Version 1.0');
document.getElementById('tvBtn').onclick=()=>alert('To Connect on TV: Open hittvapp on your TV browser and enter same code: HIT-TV-2026');
// Comments -> Sent to Admin
document.getElementById('sendComment').onclick=()=>{
  let n=document.getElementById('commentName').value||localStorage.getItem('hitTV_name')||'Viewer';
  let t=document.getElementById('commentText').value;
  if(!t) return alert('Write comment first');
  let arr=JSON.parse(localStorage.getItem('hitTV_comments')||'[]');
  arr.push({name:n,text:t,time:Date.now()});
  localStorage.setItem('hitTV_comments',JSON.stringify(arr));
  document.getElementById('commentText').value='';
  loadComments();
};
function loadComments(){
  let arr=JSON.parse(localStorage.getItem('hitTV_comments')||'[]');
  document.getElementById('commentList').innerHTML=arr.slice(-20).reverse().map(c=>`<div class="comment"><b>${c.name}</b><br>${c.text}</div>`).join('')||'<p>No comments yet</p>';
}
function loadNotif(){
  let arr=JSON.parse(localStorage.getItem('hitTV_notif')||'[]');
  document.getElementById('notifList').innerHTML=arr.length?arr.reverse().map(n=>`<div class="comment"><b>${n.title}</b><br>${n.text}</div>`).join(''):'<p>No messages yet</p>';
  document.getElementById('notifCount').textContent='';
}
function loadAudio(){
  let arr=JSON.parse(localStorage.getItem('hitTV_audio')||'[]');
  if(arr.length===0) arr=[{title:"Demo Audio - Hit Song",artist:"Hit TV",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}];
  document.getElementById('audioList').innerHTML=arr.map(a=>`<div class="audioItem"><div><b>${a.title}</b><br><small>${a.artist}</small><br><audio controls src="${a.url}" style="width:200px;margin-top:5px"></audio></div><a href="${a.url}" download><button style="padding:10px;border:0;border-radius:10px;background:#0a1931;color:#fff">Download</button></a></div>`).join('');
}
// Artist Console -> To Admin
document.getElementById('submitArtist').onclick=()=>{
  let data={name:document.getElementById('artistName').value,phone:document.getElementById('artistPhone').value,title:document.getElementById('artistTitle').value,link:document.getElementById('artistLink').value,time:Date.now()};
  if(!data.name||!data.title) return alert('Fill Name and Song Title');
  let arr=JSON.parse(localStorage.getItem('hitTV_artist')||'[]'); arr.push(data);
  localStorage.setItem('hitTV_artist',JSON.stringify(arr));
  document.getElementById('artistMsg').textContent='Submitted! Admin will review and approve. Thank you.';
};
// Welcome - Name Only
document.getElementById('startWatching').onclick=()=>{
  let n=document.getElementById('userName').value.trim();
  if(!n) return alert('Enter your name first');
  localStorage.setItem('hitTV_name',n);
  document.getElementById('welcomeBox').classList.add('hidden');
  document.getElementById('commentName').value=n;
  playCurrent();
};
if(localStorage.getItem('hitTV_name')){ document.getElementById('welcomeBox').classList.add('hidden'); document.getElementById('userName').value=localStorage.getItem('hitTV_name'); }
// Offline - Strong - Keep inside app, tabs still open
function updateOnline(){
  document.body.classList.toggle('offline',!navigator.onLine);
  if(navigator.onLine){ loadNotif(); loadAudio(); loadComments(); }
}
window.addEventListener('online',updateOnline);
window.addEventListener('offline',updateOnline);
updateOnline();
loadComments(); loadAudio(); renderQueue();
// ===== Hit TV - app.js - CLEAN - No Refresh, Black, Faster, Instant =====

// 1. NO REFRESH - Never refresh, never reload
window.location.reload = function(){ return false; };
history.pushState = function(){ return false; };

// 2. BLACK SCREEN - Make app black immediately, faster load
document.documentElement.style.background = '#000';
if(document.body) document.body.style.background = '#000';

// 3. FASTER + INSTANT - Everything works immediately like ticker
let __lastLink = "";

function playInstant(link){
  if(!link || link === __lastLink) return; // Don't restart same video
  __lastLink = link;

  let v = document.getElementById('mp4Player');
  let yb = document.getElementById('ytPlayer');
  let ph = document.getElementById('videoPlaceholder');
  if(ph) ph.style.display = 'none';

  // YouTube - Instant
  if(link.includes('youtube') || link.includes('youtu.be')){
    let id = '';
    if(link.includes('v=')) id = link.split('v=')[1].split('&')[0];
    else id = link.split('/').pop().split('?')[0];
    if(v){ v.pause(); v.style.display='none'; v.src=''; }
    if(yb){
      yb.style.display='block';
      yb.style.background='#000';
      yb.innerHTML = '<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&playsinline=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;height:100%;background:#000"></iframe>';
    }
    return;
  }

  // MP4 / Audio - Instant
  if(yb) yb.innerHTML = '';
  if(v){
    v.style.display='block';
    v.style.background='#000';
    v.src = link;
    v.preload='auto';
    v.play().catch(()=>{});
  }
}

// 4. LISTEN INSTANT - When admin posts, viewer gets it immediately, no refresh, no waiting
document.addEventListener('DOMContentLoaded', function(){
  // Black screen for all boxes - faster
  let boxes = ['tab-home','videoBox','videoPlaceholder','topBar','bottomNav'];
  boxes.forEach(function(id){
    let el = document.getElementById(id);
    if(el) el.style.background = '#000';
  });

  // Keep app alive, no closing, no refresh on focus
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden){
      // Do NOT reload, do NOT restart song
      if(typeof isPlaying !== 'undefined') isPlaying = true;
    }
  });

  // Firebase Instant Listener
  try{
    if(typeof db !== 'undefined'){
      // Video - instant like ticker
      db.collection('hitTV_current').doc('now').onSnapshot(function(doc){
        if(!doc.exists) return;
        let d = doc.data();
        if(d && d.videoUrl) playInstant(d.videoUrl);
        if(d && d.ticker){
          let tick = document.getElementById('tickerText');
          if(tick) tick.textContent = d.ticker + ' • ';
        }
      });
    }
  }catch(e){ console.log(e); }

  // NO CACHED VIDEO - REMOVED
  // We do NOT save video for offline, we do NOT play cached video
  // When no data / offline, show "No Data - Waiting for Admin" - not cached video
  window.addEventListener('offline', function(){
    // Do NOT close app, do NOT play cached video, just wait
    let off = document.getElementById('hitTVOfflinePage');
    if(off){
      off.style.display='flex';
      off.style.background='#000';
    }
  });
  window.addEventListener('online', function(){
    let off = document.getElementById('hitTVOfflinePage');
    if(off) off.style.display='none';
  });
});

// 5. COMMENT - Send fast, no song change, no refresh
function sendCommentFast(){
  let textEl = document.getElementById('commentText');
  let nameEl = document.getElementById('commentName');
  let t = textEl ? textEl.value.trim() : '';
  if(!t) return;
  let n = (nameEl && nameEl.value) || localStorage.getItem('hitTV_name') || 'Viewer';
  db.collection('hitTV_comments').add({name:n, text:t, time:Date.now()}).then(function(){
    if(textEl) textEl.value='';
    let toast = document.getElementById('hitTVCommentToast');
    if(toast){ toast.style.display='block'; setTimeout(()=>toast.style.display='none',3000); }
    // Do NOT reload, do NOT change song
  });// ===== FIX - No Closing Offline + Video Instant Like Ticker =====

// 1. NEVER CLOSE APP WHEN OFFLINE - Keep video, don't show black offline page covering video
window.addEventListener('offline', function(){
  // DO NOT close, DO NOT show black offline page on top of video
  let off = document.getElementById('hitTVOfflinePage');
  if(off) off.style.display = 'none'; // Hide black offline page

  // Keep video visible, don't make it black
  let v = document.getElementById('mp4Player');
  if(v){ v.style.background = 'transparent'; v.style.display = 'block'; }

  let yb = document.getElementById('ytPlayer');
  if(yb){ yb.style.background = 'transparent'; yb.style.display = 'block'; }

  let vb = document.getElementById('videoBox');
  if(vb){ vb.style.background = '#111'; } // Dark grey, not pure black, video skin stays

  // Show small ticker at bottom: "Offline - Video continues"
  let tick = document.getElementById('tickerText');
  if(tick) tick.textContent = '📶 Offline - Video continues, no closing... • ';
});

// When online again, back to normal, no refresh
window.addEventListener('online', function(){
  let off = document.getElementById('hitTVOfflinePage');
  if(off) off.style.display = 'none';
});

// 2. VIDEO INSTANT LIKE TICKER - When admin posts, viewer sees it in <1 second
// Old: Firebase + check every 3 seconds = slow, black screen
// New: Listen + Preload + Show instantly
function playInstantLikeTicker(link){
  if(!link) return;
  if(link === window.__lastLink) return; // Don't restart same video
  window.__lastLink = link;

  let v = document.getElementById('mp4Player');
  let yb = document.getElementById('ytPlayer');
  let ph = document.getElementById('videoPlaceholder');
  if(ph) ph.style.display = 'none'; // Hide black placeholder instantly

  // MP4 - Preload and play instantly
  if(!link.includes('youtube') && !link.includes('youtu.be')){
    if(yb) yb.innerHTML = '';
    if(v){
      v.style.display = 'block';
      v.style.background = 'transparent';
      v.src = link;
      v.preload = 'auto';
      v.play().catch(()=>{});
    }
    return;
  }

  // YouTube - Instant like ticker
  let id = '';
  try{
    if(link.includes('v=')) id = link.split('v=')[1].split('&')[0];
    else id = link.split('/').pop().split('?')[0];
  }catch(e){}
  if(yb){
    yb.style.display = 'block';
    yb.style.background = 'transparent';
    // autoplay=1 + mute=0 + playsinline = starts immediately like ticker
    yb.innerHTML = '<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&playsinline=1&rel=0&controls=1" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%;height:100%;background:transparent"></iframe>';
  }
  if(v){ v.pause(); v.style.display = 'none'; }
}

// 3. Replace old slow listener with instant ticker listener
try{
  if(typeof db !== 'undefined'){
    db.collection('hitTV_current').doc('now').onSnapshot(function(doc){
      if(!doc.exists) return;
      let d = doc.data();
      if(d && d.videoUrl) playInstantLikeTicker(d.videoUrl);
      // Also ticker text instant
      if(d && d.ticker){
        let tick = document.getElementById('tickerText');
        if(tick) tick.textContent = d.ticker + ' • ';
      }
    });
  }
}catch(e){}
}
