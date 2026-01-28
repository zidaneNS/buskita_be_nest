import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  @Get()
  async getFile(@Query() query: { fileName: string }, @Res() res: Response) {
    console.log(process.cwd())
    const file = createReadStream(join(process.cwd(), `upload/${query.fileName}`));
    file.pipe(res);
  }
}
