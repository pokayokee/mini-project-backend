import express from 'express';
import { createUser, getAllUsers, loginUser, registerUser } from './controllers/usersController.js';

const router = express.Router();

// Read all users
router.get("/users", getAllUsers);

// Create a user
router.post("/users", createUser);

// Register a new user
router.post("/auth/register", registerUser);

// Login a user
router.post("/auth/login", loginUser);

export default router;