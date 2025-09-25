import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../model/User.model.js"
import { Subscription } from "../model/Subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    if(channelId === req?.user?._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    // if subscription exists, then unsubscribe else subscribe

    const channel = await User.findById(channelId)
    if(!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req?.user?._id,
        channel: channelId
    })

    if(existingSubscription) {
        // unsubscribe
        await existingSubscription.deleteOne()
        return res.status(200)
        .json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    }

    // subscribe
    else {
        const newSubscription = await Subscription.create(
            {
                subscriber: req?.user?._id,
                channel: channelId
            }
        )

        return res.status(201)
        .json(new ApiResponse(200, newSubscription, "Subscribed successfully"))
    }



})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    const subscribers = await Subscription.aggregate(
        [
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscriberInfo"
                }
            },
            {
                $project: {
                    _id: 1,
                    username: {$arrayElemAt: ["$subscriberInfo.username", 0]},

                }
            }
        ]
    )

    return res.status(200)
    .json(new ApiResponse(200, subscribers, "All Subscribers of channel fetched successfully"))
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    const subscribedChannels = await Subscription.aggregate(
        [
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "subscriberInfo"
                }
            },
            {
                $project: {
                    _id: 1,
                    username: {$arrayElemAt: ["$subscriberInfo.username", 0]},

                }
            }
        ]
    )

    return res.status(200)
    .json(new ApiResponse(200, subscribedChannels, "All Subscribers of channel fetched successfully"))
    
})

// controller to check if user is subscribed to a specific channel
const checkSubscriptionStatus = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId")
    }

    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    const subscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    const isSubscribed = !!subscription

    return res.status(200)
    .json(new ApiResponse(200, { isSubscribed }, "Subscription status fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkSubscriptionStatus
}