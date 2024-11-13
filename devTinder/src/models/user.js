const mongoose=require('mongoose');

const userSchemas=mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
})

const UserModel=mongoose.model("User",userSchemas);
module.exports=UserModel;