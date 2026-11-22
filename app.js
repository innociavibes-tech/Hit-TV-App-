// ============================================
// HIT TV BY INNO - VIEWERS APP - JS ONLY
// VIEWERS ONLY - NO ADMIN INSIDE
// Paste this whole code in your JS file
// ============================================

// 1. FIREBASE CONFIG - YOUR PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyBT9bXCGb6WgriW1wodo6IeRKOUQ5jdCes",
  authDomain: "hit-tv-app-40fb9.firebaseapp.com",
  databaseURL: "https://hit-tv-app-40fb9-default-rtdb.firebaseio.com",
  projectId: "hit-tv-app-40fb9",
  storageBucket: "hit-tv-app-40fb9.firebasestorage.app",
  messagingSenderId: "740828744097",
  appId: "1:740828744097:web:49104b3522d02de64ce3e0"
};

// 2. LOAD FIREBASE + YOUTUBE API
let db = null;
let YTReady = false;

function loadScript(src) {
  return new Promise((res) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; document.head.appendChild(s);
  });
}

async function startApp() {
  // Load Firebase
  const fbApp = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const fbDb = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
  const app = fbApp.initializeApp(firebaseConfig);
  db = fbDb.getDatabase(app);
  window._fb = fbDb; // save for later use
  await loadScript("https://www.youtube.com/iframe_api");
  buildUI();
  bindFirebase();
  autoLogin();
}
startApp();

