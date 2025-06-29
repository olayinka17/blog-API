const setAuthorIds = (req, res, next) => {
  const tasksInfo = req.body;
  if (!tasksInfo.author) tasksInfo.author = req.user.id;
  next();
};

const getMyBlogs = (req, res, next) => {
  req.filter = { author: req.user.id };
  next();
};
const getBlogs = (req, res, next) => {
  req.filter = { state: { $ne: "draft" } };
  next();
};
module.exports = {
  setAuthorIds,
  getMyBlogs,
  getBlogs,
};
