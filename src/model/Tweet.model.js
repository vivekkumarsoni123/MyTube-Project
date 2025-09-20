import mongoose from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const TweetSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

TweetSchema.plugin(mongooseAggregatePaginate)

export const Tweet = mongoose.model("Tweet", TweetSchema)