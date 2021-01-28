const express = require("express");
const error = require("./src/middleware/error");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const authRouter = require("./src/routes/auth");
const postRouter = require("./src/routes/post");
const userRouter = require("./src/routes/user");
const { logger } = require("./src/utils/winstonLogger");
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
if (!process.env.JWT_SECRET_KEY) {
  console.error("FARAL ERROR");
}
process.on("uncaughtException", (ex) => {
  logger.log("error", ex.message);
  process.exit(1);
});
process.on("unhandledRejection", (ex) => {
  logger.log("error", ex.message);
  process.exit(1);
});
app.use(error);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const PORT = process.env.PORT || 4000;
mongoose
  .connect(`${process.env.MONGOOSE_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(PORT, () => {
      console.log("app is up and running");
      logger.log("info", `app is up and running ${process.env.PORT}`);
    })
  )
  .catch((err) => logger.log("error", err.message));
