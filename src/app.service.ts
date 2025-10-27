import { HttpStatus, Injectable } from '@nestjs/common';
import { DefaultResponse } from './app.contract';

@Injectable()
export class AppService {
  getHello(): DefaultResponse<any> {
    return {
      message: 'api running',
      statusCode: HttpStatus.OK
    }
  }
}
