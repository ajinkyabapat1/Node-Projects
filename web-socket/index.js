const http=require('http');
const express=require('express');
const path=require('path')
const {Server}=require('socket.io')
const app=express();
const port='8001'
const server=http.createServer(app);
//------------------socket io handling------------------
const io=new Server(server)

io.on('connection',(socket)=>{
    socket.on('user-msg',(msg)=>{
    console.log('msg send by user',msg)
    io.emit('message',msg)
  })
    console.log('a new user connected',socket.id)
})
//------------------httpp req handling

app.use(express.static(path.resolve('./public/')));
app.get('/',(req,res)=>{
    res.send('./public/index.html').status(200)
})
server.listen(port,()=>{
    console.log('node server started')
})
