// class ApiError extends Error {
//     constructor(statusCode,message="Something went wrong",errors = [], stack = "") {
//         super(message);
//         this.statusCode = statusCode;
//         this.errors = errors;
//         this.stack = stack || new Error().stack;
//         this.data = null;
//         this.message = message;
//         this.success = false;
        
//     }
// }

// export { ApiError };


class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}