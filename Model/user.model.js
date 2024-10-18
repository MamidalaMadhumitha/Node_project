import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    token: {
        type: String,
        default: null,
      }, // token for reset password link
      tokenExpiry: {
        type: Date,
        default: null,
      }, // expiry for reset password token
      emailChangeOTP: {
        type: String,
        default: null,
      },
      emailChangeOTPExpiry: {
        type: Date,
        default: null,
      },
});
// pre middleware to hash password before saving to db
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

// function to create access token
userSchema.methods.signInAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
      expiresIn: "5m",
    });
  };
  
// function to create refresh token
userSchema.methods.signInRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
      expiresIn: "3d",
    });
  };
  
  // compare password
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  
const userModel = mongoose.model("user",userSchema);

export default userModel;