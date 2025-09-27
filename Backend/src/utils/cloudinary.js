import {v2 as cloudinary} from "cloudinary"
import streamifier from "streamifier";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadFileOnCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) {
            return reject("No file buffer provided");
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

const deleteFileFromCloudinary = async (publicId, resourceType = "auto") => {
    return new Promise((resolve, reject) => {
        if (!publicId) {
            return reject("No public ID provided");
        }

        cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    
    try {
        // Extract public ID from Cloudinary URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
        // Should extract: sample
        // Example: https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp4
        // Should extract: sample
        
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        
        // Find the index of 'upload' in the path
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex === -1) return null;
        
        // Get the part after 'upload' and before the last segment (which is the filename)
        const publicIdParts = pathParts.slice(uploadIndex + 2); // Skip 'upload' and version
        
        if (publicIdParts.length === 0) return null;
        
        // Join all parts except the last one (filename) to get the full public ID
        const publicId = publicIdParts.join('/');
        
        // Remove file extension if present
        const lastDotIndex = publicId.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return publicId.substring(0, lastDotIndex);
        }
        
        return publicId;
    } catch (error) {
        console.error("Error extracting public ID from URL:", url, error);
        return null;
    }
};

export {uploadFileOnCloudinary, deleteFileFromCloudinary, extractPublicIdFromUrl}