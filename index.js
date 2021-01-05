const express = require("express");
const cors = require("cors");
const { uri } = require("./variables");
const mongoose = require("mongoose");
const authRouter = require("./src/routes/auth");
const postRouter = require("./src/routes/post");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", authRouter);
app.use("/posts", postRouter);
mongoose.set("useFindAndModify", true);
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(app.listen(4000, () => console.log("app is up and running")))
  .catch((err) => console.log("Oops some error"));
