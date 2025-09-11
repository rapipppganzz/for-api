export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method not allowed" });

  const { chat_id, text } = req.body;

  if (!chat_id || !text) 
    return res.status(400).json({ error: "chat_id dan text diperlukan" });

  const BOT_TOKEN = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c";

  console.log("📩 Data diterima:", { chat_id, text });

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "Markdown" })
    });

    const data = await response.json();

    console.log("📤 Response dari Telegram:", data);

    if (!data.ok) {
      // Telegram API error
      console.error("❌ Telegram Error:", data.description);
      return res.status(500).json({ error: data.description });
    }

    res.status(200).json({ success: true, result: data.result });

  } catch (err) {
    console.error("💥 Fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
