import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../model/User.model.js'

export const jwtVerify = asyncHandler(async (req, res, next) =>  {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized, token undefined") 
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

        if(!decoded) {
            throw new ApiError(401, "Unauthorized, token invalid")
        }

        const user = await User.findById(decoded?._id).select("-password -refreshToken")

        if(!user) {
            throw new ApiError(404, "User not found with the token")
        }
        req.user = user
        next()
    }
    catch (error) {
        return res.status(401).json({message: "Unauthorized"})
    }
})