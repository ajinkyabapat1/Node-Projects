const mongoose = require("mongoose");
const validator = require("validator");
const userSchemas = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 15,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 4,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email ID");
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your PAssword is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid  Photo URL");
        }
      },
    },
    skills: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0 && v.length < 10,
    },
    about: {
      type: String,
      default: "This is default about of the user.",
      trim: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchemas);
module.exports = UserModel;
