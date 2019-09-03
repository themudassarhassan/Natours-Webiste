const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Pleas enter the name."]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required."],
    lowercase: true,
    validate: [validator.isEmail, "Please  provide a valid email."]
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Provide a password."],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Provie a confirm password"],
    validate: {
      // This only works for create and save method!!
      validator: function(el) {
        return el == this.password;
      },
      message: "Passwords do not match."
    }
  },
  passwordResetToken: String,
  passwordResetExpireTime: Date,
  photo: {
    type: String,
    default: "default.jpg"
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

//Query middleware this points to current query
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isPasswordCorrect = function(
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpireTime = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
