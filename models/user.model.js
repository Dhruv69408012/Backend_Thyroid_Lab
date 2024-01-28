const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleEnum = require("../enums/role");
const statusEnum = require("../enums/status");
const conditionEnum = require("../enums/condition");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
    uname: { type: String, unique: true },
    role: {
      type: String,
      enum: roleEnum,
      default: roleEnum.CUSTOMER,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.INACTIVE,
    },
    verificationCode: { type: String },
    condition: {
      type: String,
      enum: conditionEnum,
      default: conditionEnum.NEGATIVE,
    },
    age: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: " ",
    },
    otp: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
