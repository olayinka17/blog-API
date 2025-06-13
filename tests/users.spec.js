const request = require("supertest");
const app = require("../app");
const { connect } = require("./database");

describe("testing the user endpoints", () => {
  let conn;
  beforeAll(async () => {
    conn = await connect();
  });
  afterEach(async () => {
    await conn.cleanup();
  });
  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return 201", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      first_name: "muel",
      last_name: "olayinka",
      email: "muel@example.com",
      password: "samuel1234",
      confirmedPassword: "samuel1234",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
  });
  it("should return 200", async () => {
    await request(app).post("/api/v1/users/signup").send({
      first_name: "muel",
      last_name: "olayinka",
      email: "muel@example.com",
      password: "samuel1234",
      confirmedPassword: "samuel1234",
    });

    const response = await request(app).post("/api/v1/users/login").send({
      email: "muel@example.com",
      password: "samuel1234",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
  });
});
