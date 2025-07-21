const express=require("express");
const app=express();
const path=require("path");
const signup=require("./Routes/signup");
const login=require("./Routes/login");
const localStrategy=require("passport-local").Strategy;
const session=require("express-session");
const passport=require("passport");
const pgSession=require("connect-pg-simple")(session);
const db=require("./Database/db");
const bcrypt=require("bcryptjs");
const getMessages=require("./Controllers/messages.js");
const newMessage=require("./Controllers/new-messageController.js");
const { equal } = require("assert");

app.set("views",path.resolve(__dirname,"Views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(session({
    store:new pgSession({pool:db}),
    secret:"cats",
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:24*60*60*1000},
}));

passport.use(new localStrategy(
    async(username,password,done) => {
        try
        {const res=await db.query(`SELECT * FROM users where username=$1`,[username]);
        const user=res.rows[0];
        if(!user){
        return  done(null,false,{message:"Invalid Username"});
        }
        if(!(await bcrypt.compare(password,user.password))){
        return  done(null,false,{message:"Incorrect Password"});
        }
        return  done(null,user);
        }
        catch(error){
            return done(error);
        }
    }
))

passport.serializeUser((user,done) => {
    done(null,user.id);
})
passport.deserializeUser(async (id,done) => {
    try{
        const res=await db.query(`SELECT * FROM users where id =$1`,[id]);
        const user=res.rows[0];
        done(null,user);
    }
    catch(error){
        done(error);
    }
})
app.use(passport.session());

app.get("/",getMessages.getMessages);

app.use("/signup",signup);
app.use("/login",login);
app.get("/new-message",newMessage.new_MessageGet);
app.post("/new-message",newMessage.new_MessagePost);
app.get("/Join",(req,res) => res.render("join"));
app.post("/Join",async (req,res) => {
    if(req.body.pass==="123456")
    {
        await db.query(`UPDATE users
            SET Member=TRUE WHERE ID=${req.user.id}`);
            res.redirect("/");
    }
    else{
        res.redirect("/Join");
    }
});
app.get("/admin",(req,res) => res.render("admin"));
app.post("/admin",async (req,res) => {
if(req.body.pass==="123456")
{
    await db.query(`UPDATE users SET admin=true where id=${req.user.id}`);
    res.redirect("/");
}
})
app.get("/delete",async (req,res) => {
res.render("delete",{source:req.query.id});
})
app.post("/delete",async (req,res) => {
await db.query(`DELETE FROM messages where ID=${req.query.id}`);
res.redirect("/");
})
app.get("/logout",(req,res,next) => {
    req.logout((err) => {if(err) return next(err)});
    res.redirect("/");    
});

app.listen(3000);