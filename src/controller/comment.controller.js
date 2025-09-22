import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../model/Comments.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video

    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.aggregate(
        [
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $project: {
                    content: 1,
                    owner: 1,
                    updatedAt: 1
                }
            }
        ]
    )

    // const options = {
    //     page: parseInt(page, 10),
    //     limit: parseInt(limit, 10),
    //     sort: { createdAt: -1 },
    //     populate: {
    //         'path': 'owner',
    //         'select': 'name email avatar'

    //     }
    // }

    // const paginatedComments = await Comment.aggregatePaginate(comments, options)

    return res.status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const { videoId } = req?.params;

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Videoid is required")
    }

    const { comment } = req?.body;

    if(!comment) {
        throw new ApiError(400, "Comment is required")
    }

    const commentonvideo = await Comment.create(
        {
            content: comment,
            owner: new mongoose.Types.ObjectId(req?.user?._id),
            video: videoId
        }
    )

    return res.status(201)
    .json(new ApiResponse(201, commentonvideo, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId } = req?.params;

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Commentid is required")
    }

    const { newComment } = req?.body;

    if(!newComment) {
        throw new ApiError(400, "New comment is required")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, 
        {
            content: newComment
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"   ))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req?.params;

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Commentid is required")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    return res.status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment

    }