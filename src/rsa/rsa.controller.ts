import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { RsaService } from './rsa.service';
import { EncryptRequest, GenerateEValueRequest, GenerateEValueResponse, GenerateKeyRequest, GenerateKeyResponse } from './rsa.contract';
import { DefaultResponse } from 'src/app.contract';


@Controller('rsa')
export class RsaController {
  constructor(private readonly rsaService: RsaService) {}

  @Post()
  @HttpCode(200)
  generateEValue(@Body() body: GenerateEValueRequest): DefaultResponse<GenerateEValueResponse> {
    return this.rsaService.generateEValue(body);
  }
  
  @Post('/generate-key')
  @HttpCode(200)
  generateKey(@Body() body: GenerateKeyRequest): DefaultResponse<GenerateKeyResponse> {
    return this.rsaService.generateKey(body);
  }

  @Get('/encrypt')
  encrypt(@Query() query: EncryptRequest): DefaultResponse<any> {
    return this.rsaService.encrypt(query);
  }
}
