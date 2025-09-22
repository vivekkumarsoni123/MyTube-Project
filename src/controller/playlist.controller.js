import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../model/Playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!req?.user?._id) {
        throw new ApiError(401, "Unauthorized, First Login or SignUp")
    }

    const newPlaylist = await Playlist.create( 
        {
            name,
            description,
            owner: req?.user?._id
        }
    )
    return res.status(201)
    .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    videos: 1
                }
            }
        ]
    )

    return res.status(200)
    .json(new ApiResponse(200, playlists, "User Playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)
    .select("name description videos owner -_id")

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))  
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video into the playlist

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist")
    }
    // To add a videoId to the playlist.videos array:
    playlist.videos.push(videoId)

    await playlist.save({validateBeforeSave: true})

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const videoIndex = playlist.videos.indexOf(videoId)
    if(videoIndex === -1) {
        throw new ApiError(404, "Video not found in playlist")
    }

    // To replace the video at videoIndex with newVideoId:
    // playlist.videos.splice(videoIndex, 1, newVideoId)

    playlist.videos.splice(videoIndex, 1)

    await playlist.save({validateBeforeSave: true})

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name: name,
                description: description
            }
        },
        {new: true}
    )

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist details updated successfully"))


})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}