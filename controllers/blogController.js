const Blog = require("../models/blog");
const APIFeatures = require("../utils/APIFeatures");
const CatchAsync = require("../utils/CatchAsync");
const CustomError = require("../utils/CustomError");

const getAllBlogs = CatchAsync(async (req, res, next) => {
  const matchFilter = req.filter || {};
  const features = new APIFeatures(req.query).filter().sort().paginate();

  const pipeline = [
    {
      $lookup: {
        from: "users",
        let: { authorId: "$author" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
          {
            $project: {
              first_name: 1,
              _id: 1,
            },
          },
        ],
        as: "authorDetails",
      },
    },
    { $unwind: "$authorDetails" },
  ];

  if (matchFilter && Object.keys(matchFilter).length > 0) {
    pipeline.push({ $match: matchFilter });
  }
  pipeline.push(...features.pipeline);

  const blogs = await Blog.aggregate(pipeline);
  res.status(200).json({
    status: "success",
    sum: blogs.length,
    data: {
      blogs,
    },
  });
});

// const getmyblogs = CatchAsync(async (req, res, next) => {
//   // let filter = {};
//   // if (req.user.id)
//   //   // author._id = req.user.id;
//   //   filter = { author: req.user.id };

//   const blogs = await Blog.find({ author: req.user.id });

//   res.status(200).json({
//     status: "success",
//     sum: blogs.length,
//     data: {
//       blogs,
//     },
//   });
// });
const getblogById = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  const blog = await Blog.findOne({
    _id: id,
    state: { $ne: "draft" },
  }).populate({
    path: "author",
    select: "first_name",
  });

  if (!blog) {
    return next(new CustomError("Blog with specified id not found", 404));
  }

  blog.read_count += 1;
  await blog.save();
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

const createBlog = CatchAsync(async (req, res, next) => {
  const blogInfo = req.body;
  const blog = await Blog.create(blogInfo);

  res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
});

const UpdateById = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  // const blogInfo = req.body;
  const blog = await Blog.findOne({ _id: id });

  if (!blog) {
    return next(new CustomError("Blog with the specified id not found", 404));
  }
  if (blog.author._id.toString() !== req.user.id) {
    return next(new CustomError("this blog does not belong to you", 403));
  }
  blog.title = req.body.title || blog.title;
  blog.description = req.body.description || blog.description;
  blog.body = req.body.body || blog.body;
  blog.state = req.body.state || blog.state;
  blog.tags = req.body.tags || blog.tags;

  await blog.save();
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

const deleteBlogbyId = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  const blog = await Blog.findOne({ _id: id });

  if (!blog) {
    return next(new CustomError("Blog with the specified id not found", 404));
  }

  if (blog.author._id.toString() !== req.user.id) {
    return next(new CustomError("this blog does not belong to you", 403));
  }

  await blog.deleteOne();
  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  getAllBlogs,
  getblogById,
  createBlog,
  UpdateById,
  deleteBlogbyId,
  // getmyblogs,
};
