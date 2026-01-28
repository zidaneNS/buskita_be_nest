import { Controller, Get, HttpException, HttpStatus, Logger, Param, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { DefaultResponse } from 'src/app.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';
import responseTemplate from 'src/helpers/responseTemplate';
import { UploadResponse } from 'src/users/users.contract';

@Controller('file')
export class FileController {
  private readonly logger = new Logger('FileController');
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    dest: './upload/'
  }))
  async upload(@UploadedFile(
    new ParseFilePipeBuilder().build()
  ) image: Express.Multer.File): Promise<DefaultResponse<UploadResponse>> {
    try {
      this.logger.log('---UPLOAD---');
      this.logger.log(`upload:::image: ${JSON.stringify(image)}`);
      const filePath = `${process.env.APP_URL}/file/${image.filename}`;
      return responseTemplate(HttpStatus.CREATED, 'File Uploaded', { data: { filePath } });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`upload:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get(':fileName')
  async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const file = createReadStream(join(process.cwd(), `upload/${fileName}`));
    file.pipe(res);
  }

}
