const express = require('express');
const router = express.Router();
const{createArticle,signIn}=require("../controller/admin");

router.post("/signin",signIn);
router.post("/createArticle",createArticle);

module.exports=router;