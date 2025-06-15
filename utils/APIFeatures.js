class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.pipeline = [];
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "fields", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // const match = {};
    if (queryObj.author) {
      this.pipeline.push({
        $match: { "authorDetails.first_name": queryObj.author },
      });
    }

    // if (queryObj.author) {
    //   match["authorDetails.first_name"] = queryObj.author;
    // }

    // if (queryObj.title) {
    //   match.title = queryObj.title;
    // }
    // if (queryObj.state) {
    //   match.state = queryObj.state;
    // }
    // if (queryObj.tags) {
    //   match.tags = queryObj.tags;
    // }

    // if (Object.keys(match).length > 0) {
    //   this.pipeline.push({ $match: match });
    // }
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      const sortObj = {};

      sortBy.split(" ").forEach((field) => {
        sortObj[field] = 1;
      });
      this.pipeline.push({ $sort: sortObj });
    } else {
      this.pipeline.push({
        $sort: { timeStamp: -1, read_count: -1, reading_time: 1 },
      });
    }

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.pipeline.push({ $skip: skip }, { $limit: limit });

    return this;
  }
}

module.exports = APIFeatures;
