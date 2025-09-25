import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
    checkSubscriptionStatus,
} from "../controller/subscription.controller.js"
import {jwtVerify} from "../middleware/auth.middleware.js"

const router = Router();
router.use(jwtVerify); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.route("/u/:channelId").get(getUserChannelSubscribers);

router.route("/status/:channelId").get(checkSubscriptionStatus);

export default router