// 3. BUILD WHOLE UI WITH JS ONLY
function buildUI() {
  document.body.style.margin = "0";
  document.body.style.background = "#000";
  document.body.style.color = "#fff";
  document.body.style.fontFamily = "Arial,Helvetica,sans-serif";
  document.body.style.paddingBottom = "70px";
  document.body.style.overflowX = "hidden";

  document.body.innerHTML = `
  <style>
    *{box-sizing:border-box} .card{background:#0a0a0a;border:1px solid #222;border-radius:14px;padding:12px;margin:10px}
    input{width:100%;background:#111;color:#fff;border:1px solid #333;border-radius:10px;padding:11px;margin-top:7px;font-size:15px}
    .btn{width:100%;background:#1e3a8a;color:#fff;border:none;padding:13px;border-radius:12px;font-weight:800;margin-top:9px;font-size:15px;cursor:pointer}
    .btn2{background:#222}
    .bottomNav{position:fixed;left:0;right:0;bottom:0;z-index:200;background:#0a0a0a;border-top:1px solid #333;display:flex;padding:6px 4px}
    .bottomNav button{flex:1;background:transparent;border:none;color:#aaa;padding:10px 2px;font-size:12px;font-weight:700}
    .bottomNav button.active{color:#fff;background:#1e3a8a;border-radius:12px}
    .bottomNav button span{display:block;font-size:18px}
    .videoWrap{position:relative;width:100%;aspect-ratio:4/3;background:#000;overflow:hidden;border-radius:12px;border:1px solid #222}
    .videoWrap iframe,.videoWrap video{width:100%;height:100%;object-fit:cover;border:0;pointer-events:none}
    .ticker{position:absolute;left:0;right:0;bottom:0;background:#1e3a8a;color:#fff;overflow:hidden;white-space:nowrap;padding:7px 0;font-weight:700;font-size:14px;z-index:5}
    .ticker span{display:inline-block;padding-left:100%;animation:tick 20s linear infinite}
    @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-100%)}}
    .soundBtn{position:absolute;top:8px;right:8px;z-index:6;background:#1e3a8a;color:#fff;border:none;padding:8px 12px;border-radius:20px;font-weight:800}
    .nowBox{display:flex;gap:8px;margin-top:8px}.nowBox div{flex:1;background:#111;border:1px solid #222;border-radius:10px;padding:9px}
    .nowBox small{color:#aaa}.pill{background:#111;border:1px solid #333;padding:6px 10px;border-radius:20px;font-size:12px}
    .row{display:flex;gap:8px}.row>*{flex:1}
    .item{background:#111;border:1px solid #222;border-radius:12px;padding:10px;margin-top:8px}
    .item b{font-size:14px;word-break:break-all}.muted{color:#aaa;font-size:13px}
    .toggle{display:flex;justify-content:space-between;align-items:center;background:#111;border:1px solid #222;border-radius:12px;padding:12px;margin-top:8px}
    .switch{width:52px;height:28px;background:#333;border-radius:20px;position:relative;cursor:pointer}
    .switch:after{content:"";position:absolute;width:22px;height:22px;background:#fff;border-radius:50%;top:3px;left:3px}
    .switch.on{background:#1e3a8a}.switch.on:after{left:27px}
    body.light{background:#fff;color:#000}.light .card,.light .item,.light .nowBox div,.light .toggle{background:#f2f2f2;border-color:#ddd;color:#000}
    .hidden{display:none!important}
    #settingsBox{position:fixed;inset:0;z-index:300;background:#000;margin:0;border-radius:0;overflow-y:auto;padding:16px;padding-bottom:80px}
    .pageHead{padding:14px 10px 4px}
  </style>

  <div id="offlineBanner" style="display:none;background:#b91c1c;text-align:center;padding:7px;font-size:13px;font-weight:700">YOU ARE OFFLINE - You stay inside app</div>
  <div style="background:#000;padding:12px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;border-bottom:1px solid #222">
    <h1 style="font-size:18px;margin:0">Hit TV <span style="color:#1e3a8a">by Inno</span></h1>
    <button onclick="openSettings()" style="background:#111;color:#fff;border:1px solid #333;padding:8px 12px;border-radius:20px;font-weight:700">Settings</button>
  </div>

  <div id="nameGate" class="card">
    <h2>Enter Name To Watch</h2><p class="muted">Enter your name once to watch Hit TV live.</p>
    <input id="viewerName" placeholder="Enter your name...">
    <button class="btn" onclick="enterWatch()">Enter To Watch</button>
  </div>

  <div id="viewerMain" class="hidden">
    <div id="v-home">
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center"><b id="helloName">LIVE</b><span class="pill">● LIVE • 24/7</span></div>
        <div class="videoWrap" id="videoWrap">
          <div id="playerBox" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;color:#aaa">Waiting for Live...<br>No video yet.</div>
          <button class="soundBtn" id="soundBtn" onclick="tapSound()">TAP FOR SOUND</button>
          <div class="ticker"><span id="tickerText">Welcome to Hit TV by Inno • Stay Tuned •</span></div>
        </div>
        <div class="nowBox"><div><small>NOW PLAYING</small><br><b id="nowPlaying">-</b><br><span class="muted" id="nowDetail"></span></div><div><small>NEXT</small><br><b id="nextPlaying">-</b></div></div>
        <div class="row"><button class="btn btn2" onclick="downloadVideo()">Download Video</button><button class="btn btn2" onclick="downloadAudio()">Download Audio</button></div>
        <div class="row"><button class="btn btn2" onclick="requestPiP()">Picture in Picture</button><button class="btn btn2" onclick="toggleMute()">Mute / Unmute</button></div>
        <p class="muted" style="margin-top:8px">Real TV: No pause, no forward, no seek. You join where live is now.</p>
      </div>
      <div class="card"><h3>Queue List - Waiting To Play</h3><div id="viewerQueue"></div></div>
      <div class="card"><h3>Live Comments - To Admin</h3><input id="commentInput" placeholder="Write comment..."><button class="btn" onclick="sendComment()">Send Comment</button><div id="viewerComments"></div></div>
    </div>
    <div id="v-notif" class="hidden"><div class="pageHead"><h2>Notifications</h2><p class="muted">Messages from Admin</p></div><div class="card"><div id="viewerNotifs"></div></div></div>
    <div id="v-audio" class="hidden"><div class="pageHead"><h2>Audio Streams</h2><p class="muted">Listen to audio songs</p></div><div class="card"><div id="viewerAudio"></div></div></div>
    <div id="v-artist" class="hidden"><div class="pageHead"><h2>Artist Console</h2><p class="muted">Submit your song to Admin</p></div><div class="card"><input id="artistName" placeholder="Artist Name"><input id="artistLink" placeholder="YouTube / Drive Link"><button class="btn" onclick="submitArtist()">Submit To Admin</button></div></div>
    <div class="bottomNav" id="bottomNav">
      <button class="active" onclick="vTab('home',this)"><span>⌂</span>Home</button>
      <button onclick="vTab('notif',this)"><span>◎</span>Notifications</button>
      <button onclick="vTab('audio',this)"><span>♫</span>Audio Streams</button>
      <button onclick="vTab('artist',this)"><span>☆</span>Artist Console</button>
    </div>
  </div>

  <div id="settingsBox" class="hidden">
    <div style="display:flex;justify-content:space-between;align-items:center"><h2>Settings</h2><button onclick="openSettings()" style="background:#222;color:#fff;border:1px solid #333;padding:8px 14px;border-radius:20px;font-weight:700">Close X</button></div>
    <div class="toggle"><span>Black & White Mode</span><div class="switch" id="themeSwitch" onclick="toggleTheme()"></div></div>
    <p class="muted">Professional toggle. Black = dark, White = light.</p>
    <div class="card"><h3>Send Us Feedback</h3><input id="feedbackText" placeholder="Send us feedback..."><button class="btn" onclick="sendFeedback()">Send Feedback</button></div>
    <button class="btn btn2" onclick="openSettings()">Close Settings</button>
  </div>
  `;
}

