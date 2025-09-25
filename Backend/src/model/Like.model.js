import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    likedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }
}, {timestamps: true})


export const Like = mongoose.model("Like", LikeSchema)