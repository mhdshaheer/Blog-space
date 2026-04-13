import cloudinary from '../../config/cloudinary';
import { IStorageService } from '../interfaces/IStorageService';

export class StorageService implements IStorageService {
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl || !imageUrl.includes('cloudinary')) return;

      const parts = imageUrl.split('/');
      const lastPart = parts.pop() || '';
      const publicIdWithExtension = lastPart.split('.')[0];
      const folderIndex = parts.indexOf('blog-space');
      if (folderIndex !== -1) {
        const folderPath = parts.slice(folderIndex).join('/');
        await cloudinary.uploader.destroy(`${folderPath}/${publicIdWithExtension}`);
      }
    } catch (error) {
      console.error('[CLOUDINARY] Deletion error:', error);
    }
  }
}