// 4. LOGIC
let myName = localStorage.getItem('hitv_name') || "";
let ytPlayer = null, currentUrl = "", isMuted = true;

function autoLogin() {
  if (!myName) return;
  document.getElementById('viewerName').value = myName;
  goInside();
}
function goInside() {
  document.getElementById('nameGate').classList.add('hidden');
  document.getElementById('viewerMain').classList.remove('hidden');
  document.getElementById('helloName').innerText = 'Hi ' + myName + ' • LIVE';
  const { ref, set, update } = window._fb;
  set(ref(db, 'users/' + myName), { name: myName, online: true, lastSeen: Date.now() });
  setInterval(() => update(ref(db, 'users/' + myName), { online: true, lastSeen: Date.now() }), 15000);
}
window.vTab = (id, el) => {
  ['home','notif','audio','artist'].forEach(x => document.getElementById('v-' + x).classList.add('hidden'));
  document.getElementById('v-' + id).classList.remove('hidden');
  document.querySelectorAll('#bottomNav button').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
};
window.openSettings = () => {
  const s = document.getElementById('settingsBox');
  s.classList.toggle('hidden');
};
window.toggleTheme = () => {
  document.body.classList.toggle('light');
  document.getElementById('themeSwitch').classList.toggle('on');
};
window.enterWatch = () => {
  const n = document.getElementById('viewerName').value.trim();
  if (!n) return alert('Enter your name');
  myName = n; localStorage.setItem('hitv_name', n);
  goInside(); // REGISTER ONCE - NEVER ASK AGAIN
};
window.getYTId = (url) => {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};
window.onYouTubeIframeAPIReady = () => { YTReady = true; };

