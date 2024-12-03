import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndProcessFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      technique: string;
      format: keyof sharp.FormatEnum;
    },
  ) {
    const base64Image = await this.imagesService.processImage(
      file,
      body.technique,
      body.format
    );
    return {
      message: 'File uploaded and processed successfully',
      imageBase64: base64Image,
    };
  }
}
