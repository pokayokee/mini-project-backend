import { User } from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.json({error: false, users});
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch users",
      details: err.message,
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    // prevent duplicate email
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(409).json({
        error: true,
        message: "Email already in use!",
      });
    }

    // create and save new user
    const user = new User({ name, email, password })
    await user.save();

    res.status(201).json({
      error: false,
      user,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: err.message,
    });
  }
};

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body
  if (!fullName || !email || !password) {
    res.status(400).json({
      error: true,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({ error: true, message: "Email is already used", });
    }
    const user = new User({ fullName, email, password });
    await user.save();
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: err.message,
    });
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Email and password are required",
    });
  }

  try{
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({
      error: false,
      token,
      message: "Login Successful!",
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: err.message,
    });
  }
}