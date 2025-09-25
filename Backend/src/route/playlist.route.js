import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controller/playlist.controller.js"
import {jwtVerify} from "../middleware/auth.middleware.js"

const router = Router();

// Public reads
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);

// Auth required for writes
router.route("/").post(jwtVerify, createPlaylist)

router
    .route("/:playlistId")
    .patch(jwtVerify, updatePlaylist)
    .delete(jwtVerify, deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(jwtVerify, addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(jwtVerify, removeVideoFromPlaylist);

export default router