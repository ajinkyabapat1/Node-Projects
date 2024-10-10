const mongoose=require('mongoose');
const connectDB=async()=>{
await mongoose.connect('mongodb+srv://ajinkyabapat1:ajinkyabapat1@dev-tinder.mcppp.mongodb.net/');
 
}

module.exports=connectDB;
