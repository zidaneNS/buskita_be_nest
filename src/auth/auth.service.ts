import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from './auth.contract';
import { DefaultResponse } from 'src/app.contract';
import bcrypt from 'bcrypt';
import responseTemplate from 'src/helpers/responseTemplate';
import { JwtService } from '@nestjs/jwt';
import generateErrMsg from 'src/helpers/generateErrMsg';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepositories: typeof User,

    private jwtService: JwtService
  ) {}

  private readonly logger = new Logger('AuthService');

  async signin(body: SignInRequest): Promise<DefaultResponse<SignInResponse>> {
    try {
      this.logger.log('---SIGNIN---');

      const { userId, password } = body;
  
      const findUser = await this.userRepositories.findOne({ where: {userId} })
  
      if (!findUser) throw new NotFoundException('User Not Found');
  
      const { password: findPassword, ...data } = findUser.get();
  
      const matched = await bcrypt.compare(password, findPassword);
  
      if (!matched) throw new UnauthorizedException('Wrong Credentials');
  
      return responseTemplate(HttpStatus.CREATED, 'login succeed', {
        data: await this.jwtService.signAsync(data)
      });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`signin:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signup(body: SignUpRequest): Promise<DefaultResponse<SignUpResponse>> {
    try {
      this.logger.log('---SIGNUP---');

      const {
        userId,
        name,
        email,
        password,
        confirmPassword,
        address,
        phoneNumber,
        roleId,
        cardImageUrl,
      } = body

      if (password !== confirmPassword) throw new BadRequestException('password not match');

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        userId,
        name,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        roleId,
        cardImageUrl
      }

      const isExist = await this.userRepositories.findOne({ where: { userId }});

      if (isExist) throw new ConflictException(`user with id ${userId} is existed`);

      const user = await this.userRepositories.create(newUser);

      return responseTemplate(HttpStatus.CREATED, 'user created', {
        data: {
          ...user,
          password: 'restricted'
        } as User
      });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`signup:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
