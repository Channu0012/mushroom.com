import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private configured = false;

  constructor(private config: ConfigService) {
    const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME', '');
    const apiKey = config.get<string>('CLOUDINARY_API_KEY', '');
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET', '');

    if (cloudName && !cloudName.includes('REPLACE_WITH')) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      this.configured = true;
      this.logger.log('Cloudinary storage configured');
    } else {
      this.logger.warn('Cloudinary not configured — uploads will be rejected in production');
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<{ url: string; publicId: string }> {
    if (!this.configured) {
      this.logger.warn('Storage not configured — returning placeholder URL');
      return { url: `https://placehold.co/800x600?text=Image+Placeholder`, publicId: 'placeholder' };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${this.config.get('CLOUDINARY_FOLDER', 'mushroom-marketplace')}/${folder}`,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
          max_bytes: 5 * 1024 * 1024, // 5MB
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result!.secure_url, publicId: result!.public_id });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadDocument(file: Express.Multer.File, folder: string): Promise<{ url: string; publicId: string }> {
    if (!this.configured) {
      return { url: `placeholder://document`, publicId: 'placeholder' };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${this.config.get('CLOUDINARY_FOLDER', 'mushroom-marketplace')}/${folder}/private`,
          resource_type: 'raw',
          type: 'private', // private delivery — requires signed URL
          allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_bytes: 10 * 1024 * 1024, // 10MB
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result!.secure_url, publicId: result!.public_id });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    if (this.configured && !publicId.includes('placeholder')) {
      await cloudinary.uploader.destroy(publicId);
    }
  }
}
