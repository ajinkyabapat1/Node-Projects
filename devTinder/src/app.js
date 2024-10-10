const express= require('express');
const connectDB=require('./config/database');
const app=express();
const port=7000; 
connectDB().then(()=>{
    console.log('database conncted');
    app.listen(port,()=>{
        console.log('server listneing on port ',`${port}`)
    })
}).catch(error=>{
    console.log('error while connecting db',error)
})

