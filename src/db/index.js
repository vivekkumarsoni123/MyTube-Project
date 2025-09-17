import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import {MONGO_DATABASE} from "../constant.js";
import express from "express";
const app = express();


const connectDB = async () => {
    try {
        const connectinstance = await mongoose.connect(`${process.env.MONGO_URI}/${MONGO_DATABASE}`)
        // console.log("Connected to MongoDB successfully");
        app.on("error", (err) => {
            console.error("Server error:", err);
            throw err;
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export default connectDB;










// (async () => {

//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${MONGO_DATABASE}`)
//         app.on("error", (err) => {
//             console.error("Server error:", err);
//         });
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });
//         console.log("Connected to MongoDB successfully");
//     }
//     catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//     }
// })()
