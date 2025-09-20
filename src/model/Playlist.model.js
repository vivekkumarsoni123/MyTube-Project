import mongoose from 'mongoose';

const PlaylistScheema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
}, {timestamps: true})

export const Playlist = mongoose.model("Playlist", PlaylistScheema);