const db=require("../Database/db");

async function getMessages(req,res){
    let messages=await db.query(`Select *,m.id as id,TO_CHAR(created_at,'HH24:MI:SS') as hours,TO_CHAR(created_at,'DD-MM-YYYY') as date_in,u.username as author from messages m
        JOIN users u ON u.ID=m.user_id`);
        console.log(messages.rows);
    res.render("messages",{messages:Array.from(messages.rows),user:req.user});
}

module.exports={getMessages};