import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../model/Video.model.js"
import {User} from "../model/User.model.js"
import {Like} from "../model/Like.model.js"
import {Comment} from "../model/Comments.model.js"
import {Playlist} from "../model/Playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import fs from "fs"
import { title } from "process"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const filter = { isPublished: true }
    if(query) {
        // filter.$or = [
        //     { title: { $regex: query, $options: 'i' } },
        //     { description: { $regex: query, $options: 'i' } }
        // ]

        // TODO: find all videos whose title or description contains the query string (case-insensitive)
        
        const filterVideosbyString = await Video.aggregate(
            [
                {
                    $match: {
                        $or: [
                            { title: { $regex: query, $options: 'i' } },
                            { description: { $regex: query, $options: 'i' } }
                        ]
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        duration: 1,
                        thumbnail: 1,
                        views: 1,
                        isPublished: 1,
                        videoFile: 1
                    }
                }
            ]
        )

        return res.status(200)
        .json(new ApiResponse(200, filterVideosbyString, "All related Videos fetched Successfully"))
    }

    if(userId) {
        // if(!isValidObjectId(userId)) {
        //     throw new ApiError(400, "Invalid userId")
        // }
        // const user = await User.findById(userId)
        // if(!user) {
        //     throw new ApiError(404, "User not found")
        // }
        // filter.owner = userId

        const userVideos = await Video.aggregate(
            [
                { $match: 
                    {
                        owner: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    username: 1,
                                    avatar: 1,
                                    _id: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        owner: { $first: "$owner" }
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        duration: 1,
                        thumbnail: 1,
                        views: 1,
                        isPublished: 1,
                        videoFile: 1,
                        owner: 1
                    }
                }
            ]
        )

        return res.status(200)
        .json(new ApiResponse(200, userVideos, "User Videos fetched Successfully"));
    }

    const sort = {}
    if(sortBy) {
        const sortField = sortBy
        const sortOrder = sortType === 'desc' ? -1 : 1
        sort[sortField] = sortOrder
    } else {
        sort.createdAt = -1 // default sort by createdAt descending
    }   
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort
    }
    const aggregate = Video.aggregate([
        { $match: filter }
    ]);
    const videos = await Video.aggregatePaginate(aggregate, options)
    return res.status(200)
    .json(new ApiResponse(200, videos, "Videos fetched Successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    if( [title, description].some(field => field.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

    // Get uploaded files
    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    // Upload files to Cloudinary (or your storage)
    const videoUpload = await uploadFileOnCloudinary(videoFile.buffer);
    const thumbnailUpload = await uploadFileOnCloudinary(thumbnailFile.buffer);

    // Create video document
    const uploadedVideo = await Video.create(
        {
            title: title.trim(),
            description: description.trim(),
            duration: videoUpload.duration,
            thumbnail: thumbnailUpload.url,
            isPublished: true,
            videoFile: videoUpload.url,
            owner: req.user._id

        }
    )

    
    if(!uploadedVideo) {
        throw new ApiError(500, "Error while publishing the video on cloudinary")
    }
    
    return res.status(201)
    .json(new ApiResponse(201, uploadedVideo, "Video published Successfully"))
   
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId).populate({ path: 'owner', select: 'username avatar _id' });

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    res.status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"))
})

const incrementViewsAndHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true })
                              .populate({ path: 'owner', select: 'username avatar _id' })
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    // push to watch history for logged-in users
    if (req?.user?._id) {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { watchHistory: video._id } })
    }
    return res.status(200).json(new ApiResponse(200, video, "View counted and history updated"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log("Update video request:", { videoId, userId: req?.user?._id, body: req.body });
    
    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    const { title, description } = req.body
    if( [title, description].some(field => field.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

    const thumbnailFile = req?.file;
    let updateData = {
        title: title,
        description: description
    };

    // Only update thumbnail if a new file is provided
    if(thumbnailFile) {
        const thumbnail = await uploadFileOnCloudinary(thumbnailFile.buffer);

        if(!thumbnail) {
            throw new ApiError(500, "Error while uploading thumbnail on cloudinary")
        }

        updateData.thumbnail = thumbnail?.url;
    }

    const video = await Video.findByIdAndUpdate(videoId, 
        {
            $set: updateData
        },
        { new: true } // return the updated document
    );

    if(!video) {
        throw new ApiError(404, "Error while updating video details")
    }

    return res.status(200)
    .json(new ApiResponse(200, video, "Video Details updated Successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log("Delete video request:", { videoId, userId: req?.user?._id });
    
    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    const video = await Video?.findByIdAndDelete(videoId);
    console.log("Video found for deletion:", video);

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    // cascade cleanup: likes, comments, playlist refs, user watchHistory
    await Promise.all([
        Like.deleteMany({ video: new mongoose.Types.ObjectId(videoId) }),
        Comment.deleteMany({ video: new mongoose.Types.ObjectId(videoId) }),
        Playlist.updateMany(
            { videos: new mongoose.Types.ObjectId(videoId) },
            { $pull: { videos: new mongoose.Types.ObjectId(videoId) } }
        ),
        User.updateMany(
            { watchHistory: new mongoose.Types.ObjectId(videoId) },
            { $pull: { watchHistory: new mongoose.Types.ObjectId(videoId) } }
        )
    ])

    res.status(200) 
    .json(new ApiResponse(200, {}, "Video deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save({validateBeforeSave: false})

    return res.status(200)
    .json(new ApiResponse(200, {isPublished: video.isPublished}, "Video publish status toggled Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    incrementViewsAndHistory,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}