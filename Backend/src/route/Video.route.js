import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    incrementViewsAndHistory,
} from "../controller/Video.controller.js"

import {jwtVerify, jwtOptional} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

router
    .route("/")
    .get(getAllVideos)
    .post(
        jwtVerify,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(jwtVerify, deleteVideo)
    .patch(jwtVerify, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(jwtVerify, togglePublishStatus);
router.route("/view/:videoId").post(jwtOptional, incrementViewsAndHistory);

export default router