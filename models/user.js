const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Each user must have a first name"],
  },
  last_name: {
    type: String,
    required: [true, "Each user must have a last name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide an email"],
    minLength: [8, "Your password must not be less than 8 characters"],
    select: false,
  },
  confirmedPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same",
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmedPassword = undefined;
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
module.exports = mongoose.model("users", UserSchema);
