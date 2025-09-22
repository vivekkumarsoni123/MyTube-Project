import mongoose, { mongo } from "mongoose"
import {Video} from "../model/Video.model.js"
import {Subscription} from "../model/Subscription.model.js"
import {Like} from "../model/Like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const channelId = req?.user?._id;

    if(!channelId) {
        throw new ApiError(400, "Unauthorize, first login or rigister");
    }

    const totalVideos = await Video.countDocuments( { owner: channelId })

    const totalSubscribers = await Subscription.countDocuments( { channel: channelId })

    const totalVideoViews = await Video.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { 
                        $sum: "$views"
                    }
                }
            }
        ]
    )

    const totalLikes = await Like.countDocuments( { owner: channelId })

    return res.status(200)
    .json(new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totalVideoViews: totalVideoViews[0]?.totalViews || 0,
        totalLikes
    }, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const channelid  = req?.user?._id;

    if (!channelid) {
        throw new ApiError(400, "Unauthorize, first login or rigister");
    }

    const videos = await Video.find( { owner: channelid })

    return res.status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos

    }
