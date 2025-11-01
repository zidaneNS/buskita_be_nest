import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { RsaService } from './rsa.service';
import { DecryptRequest, EncryptRequest, GenerateEValueRequest, GenerateEValueResponse, GenerateKeyRequest, GenerateKeyResponse, ParseJSONRequest, ReturnJSONRequest } from './rsa.contract';
import { DefaultResponse } from 'src/app.contract';
import { ApiResponse } from '@nestjs/swagger';


@Controller('rsa')
export class RsaController {
  constructor(private readonly rsaService: RsaService) {}

  @Post()
  @HttpCode(200)
  generateEValue(@Body() body: GenerateEValueRequest): DefaultResponse<GenerateEValueResponse> {
    return this.rsaService.generateEValue(body);
  }
  
  @Post('generate-key')
  @HttpCode(200)
  generateKey(@Body() body: GenerateKeyRequest): DefaultResponse<GenerateKeyResponse> {
    return this.rsaService.generateKey(body);
  }

  @Get('encrypt')
  encrypt(@Query() query: EncryptRequest): DefaultResponse<any> {
    return this.rsaService.encrypt(query);
  }

  @Get('decrypt')
  decrypt(@Query() query: DecryptRequest): DefaultResponse<any> {
    return this.rsaService.decrypt(query);
  }

  @Post('parseJSON')
  parseJSON(@Body() body: ParseJSONRequest): DefaultResponse<any> {
    return this.rsaService.parseJSON(body);
  }

  @Get('returnJSON')
  returnJSON(@Query() query: ReturnJSONRequest): DefaultResponse<ParseJSONRequest> {
    return this.rsaService.returnJSON(query);
  }
}
