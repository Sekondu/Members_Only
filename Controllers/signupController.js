const db=require("../Database/db");
const { body , validationResult }=require("express-validator");
const bcrypt=require("bcryptjs");
function signupGet(req,res){

        res.render("signup");
}
const signupPost=[
    body("confirm_password").trim().custom((value,{req}) => value===req.body.password).withMessage("Confirm Password should match Password"),
    body("password").trim().isLength({min:6}).withMessage("Password must be at least 6 characters long"),

async (req,res) => {
    let data=req.body;
    let username=await db.query(`SELECT username from users where username=$1`,[data.username]);
    let errors=validationResult(req);
    let errorArr=errors.array().map(e=>e.msg);
    if(username.rows.length>0)
    {
        errorArr.push("username already exists!");
    }
    if(errorArr.length>0)
    {
        res.render("signup",{error:errorArr});
    }
    else{
        let hashed_pass=await bcrypt.hash(data.password,10);
        await db.query(`INSERT INTO users (username,first_name,last_name,password) VALUES ($1,$2,$3,$4)`,[data.username,data.first,data.last,hashed_pass]);
        res.redirect("/login");
    }
}

]

module.exports={
    signupGet,
    signupPost,
}