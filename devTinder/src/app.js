const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7000;
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  if(user?.email==''){
    throw new Error('Email Id can not be blank');
    
  }
  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  console.log(userEmail);
  try {
    const user = await User.find({ email: userEmail });
    if (user.length == 0) {
      res.send("user not found").status(404);
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed",async(req,res)=>{
     try {
        const user=await User.find({});
        res.send(user).status(200)
     } catch (error) {
        res.send("something is wrong").status(400)
     }
})

app.delete("/user",async(req,res)=>{
  try {
    const userId=req.body.userId;

     const user=await User.findByIdAndDelete(userId);
     res.send(user+" deleted successfully").status(200)
  } catch (error) {
     res.send("something is wrong").status(400)
  }
})


app.patch("/user/:userId",async(req,res)=>{
  try {
    const NOT_ALLOWED_UPDAES=['email','userId'];
    const userId=req.params?.userId;
    const data=req.body;
     const isUpdateAllowed=Object.keys(data).every(item=>NOT_ALLOWED_UPDAES.includes(item));
     if(isUpdateAllowed){
      res.send("Update not allowed").status(401);
      return
     }
     if(data?.skills.length>10){
      throw new Error('You can add maximum 10 skills');
     }
     const user=await User.findByIdAndUpdate(userId,data,{
      returnDocument:"after",
      runValidators:true
     });
     res.send(user+" user updated successfully").status(200)
  } catch (error) {
     res.send("something is wrong "+error).status(400)
  }
})
connectDB()
  .then(() => {
    console.log("database conncted");
    app.listen(port, () => {
      console.log("server listneing on port ", `${port}`);
    });
  })
  .catch((error) => {
    console.log("error while connecting db", error);
  });
