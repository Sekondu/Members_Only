const controller=require("../Controllers/signupController");
const {Router}=require("express");
const router=new Router();

router.get("/",controller.signupGet);
router.post("/",controller.signupPost);

module.exports=router;