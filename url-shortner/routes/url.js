const express=require('express');
const {handleURLShortner} =require('../controllers/url')

const router=express.Router();

router.post('/',handleURLShortner)
module.exports=router;