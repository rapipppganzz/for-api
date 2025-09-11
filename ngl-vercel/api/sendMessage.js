export default async function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const BOT_TOKEN = "7673116033:AAFM3bM-phhJKBVq4OsLCnkPGDuqjcaRW2c";
  const CHAT_ID = "7483495590";

  try {
    const { text } = req.body;
    if(!text) return res.status(400).json({ error: "Text is required" });

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ chat_id:CHAT_ID, text, parse_mode:"Markdown" })
    });

    const data = await response.json();
    if(!data.ok) throw new Error(JSON.stringify(data));

    res.status(200).json({ success:true, result:data.result });
  } catch(err){
    console.error(err);
    res.status(500).json({ success:false, error: err.message });
  }
}        }

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
