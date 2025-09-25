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
    // Return full video documents for the user's likes
    if(!req?.user) {
        throw new ApiError(400, "Unauthorized, first login or register")
    }

    const userId = req?.user?._id;
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedby: new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [ { $project: { username: 1, avatar: 1, _id: 1 } } ]
                        }
                    },
                    { $addFields: { owner: { $first: "$owner" } } },
                    { $project: { title: 1, description: 1, thumbnail: 1, views: 1, isPublished: 1, videoFile: 1, owner: 1 } }
                ]
            }
        },
        { $unwind: "$video" },
        { $replaceRoot: { newRoot: "$video" } }
    ])

    return res.status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

const removeVideoFromLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }
    if (!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, first login or register")
    }
    await Like.findOneAndDelete({ video: new mongoose.Types.ObjectId(videoId), likedby: new mongoose.Types.ObjectId(req.user._id) })
    return res.status(200).json(new ApiResponse(200, {}, "Removed from likes"))
})

// Explicit like endpoints for video
const likeVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }
    if (!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, first login or register")
    }
    await Like.findOneAndUpdate(
        { video: new mongoose.Types.ObjectId(videoId), likedby: new mongoose.Types.ObjectId(req?.user?._id) },
        { $setOnInsert: { video: new mongoose.Types.ObjectId(videoId), likedby: new mongoose.Types.ObjectId(req?.user?._id) } },
        { upsert: true, new: true }
    )
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Video liked"))
})

const getVideoLikeStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }
    if (!req?.user?._id) {
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Video like status"))
    }
    const liked = await Like.exists({ video: new mongoose.Types.ObjectId(videoId), likedby: new mongoose.Types.ObjectId(req?.user?._id) })
    return res.status(200).json(new ApiResponse(200, { liked: Boolean(liked) }, "Video like status"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    removeVideoFromLikes,
    likeVideo,
    getVideoLikeStatus
}