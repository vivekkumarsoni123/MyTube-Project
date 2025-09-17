import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  getUserChannelProfile,
  getWatchHistory,
  updateCoverImage,
} from "../controller/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(jwtVerify, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

router.route("/change-password").post(jwtVerify, changePassword);

router.route("/getcurrentuser").get(jwtVerify, getCurrentUser);

router.route("/update-details").patch(jwtVerify, updateAccountDetails);

router.route("/update-avatar").patch(jwtVerify, upload.single("avatar"), updateAvatar)

router.route("/update-coverimage").patch(jwtVerify, upload.single("coverImage"), updateCoverImage)

router.route("/c/:username").get(jwtVerify, getUserChannelProfile)

router.route("/watch-history").get(jwtVerify, getWatchHistory)

export default router;
