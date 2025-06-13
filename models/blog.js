const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title must be required"],
    unique: true,
  },
  description: String,
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  body: {
    type: String,
    required: [true, "Post must have a content"],
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: Number,
  tags: String,
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: [true, "A blog must have an author"],
  },
});

// BlogSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "author",
//     select: "first_name",
//   });
//   next();
// });

// BlogSchema.pre(/^find/, function (next) {
//   this.find({ state: { $ne: "draft" } });
//   next();
// });

BlogSchema.pre("save", function (next) {
  const wordsPerMinute = 200;
  const words = this.body.trim().split(/\s+/).length;
  this.reading_time = Math.ceil(words / wordsPerMinute);

  next();
});
module.exports = mongoose.model("blogs", BlogSchema);
