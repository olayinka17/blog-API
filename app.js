const express = require("express");

const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
const BlogRouter = require("./routes/blogs");
const UserRouter = require("./routes/user");
const CustomError = require("./utils/CustomError");
const app = express();

console.log(app.get("env"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/blogs", BlogRouter);
app.use("/api/v1/users", UserRouter);
app.get("/", (req, res) => {
  res.send("welcome to the home API");
});

app.use((req, res, next) => {
  next(new CustomError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
