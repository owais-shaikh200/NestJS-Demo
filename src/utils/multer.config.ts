import * as multer from 'multer';

export const memoryStorage = multer.memoryStorage();

export const multerConfig = {
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
  fileFilter: (_req: any, file: { mimetype: string; }, cb: (arg0: Error | null, arg1: boolean) => void) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, JPG, and PNG are allowed'), false);
    }
    cb(null, true);
  },
};
