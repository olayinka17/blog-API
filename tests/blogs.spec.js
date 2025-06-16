const request = require("supertest");
const app = require("../app");
const { connect } = require("./database");

describe("testing the blog's endpoints", () => {
  let conn;
  let token;
  beforeAll(async () => {
    conn = await connect();
  });
  beforeEach(async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      first_name: "muel",
      last_name: "olayinka",
      email: "muel@example.com",
      password: "samuel1234",
      confirmedPassword: "samuel1234",
    });

    token = response.body.token;
  });
  afterEach(async () => {
    await conn.cleanup();
  });
  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return 201", async () => {
    const response = await request(app)
      .post("/api/v1/blogs/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "i really dont know",
        body: "okayed",
        tags: "ok",
        description: "i dont know the details of this post",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("blog");
    expect(response.body.data).toHaveProperty("blog.read_count", 0);
    expect(response.body.data).toHaveProperty("blog.state", "draft");
  });

  it("should return an array of empty blogs", async () => {
    await request(app)
      .post("/api/v1/blogs/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "i really dont know",
        body: "okayed",
        tags: "ok",
        description: "i dont know the details of this post",
        // state: "published",
      });

    const response = await request(app).get("/api/v1/blogs");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("sum", 0);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("blogs");
    expect(response.body.data.blogs).toEqual([]);
  });

  it("should return 200", async () => {
    await request(app)
      .post("/api/v1/blogs/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "i really dont know",
        body: "okayed",
        tags: "ok",
        description: "i dont know the details of this post",
        // state: "published",
      });

    const response = await request(app)
      .get("/api/v1/blogs/mine")
      .set("authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("sum", 1);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("blogs");
    expect(response.body.data.blogs[0]).toHaveProperty("read_count", 0);
  });

  it("should return 404", async () => {
    const response = await request(app).get(
      "/api/v1/blogs/684b3e5e5e2c2f0fc85a52a2"
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("status", "fail");
    expect(response.body).toHaveProperty(
      "message",
      "Blog with specified id not found"
    );
  });
  it("should return 200", async () => {
    const newBlog = await request(app)
      .post("/api/v1/blogs/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "i really dont know",
        body: "okayed",
        tags: "ok",
        description: "i dont know the details of this post",
      });

    const blogId = newBlog.body.data.blog._id;

    const response = await request(app)
      .patch(`/api/v1/blogs/${blogId}`)
      .set("authorization", `Bearer ${token}`)
      .send({
        state: "published",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("blog");
    expect(response.body.data).toHaveProperty("blog.state", "published");
  });

  it("should return 200", async () => {
    const newBlog = await request(app)
      .post("/api/v1/blogs/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "i really dont know",
        body: "okayed",
        tags: "ok",
        description: "i dont know the details of this post",
      });

    const blogId = newBlog.body.data.blog._id;

    const response = await request(app)
      .delete(`/api/v1/blogs/${blogId}`)
      .set("authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
  });

  it("should return 200", async () => {
    await request(app)
      .post("/api/v1/blogs/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "i really dont know",
        body: "okayed",
        tags: "ok",
        description: "i dont know the details of this post",
        state: "published",
      });

    const response = await request(app).get("/api/v1/blogs?author=muel");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.blogs[0]).toHaveProperty(
      "authorDetails.first_name",
      "muel"
    );
  });
});
