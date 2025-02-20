const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'avatars', 
        });
        return result.secure_url; 
    } catch (err) {
        throw new Error('Cloudinary upload failed: ' + err.message);
    }
};

module.exports = uploadImageCloudinary;
