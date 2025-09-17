import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,

    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // url from the cloudinary
        default: null
    },
    coverImage: {
        type: String, // url from the cloudinary
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ]

},{timestamps: true})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password"))  return next();
    // Hash the password here if needed
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) { 
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign( {
        _id : this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
    });
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign( {
        _id : this._id,
    }, process.env.REFRESH_TOKEN, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
    });
}


export const User = mongoose.model("User",userSchema);