import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | null> {
    if (!file) return null;

    try {
      return await new Promise<UploadApiResponse>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'regala-app/products' },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Resultado de Cloudinary vacío'));

            resolve(result);
          },
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(upload);
      });
    } catch (error) {
      console.error('Fallo en la subida a Cloudinary:', error.message);
      return null;
    }
  }

}