const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

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
  password: {
    type: String,
    required: true
  },
  phoneNumber: { // 📞 NEW FIELD ADDED
    type: String,
    required: false, 
    unique: true,
    sparse: true 
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

// ⚠️ IMPORTANT: Hash password before saving (Security Enhancement)
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;