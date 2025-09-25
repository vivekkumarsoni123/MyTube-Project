import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    removeVideoFromLikes,
    likeVideo,
    getVideoLikeStatus,
} from "../controller/like.controller.js"
import {jwtVerify} from "../middleware/auth.middleware.js"

const router = Router();
router.use(jwtVerify); // Apply verifyJWT middleware to all routes in this file

// Explicit like endpoints
router.route("/videos/:videoId").post(likeVideo);
router.route("/videos/:videoId/status").get(getVideoLikeStatus);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
router.route("/videos/:videoId").delete(removeVideoFromLikes);

export default router