const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
     type: String,
     required: true,
  },
  password: {
    type: String,
    required: true
  },
  userType: {
  type: String,
  enum: ["customer", "admin", "mechanic"],
  default: "customer",
  required: true,
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;