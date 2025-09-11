import fetch from 'node-fetch';

const BOT_TOKEN = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c"; // aman di server
const CHAT_ID = "7483495590";

export default async function handler(req,res){
  if(req.method === "POST"){
    const { text } = req.body;
    try{
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ chat_id:CHAT_ID, text, parse_mode:"Markdown" })
      });
      res.status(200).json({status:"ok"});
    }catch(e){
      console.error(e);
      res.status(500).json({status:"error", message:e.message});
    }
  }else{
    res.status(405).json({status:"error", message:"Method not allowed"});
  }
}
