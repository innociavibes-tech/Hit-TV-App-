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
