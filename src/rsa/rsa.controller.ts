import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { RsaService } from './rsa.service';
import { DecryptRequest, EncryptRequest, GenerateEValueRequest, GenerateEValueResponse, GenerateKeyRequest, GenerateKeyResponse, GetKeyResponse } from './rsa.contract';
import { DefaultResponse } from 'src/app.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';


@Controller('rsa')
export class RsaController {
  constructor(private readonly rsaService: RsaService) {}
  private readonly logger = new Logger('RsaController', { timestamp: true })

  @Post()
  @HttpCode(200)
  generateEValue(@Body() body: GenerateEValueRequest): DefaultResponse<GenerateEValueResponse> {
    try {
      this.logger.log('---GENERATE E VALUES---');
      this.logger.log(`generateEvalue:::body: ${JSON.stringify(body)}`);

      return this.rsaService.generateEValue(body);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`generateEvalue:::ERROR: ${errMessage}`);
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get-key')
  getKey(): DefaultResponse<GetKeyResponse> {
    try {
      this.logger.log('---GET KEY---');

      return this.rsaService.getKey();
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`getKey:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Post('generate-key')
  @HttpCode(200)
  generateKey(@Body() body: GenerateKeyRequest): DefaultResponse<GenerateKeyResponse> {
    try {
      this.logger.log('---GENERATE KEY---');
      this.logger.log(`generateKey:::body: ${JSON.stringify(body)}`);

      return this.rsaService.generateKey(body);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`generateKey:::ERROR: ${errMessage}`);
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('encrypt')
  encrypt(@Query() query: EncryptRequest): DefaultResponse<string> {
    try {
      this.logger.log('---ENCRYPT---');
      this.logger.log(`encrypt:::query: ${JSON.stringify(query)}`);

      return this.rsaService.encrypt(query);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`encrypt:::ERROR: ${errMessage}`);
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('decrypt')
  decrypt(@Query() query: DecryptRequest): DefaultResponse<any> {
    try {
      this.logger.log('---DECRYPT---');
      this.logger.log(`decrypt:::query: ${JSON.stringify(query)}`);

      return this.rsaService.decrypt(query);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`decrypt:::ERROR: ${errMessage}`);
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
