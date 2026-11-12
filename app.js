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
    // TRUE LIVE - NO PLAY BUTTON, NO CONTROLS, AUTO PLAY ONLY
    ytFrame.src = "https://www.youtube.com/embed/" + getYoutubeId(url) + "?autoplay=1&mute=1&playsinline=1&rel=0&controls=0&disablekb=1&modestbranding=1&fs=0&iv_load_policy=3&showinfo=0";
  } else {
    ytBox.style.display = "none";
    ytFrame.src = "";
    vid.style.display = "block";
    if(url && vid.src !== url){ vid.src = url; }
    vid.play().catch(()=>{});
  }
}

// BLOCK ALL PRESS ON VIDEO - VIEWER CANNOT PLAY / STOP / SEEK
const liveVideoEl = document.getElementById('liveVideo');
if(liveVideoEl){
  liveVideoEl.addEventListener('click', e => { e.preventDefault(); liveVideoEl.play().catch(()=>{}); });
  liveVideoEl.addEventListener('seeking', function(){
    if(liveVideoEl.duration && liveVideoEl.currentTime < liveVideoEl.duration - 2){
      liveVideoEl.currentTime = liveVideoEl.duration;
    }
  });
  liveVideoEl.addEventListener('contextmenu', e => e.preventDefault());
  liveVideoEl.addEventListener('pause', () => { liveVideoEl.play().catch(()=>{}); });
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

async function loadConfig(){
  try{
    const res = await fetch(DB + "/config.json");
    const data = await res.json();
    if(data){ cfg = data; loadLive(); }
  }catch(e){ console.log("Firebase error", e); }
}
loadConfig();
setInterval(loadConfig, 5000);
