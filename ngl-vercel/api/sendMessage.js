export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { chat_id, text } = req.body;
  if (!chat_id || !text) return res.status(400).json({ error: "chat_id dan text diperlukan" });

  const BOT_TOKEN = "7752399769:AAFpjaRaSiRJ7quT3JD0PbgIEu_PZcE2cvI";

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "Markdown" })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
