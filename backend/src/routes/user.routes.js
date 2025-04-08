import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateProfilePic,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { JWTVerify } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", upload.single("file"), registerUser);
router.post("/login", loginUser);


router.get("/current", JWTVerify, getCurrentUser);
router.post("/logout", JWTVerify, logoutUser);
router.post("/change-password", JWTVerify, changePassword);
router.patch("/update-details", JWTVerify, updateAccountDetails);
router.post("/update-profile-picture", upload.single("file"), JWTVerify, updateProfilePic);
router.get("/refresh-token", JWTVerify, refreshAccessToken);

export default router;