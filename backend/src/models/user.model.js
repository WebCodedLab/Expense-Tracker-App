import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, select: false },
    profilePic: { type: String },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
    accessToken: { type: String },
    refreshToken: { type: String }
}, { timestamps: true });

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
      return next(error)
  }

});

// Method to compare password with hashed password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Method to generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

// Method to generate refresh token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

// Add comparePassword method to user schema
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);