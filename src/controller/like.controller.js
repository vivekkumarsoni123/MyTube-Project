import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../model/Like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    const liked = await Like.findOneAndDelete({ video: videoId, likedby: req?.user?._id });
    // const liked = await Like.aggregate(
    //     [
    //         {
    //             $match: {
    //                 video: new mongoose.Types.ObjectId(videoId),
    //                 likedby: new mongoose.Types.ObjectId(req?.user?._id)
    //             }
    //         }
    //     ]
    // )
    
    // if (liked.length > 0) {
    //     await Like.findByIdAndDelete(liked[0]._id);

    //     return res.status(200).
    //     json(new ApiResponse(true, "Video unliked successfully", null, null));
    // }

    if(liked) {
        return res.status(200)
        .json(new ApiResponse(true, "Video unliked successfully", null, null));
    }
    else {
        await Like.create(
            {
                video: new mongoose.Types.ObjectId(videoId),
                likedby: new mongoose.Types.ObjectId(req?.user?._id)
            }
        )

        return res.status(200)
        .json(new ApiResponse(true, "Video liked successfully", null, null));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    //TODO: toggle like on comment

    const liked = await Like.findOneAndDelete({ comment: commentId, likedby: req?.user?._id });
    // const liked = await Like.aggregate(
    //     [
    //         {
    //             $match: {
    //                 comment: new mongoose.Types.ObjectId(commentId),
    //                 likedby: new mongoose.Types.ObjectId(req?.user?._id)
    //             }
    //         }
    //     ]
    // )
    
    // if (liked.length > 0) {
    //     await Like.findByIdAndDelete(liked[0]._id);

    //     return res.status(200).
    //     json(new ApiResponse(true, "Comment unliked successfully", null, null));
    // }

    if(liked) {
        return res.status(200).json(new ApiResponse(true, "Comment unliked successfully", null, null));
    }
    else {
        await Like.create(
            {
                comment: new mongoose.Types.ObjectId(commentId),
                likedby: new mongoose.Types.ObjectId(req?.user?._id)
            }
        )

        return res.status(200)
        .json(new ApiResponse(true, "Comment liked successfully", null, null));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const liked = await Like.findOneAndDelete({ tweet: tweetId, likedby: req?.user?._id });
    // const liked = await Like.aggregate(
    //     [
    //         {
    //             $match: {
    //                 tweet: new mongoose.Types.ObjectId(tweetId),
    //                 likedby: new mongoose.Types.ObjectId(req?.user?._id)
    //             }
    //         }
    //     ]
    // )
    
    // if (liked.length > 0) {
    //     await Like.findByIdAndDelete(liked[0]._id);

    //     return res.status(200).
    //     json(new ApiResponse(true, "Tweet unliked successfully", null, null));
    // }

    if(liked) {
        return res.status(200).json(new ApiResponse(true, "Tweet unliked successfully", null, null));
    }
    else {
        await Like.create(
            {
                tweet: new mongoose.Types.ObjectId(tweetId),
                likedby: new mongoose.Types.ObjectId(req?.user?._id)
            }
        )

        return res.status(200)
        .json(new ApiResponse(true, "Tweet liked successfully", null, null));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    if(!req?.user) {
        throw new ApiError(400, "Unauthorized, first login or register")
    }

    const userId = req?.user?._id;
    const likedVideos = await Like.aggregate(
        [
            {
                $match: {
                    likedby: new mongoose.Types.ObjectId(userId),
                    video: { $ne: null }
                }
            }
        ]
    )

    return res.status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}