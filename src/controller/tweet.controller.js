import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../model/Tweet.model.js"

import {User} from "../model/User.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body;

    if(!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create( 
        {
            content,
            owner: req?.user?._id
        }
    )

    if(!tweet) {
        throw new ApiError(500, "Failed to create tweet");
    }

    return res.status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const { userId } = req?.params;

    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    // const tweets = await Tweet.find({ owner: userId }).populate("owner", "name username email");

    const tweets = await Tweet.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]
    )

    return res.status(200)  
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req?.params;

    const tweet = await Tweet.findById(tweetId);

    if(!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const { content } = req?.body;

    if(!content) {
        throw new ApiError(400, "Content is required");
    }

    tweet.content = content;
    await tweet.save({validateBeforeSave: true});

    return res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req?.params;

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if(!tweet) {    
        throw new ApiError(404, "Tweet not found");
    }

    return res.status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}