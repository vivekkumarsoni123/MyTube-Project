// const asyncHandler = (fn) => async (err,req,res,next) => {
//     try {
//         await fn(req,res,next)
//     }
//     catch (error) {
//         res.status(500 || error.status).json({
//             success: false,
//             message: err.message || "Internal Server Error",
//         })
//     }
// }

const asyncHandler = (fn) => { 
    return (req, res, next) => {
        Promise.resolve(fn(req,res,next)).catch((error)=> {
            console.error("Async handler error:", error)
            next(error)
        })
    }
};

export {asyncHandler}