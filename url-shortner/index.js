const express = require("express");
const app = express();
const urlRoutes = require("./routes/url");
const { connectToMongoDB } = require("./connection");
const port = "8001";
const URL = require("./models/url");
connectToMongoDB("mongodb://localhost:27017/shortURL")
  .then((data) => console.log("connection done "))
  .catch((err) => console.log("err while connecting mongodb", err));
app.use(express.json());

app.use("/url", urlRoutes);
app.get("/:shortID", async (req, res) => {
  console.log("req", req.params,req.params.shortID);
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    {
      shortID,
    },
    {
      $push: {
        visitHistory: { timeStamp: Date.now() },
      },
    }
  );

  console.log("entryuuuuuuuuuuu", entry);
  res.redirect(req.params.shortID);
});
app.listen(port, () => {
  console.log("server started on port 8001");
});
