import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import { SignInRequest } from './auth.contract';
import { DefaultResponse } from 'src/app.contract';
import bcrypt from 'bcrypt';
import responseTemplate from 'src/helpers/responseTemplate';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepositories: typeof User,

    private jwtService: JwtService
  ) {}

  async signin(body: SignInRequest): Promise<DefaultResponse<any>> {
    const { userId, password } = body;

    const findUser = await this.userRepositories.findOne({ where: {userId} })

    if (!findUser) throw new UnauthorizedException();

    const { password: findPassword, ...data } = findUser.get();

    const matched = await bcrypt.compare(password, findPassword);

    if (!matched) throw new UnauthorizedException();

    return responseTemplate(HttpStatus.OK, 'login succeed', {
      data: await this.jwtService.signAsync(data)
    });
  }
}
