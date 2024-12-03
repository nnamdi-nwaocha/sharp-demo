import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
    async processImage(
        file: Express.Multer.File,
        technique: string,
        format: keyof sharp.FormatEnum
    ): Promise<Buffer> {
        try {
            const method = (this as any)[technique];
            if (typeof method !== 'function') {
                throw new Error(
                    `Method "${technique}" is not defined or not a function`
                );
            }
            return await method.call(this, file, format);
        } catch (error) {
            console.error(
                `Error during image processing: ${error.message}`
            );
            throw new Error(
                `Failed to process image with technique "${technique}": ${error.message}`
            );
        }
    }
    async blur(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .resize(300, 300)
            .blur(10)
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async rotate(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .rotate(140, { background: "#ddd" })
            .resize(300, 300)
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async tint(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .resize(300, 300)
            .tint({ r: 150, g: 27, b: 200 })
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async grayscale(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .resize(300, 300)
            .grayscale() // or greyscale()
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async flip(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .resize(300, 300)
            .flip()
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async flop(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .resize(300, 300)
            .flop()
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async crop(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const processedBuffer = await sharp(file.buffer)
            .extract({ left: 140, width: 1800, height: 1800, top: 140 })
            .resize(300, 300)
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
    async createComposite(file: Express.Multer.File, format: keyof sharp.FormatEnum) {
        const greyHouse = await sharp(file.buffer)
            .resize(150, 150)
            .grayscale()
            .toBuffer()
        const processedBuffer = await sharp(file.buffer)
            .composite([
                {
                    input: greyHouse,
                    top: 50,
                    left: 50,
                },
            ])
            .resize(300, 300)
            .toFormat(format)
            .toBuffer()
        return `data:image/${format};base64,${processedBuffer.toString('base64')}`;
    }
}