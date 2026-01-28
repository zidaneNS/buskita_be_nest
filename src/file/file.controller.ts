import { Controller, Get, Param, Query, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  @Get(':fileName')
  async getFile(@Param() params: { fileName: string }, @Res() res: Response) {
    const file = createReadStream(join(process.cwd(), `upload/${params.fileName}`));
    file.pipe(res);
  }
}
