import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequest } from './auth.contract';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('signin')
  signin(@Body() body: SignInRequest) {
    return this.authService.signin(body);
  }
}
