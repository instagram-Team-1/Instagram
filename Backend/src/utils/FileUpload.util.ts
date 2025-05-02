import cloudinary from "cloudinary";

const Cloudinary = cloudinary.v2;
Cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export const cloudinaryImageUploadMethod = async (file: string) => {
  return new Promise<string>((resolve, reject) => {
    Cloudinary.uploader.upload(file, (err, res) => {
      if (err) {
        return reject("Upload image error");
      }
      if (res) {
        resolve(res.secure_url);
      } else {
        reject("No response from Cloudinary");
      }
    });
  });
};
