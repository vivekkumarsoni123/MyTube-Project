import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js"; // use the configured app

connectDB()
.then(()=> {
    console.log("Database connected successfully");
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.error("Database connection failed:", error);
});