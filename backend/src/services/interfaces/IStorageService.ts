export interface IStorageService {
  deleteImage(imageUrl: string): Promise<void>;
}
