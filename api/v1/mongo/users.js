import express from "express";
import {
  authMe,
  createAccount,
  createUser,
  getAllUsers,
  getUser,
  getUserProfile,
  loginCookieUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyToken,
} from "./controllers/usersController.js";
import { authUser } from "../../../middleware/auth.js";
import { User } from "../../../models/User.js";

const router = express.Router();

// Read all users
router.get("/users", getAllUsers);

// Create a user
router.post("/users", createUser);

// Register a new user
router.post("/auth/register", registerUser);

// Login a user - jwt signed token
router.post("/auth/login", loginUser);

// Login a user - cookie
router.post("/auth/cookie/login", loginCookieUser);

// Read user profile (protected route)
router.get("/auth/profile", authUser, getUserProfile);

// Logout
router.post("/auth/logout", logoutUser);

// Verify token
router.get("/auth/verify", verifyToken);

// Create user account
router.post("/create-account", createAccount);

// Read user
router.get("/get-user", getUser);

router.get("/auth/me", authMe);

export default router;
