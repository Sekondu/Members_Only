const validator=require("validator");
const {body,validationResult}=require("express-validator");
const db=require("../Database/db");

function new_MessageGet(req,res){
    res.render("new-message-form",{errors:null});
}
const new_MessagePost=[
body("content").trim().isLength({min:10}).withMessage("Message should have more than 10 characters!"),
async (req,res) => {
    try
    {
    const content=req.body.content;
    const cleaned_content=validator.escape(content);
    const errors=validationResult(req);
    const errorsArr=errors.array().map(e => e.msg);
    if(!errors.isEmpty())
    {
        res.render("new-message-form",{errors:errorsArr});
    }
     await db.query(`INSERT INTO messages (content,user_id) VALUES ($1,$2)`,[cleaned_content,req.user.id]);
     res.redirect("/");
    }
    catch(err)
    {
        console.log(err);
    }
}
]
module.exports={
    new_MessageGet,
    new_MessagePost,
}