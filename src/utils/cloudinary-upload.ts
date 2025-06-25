import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const uploadToCloudinary = (fileBuffer: Buffer, folder = 'products'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed, result is undefined'));
        resolve(result.secure_url);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};
