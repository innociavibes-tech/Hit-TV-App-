const DB = "https://hit-tv-app-40fb9-default-rtdb.firebaseio.com";
let cfg = { liveTitle:"Hit TV Live - Morning Show", liveDesc:"Live from Kampala - Hit TV", liveType:"youtube", liveUrl:"" };

function getYoutubeId(url){
  if(!url) return "";
  let m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}

function loadLive(){
  const vid = document.getElementById('liveVideo');
  const ytBox = document.getElementById('youtubePlayer');
  const ytFrame = document.getElementById('youtubeFrame');
  const type = cfg.liveType || "youtube";
  const url = cfg.liveUrl || "";
  document.getElementById('liveTitle').innerText = cfg.liveTitle || "Hit TV Live";
  document.getElementById('liveDesc').innerText = cfg.liveDesc || "Live from Kampala - Hit TV";

  if(type === "youtube" && getYoutubeId(url)){
    vid.style.display = "none";
    vid.pause();
    ytBox.style.display = "block";
    // TRUE LIVE YOUTUBE - NO CONTROLS, NO FORWARD, NO SEEK
    ytFrame.src = "https://www.youtube.com/embed/" + getYoutubeId(url) + "?autoplay=1&mute=1&playsinline=1&rel=0&controls=0&disablekb=1&modestbranding=1&fs=0&iv_load_policy=3";
  } else {
    ytBox.style.display = "none";
    ytFrame.src = "";
    vid.style.display = "block";
    if(url && vid.src !== url){ vid.src = url; }
    vid.play().catch(()=>{});
  }
}

// LIVE LOCK - BLOCK SEEK FORWARD ON NORMAL VIDEO
const liveVideoEl = document.getElementById('liveVideo');
if(liveVideoEl){
  liveVideoEl.addEventListener('seeking', function(){
    if(liveVideoEl.duration && liveVideoEl.currentTime < liveVideoEl.duration - 2){
      liveVideoEl.currentTime = liveVideoEl.duration;
    }
  });
  liveVideoEl.addEventListener('contextmenu', e => e.preventDefault());
}

function switchCh(title, desc, el){
  document.querySelectorAll('.ch').forEach(c=>c.classList.remove('active'));
  if(el) el.classList.add('active');
  document.getElementById('liveTitle').innerText = title;
  document.getElementById('liveDesc').innerText = desc;
}

function sendComment(){
  const inp = document.getElementById('commentInput');
  if(!inp.value.trim()) return;
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = '<b>You:</b> ' + inp.value;
  document.getElementById('commentList').appendChild(div);
  inp.value = "";
}

// LOAD FROM FIREBASE - LIVE UPDATE EVERY 5 SECONDS
async function loadConfig(){
  try{
    const res = await fetch(DB + "/config.json");
    const data = await res.json();
    if(data){ cfg = data; loadLive(); }
  }catch(e){ console.log("Firebase error", e); }
}
loadConfig();
setInterval(loadConfig, 5000);
