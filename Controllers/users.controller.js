import userModel from "../Model/user.model";
import bcrypt from "bcrypt";
import ErrorHandler from "../src/Utils/errorHandler";
import jwt from "jsonwebtoken";
import { successResponse } from "../utils/successResponse.js";
import {
    getAllUsers,
    updateUserRole,
  } from "../services/userService.js";


export function register(req,res){
    const {fullname,email,password} = req.body;

   
    userModel.findOne({email}).then((data)=>{
        if(data){
            return res.status(400).json({user:"user already exists"})
        }else{

            const newUser = new userModel({
                fullname,
                email,
                password:bcrypt.hashSync(password,10),       
            });
            newUser.save().then((data)=>{
                return res.status(200).json({message:data})
            })
        }       
    }).catch((err) => res.status(500).json({message:err.message}));
}


export function login(req,res){
    const{email,password} = req.body;
    userModel.findOne({email}).then((data) =>{
        if(!data){
            return res.status(404).json({message:"user is not registered"})
        }

        
    let isValidPassword = bcrypt.compareSync(password,data.password);

    if(!isValidPassword){
        res.status(403).json({message:"invalid password"})
    }
     
    let token = jwt.sign({id: data.id} ,"secretKey" );

   
    res.send({
       user: {
        email: data.email,
        fullname: data.fullname,
       },
       accessToken:token,
    });
    }).catch((err)=>{
        res.status(500).send({message:err.message});
    }) 
}

// update user email
export const updateUserEmail = async (req, res, next) => {
    try {
      const { newEmail } = req.body;
      const userId = req.user;
  
      const isEmailExists = await User.findOne({ email: newEmail });
  
      if (isEmailExists) {
        return next(new ErrorHandler("This email is already in use!", 400));
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      // Generate OTP
      const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      // configure mail data
      const templateData = {
        user: { name: user.name },
        activationCode,
      };
  
      // save otp with expiry in db
      const hashedOTP = await bcrypt.hash(activationCode, 10);
      const emailChangeOTPExpiry = new Date();
      emailChangeOTPExpiry.setMinutes(emailChangeOTPExpiry.getMinutes() + 3);
  
      user.emailChangeOTP = hashedOTP;
      user.emailChangeOTPExpiry = emailChangeOTPExpiry;
      await user.save();
  
      // send verification mail
      await sendMail({
        userEmail: newEmail,
        subject: "Change your email",
        templateName: "change-mail.ejs",
        templateData,
      });
  
      res
        .status(200)
        .json(
          successResponse(
            `Please check your email: ${newEmail} to update your email address!`
          )
        );
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

// verify otp for email change
export const verifyNewEmailOTP = async (req, res, next) => {
    try {
      const { newEmail, otp } = req.body;
      const userId = req.user;
  
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      const isCorrectOTP = await bcrypt.compare(otp, user.emailChangeOTP);
  
      if (!isCorrectOTP) {
        return next(new ErrorHandler("Invalid OTP", 403));
      }
  
      const isExpiredOTP = user.emailChangeOTPExpiry < new Date();
  
      if (isExpiredOTP) {
        return next(new ErrorHandler("OTP expired", 403));
      }
  
      // update email
      user.email = newEmail;
      // Clear the otp and expiry after email is updated
      user.emailChangeOTP = null;
      user.emailChangeOTPExpiry = null;
      await user.save();
  
      res.status(200).json(
        successResponse(`Your email is updated successfully`, "user", {
          name: user.name,
          email: user.email,
        })
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  };
  
  // get all users --- only for admin
  export const getAllUsersForAdmin = async (req, res, next) => {
    try {
      getAllUsers(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  };
  
  // update user role --- only for admin
  export const updateUserRoleByAdmin = async (req, res, next) => {
    try {
      const { email, role } = req.body;
  
      if (!email || !role) {
        return next(new ErrorHandler("Email and role are required!", 404));
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      const userId = user._id;
      updateUserRole(res, userId, role);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  };
  
  // delete user --- only for admin
  export const deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
  
      // Find all products
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      res.status(200).json(successResponse("User deleted successfully"));
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  };