function renderLive(url, title, detail) {
  currentUrl = url || "";
  const box = document.getElementById('playerBox');
  if (!box) return;
  document.getElementById('nowPlaying').innerText = title || url || "-";
  document.getElementById('nowDetail').innerText = detail || "";
  if (!url) { box.innerHTML = 'Waiting for Live...<br>No video yet.'; return; }
  const yid = getYTId(url);
  if (yid) {
    box.innerHTML = `<div id="ytDiv" style="width:100%;height:100%"></div>`;
    ytPlayer = new YT.Player('ytDiv', { videoId: yid, playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, fs: 0, mute: 1 }, events: { onReady: e => { e.target.mute(); e.target.playVideo(); document.getElementById('soundBtn').innerText = 'TAP FOR SOUND'; }, onStateChange: e => { if (e.data === 0) playNextAuto(); } } });
  } else {
    box.innerHTML = `<video src="${url}" autoplay playsinline muted controlsList="nodownload nofullscreen noremoteplayback"></video>`;
    const v = box.querySelector('video'); v.play().catch(() => {}); v.onended = () => playNextAuto();
  }
}
window.tapSound = () => {
  isMuted = false;
  if (ytPlayer && ytPlayer.unMute) { ytPlayer.unMute(); ytPlayer.setVolume(100); ytPlayer.playVideo(); }
  const v = document.querySelector('#videoWrap video');
  if (v) { v.muted = false; v.volume = 1; v.play().catch(() => {}); }
  document.getElementById('soundBtn').innerText = 'SOUND ON';
};
window.toggleMute = () => {
  isMuted = !isMuted;
  if (ytPlayer) { isMuted ? ytPlayer.mute() : ytPlayer.unMute(); }
  const v = document.querySelector('#videoWrap video'); if (v) v.muted = isMuted;
  document.getElementById('soundBtn').innerText = isMuted ? 'TAP FOR SOUND' : 'SOUND ON';
};
window.requestPiP = () => {
  const v = document.querySelector('#videoWrap video');
  if (v && document.pictureInPictureEnabled) v.requestPictureInPicture().catch(() => alert('PiP not available for YouTube'));
  else alert('PiP works for MP4 videos');
};
window.downloadVideo = () => { if (!currentUrl) return alert('No video playing'); window.open(currentUrl, '_blank'); };
window.downloadAudio = () => { if (!currentUrl) return alert('No video playing'); window.open(currentUrl, '_blank'); };
function playNextAuto() {
  const { ref, get } = window._fb;
  get(ref(db, 'lineup')).then(s => { const v = s.val() || {}; const keys = Object.keys(v); if (keys.length > 1) { const item = v[keys[1]]; renderLive(item.url, item.title, item.detail); } });
}
function bindFirebase() {
  const { ref, onValue, push, get } = window._fb;
  onValue(ref(db, 'live'), snap => { const d = snap.val(); if (d) renderLive(d.url, d.title, d.detail); });
  onValue(ref(db, 'ticker'), snap => { const t = snap.val(); if (t) document.getElementById('tickerText').innerText = t.text || t; });
  onValue(ref(db, 'lineup'), snap => {
    const v = snap.val() || {}; const keys = Object.keys(v); let html = "";
    keys.forEach(k => { html += `<div class="item"><b>${v[k].title || v[k].url}</b><div class="muted">${v[k].url}</div></div>`; });
    document.getElementById('viewerQueue').innerHTML = html || 'No songs in queue';
    document.getElementById('nextPlaying').innerText = keys.length > 1 ? (v[keys[1]].title || v[keys[1]].url) : '-';
  });
  onValue(ref(db, 'comments'), snap => {
    const v = snap.val() || {}; let h = "";
    Object.values(v).forEach(c => { h += `<div class="item"><b>${c.name}:</b> ${c.text}<div class="muted">${c.reply ? 'Admin: ' + c.reply : ''}</div></div>`; });
    document.getElementById('viewerComments').innerHTML = h;
  });
  onValue(ref(db, 'notifications'), snap => {
    const v = snap.val() || {}; let h = "";
    Object.values(v).reverse().forEach(n => { h += `<div class="item">${n.text}</div>`; });
    document.getElementById('viewerNotifs').innerHTML = h || 'No notifications';
  });
  onValue(ref(db, 'audioStreams'), snap => {
    const v = snap.val() || {}; let h = "";
    Object.values(v).forEach(a => { h += `<div class="item"><b>${a.title}</b><br><audio controls src="${a.url}" style="width:100%"></audio></div>`; });
    document.getElementById('viewerAudio').innerHTML = h || 'No audio yet';
  });
  window.sendComment = () => {
    const t = document.getElementById('commentInput').value.trim(); if (!t) return;
    push(ref(db, 'comments'), { name: myName || 'Viewer', text: t, reply: "", time: Date.now() });
    document.getElementById('commentInput').value = ''; alert('Comment sent to Admin');
  };
  window.submitArtist = () => {
    const a = document.getElementById('artistName').value, l = document.getElementById('artistLink').value;
    if (!a || !l) return alert('Fill all');
    push(ref(db, 'artistSubmissions'), { artist: a, link: l }); alert('Submitted to Admin');
  };
  window.sendFeedback = () => {
    const t = document.getElementById('feedbackText').value; if (!t) return;
    push(ref(db, 'feedback'), { name: myName, text: t, time: Date.now() }); alert('Feedback sent. Thank you!');
  };
  // Offline banner
  const check = () => { document.getElementById('offlineBanner').style.display = navigator.onLine ? 'none' : 'block'; };
  window.addEventListener('online', check); window.addEventListener('offline', check); check();
}
