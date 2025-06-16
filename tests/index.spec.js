const request = require("supertest");
const app = require("../app");

describe("testing the home API", () => {
  it("should be welcome to the home API", async () => {
    const response = await request(app).get("/");

    expect(response.text).toEqual("welcome to the home API");
  });
});
