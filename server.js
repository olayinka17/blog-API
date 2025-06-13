require("dotenv").config();
const connectToDb = require("./db");
const app = require("./app");

const port = process.env.port;

connectToDb();

app.listen(port, () => {
  console.log(`Server is runnning at http://127.0.0.1:${port}`);
});
