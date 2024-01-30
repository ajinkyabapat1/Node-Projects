const shortid = require('shortid')

const URL=require('../models/url')

async function handleURLShortner(req,res){

  
 const shortID=shortid(8);
 const body=req.body;

 if(!body.url){
    return res.status(400).json({error:"URL is required"})
 }

    await URL.create({
        shortID:shortID,
        redirectURL:body.url,
        visitHistory:[]
    })

    return res.status(200).json({id:shortID});
}

module.exports={
    handleURLShortner
}