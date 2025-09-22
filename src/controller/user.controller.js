import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../model/User.model.js'
import { uploadFileOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt, { decode } from 'jsonwebtoken'
import mongoose from 'mongoose';

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});
        
        return {accessToken, refreshToken};
    }
    catch(error) {
        throw new ApiError(500, "Error generating AccessandRefreshToken")
    }
}

const refreshAccessToken = asyncHandler( async (req, res) => {
    // get refresh token from cookies
    // verify refresh token
    // generate new access token
    // return response

    const incomingrefreshtoken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingrefreshtoken) {
        throw new ApiError(401, "Refresh token not found in cookies or body")
    }

    const decoded = jwt.verify(incomingrefreshtoken, process.env.REFRESH_TOKEN)

    if(!decoded) {
        throw new ApiError(400, "Unmatched refresh token")
    }

    const user = await User.findById(decoded._id)

    if(!user) {
        throw new ApiError(404, "User not found with the refresh token")
    }

    if(incomingrefreshtoken !== user?.refreshToken) {
        throw new ApiError(400, "Unmatched refresh token")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed successfully"))
    
})

const loginUser = asyncHandler( async (req, res) => {
    // if (!req.body) {
    //     throw new ApiError(400, "Request body is missing");
    // }
    const { password, email } = req.body
    console.log("Login body:", req.body);


    if( [password, email].some( (field) => field?.trim() === "" ) ) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "Invalid Credentials")
    }

    const isPasswordMatched = await user.isPasswordCorrect(password)

    if (!isPasswordMatched) {
        throw new ApiError(401, "Password Incorrect!")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedinuser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, {
            user: {
                accessToken, refreshToken, loggedinuser
            }
        }, "User logged in successfully")
    )


})

const logoutUser = asyncHandler( async (req, res) => {
    // get user id from req.user
    // find user in db
    // remove refresh token from db
    // remove cookies
    // return response

    const userId = req.user._id

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    user.refreshToken = undefined
    await user.save({validateBeforeSave: false})

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )


    
})

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response


    const {fullname, email, username, password } = req.body
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullname: fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase(), 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const changePassword = asyncHandler( async (req, res) => {
    // get user id from req.user
    // get old password and new password from req.body
    // validate - not empty
    // find user in db
    // check for old password correctness
    // update with new password
    // return response

    const { oldPassword, newPassword } = req.body

    if ( [oldPassword, newPassword].some( (field) => field?.trim() === "" ) ) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user?._id)

    const isPasswordMatched = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordMatched) {
        throw new ApiError(401, "Old Password is incorrect")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: true})

    res.status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req, res) => {

    return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler( async (req, res) => {
    // get user id from req.user
    // get details from req.body

    const { fullname, email } = req.body;

    if( [fullname, email].some( (field) => field?.trim() === "")) {
        throw new ApiError(401, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        { 
            $set: {
            fullname,
            email: email
            }
        },

        {new: true}
    ).select("-password -refreshToken")

    res.status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"))
})

const updateAvatar = asyncHandler( async (req, res) => {
    // get user id from req.user
    // get avatar from req.file
    // upload avatar to cloudinary
    // update user document in db
    // return response

    const user = req.user;

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Error in uploading coverImage file")
    }

    user.avatar = avatar.url;
    await user.save( {validateBeforeSave: false} )

    res.status(200)
    .json(new ApiResponse(200, {}, "Avatar updated successfully"))
})

const updateCoverImage = asyncHandler( async (req, res) => {
    // get user id from req.user
    // get coverImage from req.file
    // upload coverImage to cloudinary
    // update user document in db
    // return response

    const user = req.user;

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file is required")
    }

    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

    if (!coverImage) {
        throw new ApiError(400, "Error in uploading coverImage file")
    }

    user.coverImage = coverImage.url;
    await user.save( {validateBeforeSave: false} )

    res.status(200)
    .json(new ApiResponse(200, {}, "coverImage updated successfully"))
})

const getUserChannelProfile = asyncHandler( async (req, res) => {
    // get user id from req.user
    // fetch user details from db
    // return response

    const {username} = req.params;

    if(!username?.trim()) {
        throw new ApiError(400, "Username is required")
    } 

    const channel = await User.aggregate( 
        [
            {
                $match: {
                    username: username.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribedTOchannels"
                }
            },
            {
                $addFields: {
                    subscribersCount: { $size: "$subscribers" },
                    subscribedTOchannelsCount: { $size: "$subscribedTOchannels"  },
                    isSubscribed: {
                        $cond: {

                            if: {$in: [new mongoose.Types.ObjectId(req.user?._id), "$subscribers.subscriber"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    email: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    coverImage: 1,
                    subscribersCount: 1,
                    subscribedTOchannelsCount: 1,
                    isSubscribed: 1,
                    
                }
            }
        ]
    )

    if(!channel?.length ) {
        throw new ApiError(404, "Channel does not exist with the username: " + username)
    }

    res.status(200)
    .json(new ApiResponse(200, channel[0], "channel profile fetched successfully"))

})

const getWatchHistory = asyncHandler( async (req, res) => {
    // get user id from req.user
    // fetch watch history from db
    // return response

    const user = await User.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchedvideos",

                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",

                                pipeline: [
                                    {
                                        $project: {
                                            fullname: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ]
    )

    return res.status(200)
    .json( new ApiResponse(200, "watched History Fetched Successfully", user[0].watchHistory))
})





export { registerUser, 
         loginUser, 
         logoutUser, 
         refreshAccessToken, 
         changePassword,
         getCurrentUser,
         updateAccountDetails,
         updateAvatar,
         updateCoverImage,
         getUserChannelProfile,
         getWatchHistory
        }