import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';

// Helper: Common video MIME types to exclude
const videoMimeTypes = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/webm',
  'video/ogg'
];
async function resizeImage(imgData, width, height, quality = 80) {
  return sharp(imgData)
    .resize(width, height, { fit: sharp.fit.cover })
    .toFormat('jpeg', { quality })
    .toBuffer();
}

export async function imageUploader(folderName, img, setting = null) {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(img.mimetype)) {
      return { flag: false, message: 'Invalid file type. Only JPEG, PNG, or GIF are allowed.' };
    }

    // Prepare upload directory path
    const uploadDir = path.resolve(process.cwd(), 'public', folderName);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique file name
    const ext = path.extname(img.name).toLowerCase();
    const timestamp = Date.now();
    const imageName = `${timestamp}${ext}`;
    const serverFilePath = path.join(uploadDir, imageName);

    // Resize image if settings provided
    const imageBuffer = setting
      ? await resizeImage(img.data, setting.width, setting.height, setting.quality)
      : img.data;

    // Write image to disk
    await fs.writeFile(serverFilePath, imageBuffer);

    // Generate public URL
    const publicUrl = `${process.env.BACKEND_URL}/public/${folderName}/${imageName}`;
    return { flag: true, url: publicUrl };
  } catch (error) {
    console.error('Image upload failed:', error.message);
    return { flag: false, message: 'Image upload failed. Try again.' };
  }
}

export async function deleteFile(folderName, fileName) {
  try {
    const filePath = path.resolve(process.cwd(), 'public', folderName, fileName);
    await fs.unlink(filePath);
    return { flag: true, message: 'File deleted successfully.' };
  } catch (error) {
    console.error('File deletion failed:', error.message);
    return { flag: false, message: 'File deletion failed. It may not exist.' };
  }
}

export async function fileUpload(folderName, file) {
  try {
    // Reject if it's a video file
    if (videoMimeTypes.includes(file.mimetype)) {
      return { flag: false, message: 'Video files are not allowed.' };
    }

    // Prepare upload path
    const uploadDir = path.resolve(process.cwd(), 'public', folderName);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate a unique filename
    const ext = path.extname(file.name).toLowerCase();
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}${ext}`;
    const serverFilePath = path.join(uploadDir, uniqueFileName);

    // Save the file
    await fs.writeFile(serverFilePath, file.data);

    // Generate public URL
    const publicUrl = `${process.env.FRONTEND_URL}/public/${folderName}/${uniqueFileName}`;
    return { flag: true, url: publicUrl };
  } catch (error) {
    console.error('File upload failed:', error.message);
    return { flag: false, message: 'File upload failed. Try again.' };
  }
}

