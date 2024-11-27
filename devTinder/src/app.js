const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7000;
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("./utils/validations");

app.use(express.json());
app.use(cookieParser());
// Signup
app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordHash,
      skills: req.body.skills,
    });

    await user.save();
    res.status(201).send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = jwt.sign({ _id: user._id }, "DEV@TINDER$1804");
      console.log(token);
      res.cookie("token", token);
      res.status(200).send("Login successful!");
    }
  } catch (err) {
    res.status(400).send("Error while login: Invalid credentials");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;
    if(!token){
      throw new Error("invalid Token");
    }
    const decodedToken = jwt.verify(token, "DEV@TINDER$1804");
    const { _id } = decodedToken;
    console.log("id", _id);
    const user = await User.findById(_id);
    if(!user){
      throw new Error("User does not exist!")
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send(error.message)
  }
});
// Get User by Email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Get All Users (Feed)
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Delete User
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update User
app.patch("/user/:userId", async (req, res) => {
  try {
    const NOT_ALLOWED_UPDATES = ["email", "userId"];
    const userId = req.params.userId;
    const data = req.body;

    const isUpdateNotAllowed = Object.keys(data).some((item) =>
      NOT_ALLOWED_UPDATES.includes(item)
    );
    if (isUpdateNotAllowed) {
      return res.status(401).send("Update not allowed");
    }

    if (data.skills && data.skills.length > 10) {
      throw new Error("You can add a maximum of 10 skills");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

// Connect to DB and Start Server
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log("Server listening on port", port);
    });
  })
  .catch((error) => {
    console.error("Error while connecting DB:", error);
  });
