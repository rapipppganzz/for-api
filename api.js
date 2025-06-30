// pages/api/proxy.js (untuk Vercel)
export default async function handler(req, res) {
  const response = await fetch("http://juanxvivii.zakzz.my.id:2003/api/forcecall", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
