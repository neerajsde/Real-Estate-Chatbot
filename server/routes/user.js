import express from "express";
const router = express.Router();
import resSender from "../utils/resSender.js";

import {
    createUser, userLogin, logoutUser, changePassword,
    getUserDetails, updateUserDetails, deleteUser,
    getUserPreferences, updateUserPreferences
} from "../controllers/user.js";

import {
    auth
} from "../middlewares/Auth.js";

router.post("/register", createUser);
router.post("/login", userLogin);
router.post("/logout", auth, logoutUser);
router.put("/change-password", auth, changePassword);
router.get("/me", auth, getUserDetails);
router.put("/me", auth, updateUserDetails);
router.delete("/me", auth, deleteUser);
router.get('/preference', auth, getUserPreferences);
router.put('/preference', auth, updateUserPreferences);
router.get("/dashboard", auth, (req, res) => resSender(res, 200, true, "Welcome to your dashboard", req.user));


export default router;