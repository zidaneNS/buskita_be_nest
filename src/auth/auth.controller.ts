import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from './auth.contract';
import { DefaultResponse } from 'src/app.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  private readonly logger = new Logger('AuthController');

  @Post('signin')
  async signin(@Body() body: SignInRequest): Promise<DefaultResponse<SignInResponse>> {
    try {
      this.logger.log('---SIGNIN---');
      
      return this.authService.signin(body);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`signin:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('signup')
  async signup(@Body() body: SignUpRequest): Promise<DefaultResponse<SignUpResponse>> {
    try {
      this.logger.log('---SIGNUP---');

      return this.authService.signup(body);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`signup:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
