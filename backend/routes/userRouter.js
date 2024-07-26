import express from "express";
import { login, register, logout, getUser, updateProfile } from '../controllers/userController.js';
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/updateProfile", isAuthenticated, updateProfile);

export default router;

