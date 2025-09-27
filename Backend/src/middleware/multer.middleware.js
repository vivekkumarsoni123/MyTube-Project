import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (_, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  

// No longer using diskStorage
// const storage = multer.diskStorage({ ... });

// Use memoryStorage instead
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage, 
})