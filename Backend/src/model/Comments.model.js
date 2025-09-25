import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }
}, {timestamps: true})

CommentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", CommentSchema)