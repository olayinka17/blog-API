const express = require("express");
const blogController = require("../controllers/blogController");
const blogMiddleware = require("../middlewares/blogMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const Router = express.Router();

Router.get("/", blogMiddleware.getBlogs, blogController.getAllBlogs);
Router.get(
  "/mine",
  authMiddleware.authoriseUser,
  blogMiddleware.getMyBlogs,
  blogController.getAllBlogs
);
Router.get("/:id", blogController.getblogById);

Router.use(authMiddleware.authoriseUser);

Router.post("/", blogMiddleware.setAuthorIds, blogController.createBlog);
Router.patch("/:id", blogController.UpdateById);
Router.delete("/:id", blogController.deleteBlogbyId);

module.exports = Router;
