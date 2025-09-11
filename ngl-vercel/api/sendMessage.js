import fetch from 'node-fetch';
import formidable from 'formidable-serverless';

const BOT_TOKEN = 7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c";
const CHAT_ID = "7483495590";

export const config = { api:{ bodyParser:false } };

export default async function handler(req,res){
  if(req.method === "POST"){
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files)=>{
      if(err) return res.status(500).json({status:"error",message:err.message});

      try{
        // Kirim teks
        if(fields.text){
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ chat_id:CHAT_ID, text:fields.text, parse_mode:"Markdown" })
          });
        }

        // Kirim foto
        if(files.photo){
          const photo = files.photo;
          const fileData = await fetch(photo.filepath).then(r=>r.arrayBuffer());
          const formData = new FormData();
          formData.append("chat_id", CHAT_ID);
          formData.append("photo", new Blob([fileData]), photo.originalFilename);

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,{
            method:"POST",
            body:formData
          });
        }

        res.status(200).json({status:"ok"});
      }catch(e){
        console.error(e);
        res.status(500).json({status:"error",message:e.message});
      }
    });
  }else{
    res.status(405).json({status:"error",message:"Method not allowed"});
  }
}
