const mongoose = require("mongoose");
require("dotenv").config();

MONGODB_URI = process.env.MONGODB_URI;

const connectToDb = () => {
  mongoose.connect(MONGODB_URI);
  mongoose.connection.on("connected", () => {
    console.log("succesfully connected to the db");
  });
  mongoose.connection.on("error", () => {
    console.log("Unable to connect to the db");
  });
};

module.exports = connectToDb;
