import Cloudinary from 'cloudinary';

import ENV from './constants.js';

Cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async ({ file, path }) => {
  return new Promise((resolve, reject) => {
    Cloudinary.v2.uploader
      .upload_stream(
        {
          folder: `uploads/${path}`
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(file.data);
  });
};

export { uploadToCloudinary };
