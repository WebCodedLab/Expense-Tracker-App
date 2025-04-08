import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from 'dotenv';
import fs from 'fs';

configDotenv();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (filepath) => {
    try {
        if (!filepath) return null;
        const response = await cloudinary.uploader.upload(filepath, { resource_type: "auto", folder: 'inventoryApp' });
        console.log(`Image uploaded successfully, Url: ${response.url}`);
        fs.unlinkSync(filepath);
        return response;
    } catch (error) {
        console.error(`Error uploading image: ${error}`);
        fs.unlinkSync(filepath);
        return null;
    }
};

const deleteImage = async (publiId) =>  {
    try {
        if (!publiId) return null;
        const response = await cloudinary.uploader.destroy(publiId);
        console.log(`Image deleted successfully, Public ID: ${publiId}`);
        return response;
    } catch (error) {
        console.error(`Error deleting image: ${error}`);
        return null;
    }
}

export { uploadImage, deleteImage };