const express = require("express");
const userController = require("../controllers/userController");
const blogMiddleware = require("../middlewares/blogMiddleware");
const BlogRouter = require("./blogs");
const Router = express.Router();

Router.use("/blogs", BlogRouter);
Router.post("/signup", userController.signup);
Router.post("/login", userController.login);

module.exports = Router;
