const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7000;
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  // const userObj={
  //     firstName:'sachin',
  //     lastName:'tedulakar',
  //     email:'sachin@gmail.com',
  //     password:'sachin@123'
  // }
  const user = new User(req.body);
  console.log(user);
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

app.patch("/user",async(req,res)=>{
  try {
    const userId=req.body.userId;
    const data=req.body;
     const user=await User.findByIdAndUpdate(userId,data);
     res.send(user+" deleted successfully").status(200)
  } catch (error) {
     res.send("something is wrong").status(400)
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
