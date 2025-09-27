import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"]
}))

//routes import
import userRouter from './route/user.route.js'
import healthcheckRouter from "./route/healthcheck.route.js"
import tweetRouter from "./route/tweet.route.js"
import subscriptionRouter from "./route/subscription.route.js"
import videoRouter from "./route/Video.route.js"
import commentRouter from "./route/comment.route.js"
import likeRouter from "./route/like.route.js"
import playlistRouter from "./route/playlist.route.js"
import dashboardRouter from "./route/dashboard.route.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export { app };