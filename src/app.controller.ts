import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DefaultResponse } from './app.contract';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): DefaultResponse<any> {
    return this.appService.getHello();
  }
}
