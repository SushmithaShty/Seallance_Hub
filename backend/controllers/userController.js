import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middleware/error.js";
import { sendToken } from "../utiles/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email,phone, password, role } = req.body;

  // Log input for debugging
  console.log(`[${new Date().toISOString()}] Register Input:`, { name, email, phone, password, role });

  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill the complete form!", 400));
  }

  // Log before checking the database
  console.log(`[${new Date().toISOString()}] Checking if email already exists:`, email);

  const isEmail = await User.findOne({ email });

  // Log result of the query
  console.log(`[${new Date().toISOString()}] Is Email Found:`, isEmail);

  if (isEmail) {
    return next(new ErrorHandler("Email already registered!", 400));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Log input for debugging
  console.log(`[${new Date().toISOString()}] Login Input:`, { email, password, role });

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  // Log result of the query
  console.log(`[${new Date().toISOString()}] Is User Found:`, user);

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  // Log password match result
  console.log(`[${new Date().toISOString()}] Is Password Matched:`, isPasswordMatched);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password.", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler(`User with provided email and role ${role} not found!`, 404));
  }

  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});


export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone } = req.body;

  // Log input for debugging
  console.log(`[${new Date().toISOString()}] Update Profile Input:`, { name, email, phone });

  const userId = req.user._id; // Assuming you're using JWT and req.user is populated

  // Log before updating the user
  console.log(`[${new Date().toISOString()}] Updating User ID:`, userId);

  // Find the user and update their details
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  // Log the result of the update
  console.log(`[${new Date().toISOString()}] Updated User:`, user);

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  res.status(200).json({
    success: true,
    user,
    message: "Profile updated successfully!",
  });
});
