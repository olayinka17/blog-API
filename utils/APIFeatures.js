class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "fields", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);
    return this;
  }
  sort() {
    let sortValue = this.queryString;
    if (Array.isArray(sortValue)) {
      sortValue = sortValue.join(",");
    }

    if (typeof sortValue === "string") {
      const sortBy = sortValue.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("read_count reading_time timeStamp");
    }

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
