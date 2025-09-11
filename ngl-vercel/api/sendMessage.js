export default async function handler(req, res){
  if(req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { text, photoUrl } = req.body;
  const CHAT_ID = "7483495590";
  const BOT_TOKEN = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c";

  try{
    let r;
    if(photoUrl){
      r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, photo: photoUrl, caption:text||"" })
      });
    }else{
      r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode:"Markdown" })
      });
    }

    const result = await r.json();
    if(!result.ok) throw new Error(JSON.stringify(result));
    res.status(200).json({ success:true });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, error:err.message });
  }
}
