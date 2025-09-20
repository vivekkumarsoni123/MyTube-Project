import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controller/dashboard.controller.js"
import {jwtVerify} from "../middleware/auth.middleware.js"

const router = Router();

router.use(jwtVerify); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router