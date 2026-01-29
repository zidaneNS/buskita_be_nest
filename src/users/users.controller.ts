import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Patch, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse, UpdateProfileRequest, ValidateUserRequest } from './users.contract';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersGuard } from './users.guard';
import generateErrMsg from 'src/helpers/generateErrMsg';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/users.model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }
  private readonly logger = new Logger('UsersController');

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Get()
  async findAll(): Promise<DefaultResponse<FindAllUsersResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      return this.usersService.findAll();
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('info')
  async getInfo(@Req() req: Request): Promise<DefaultResponse<FindOneUserResponse>> {
    try {
      this.logger.log('---GET INFO---');
      
      const [_, token] = req.headers.authorization?.split(' ') ?? [];
      
      if (!token) throw new UnauthorizedException();
      
      const { iat, exp, ...decoded } = this.jwtService.decode(token);
      const user = decoded as User;
      
      return this.usersService.findOne(user.userId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`getInfo:::ERROR: ${errMessage}`);
      
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UsersGuard)
  @Put(':userId')
  async updateProfile(@Param('userId') userId: string, @Body() body: UpdateProfileRequest): Promise<DefaultResponse<FindOneUserResponse>> {
    try {
      this.logger.log('---UPDATE PROFILE---');
      this.logger.log( `updateProfile:::userId: ${userId}`);
      this.logger.log(`updateProfile:::body: ${JSON.stringify(body)}`);

      return this.usersService.updateProfile(userId, body);
    } catch (err) {
      const errMessage = generateErrMsg(err);

      this.logger.error(`updateProfile:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Patch(':userId')
  async validateUser(@Param('userId') userId: string, @Body() body: ValidateUserRequest): Promise<DefaultResponse<FindOneUserResponse>> {
    try {
      this.logger.log('---VALIDATE USER---');
      this.logger.log(`validateUser:::userId: ${userId}`);
      this.logger.log(`validateUser:::body: ${JSON.stringify(body)}`);

      return this.usersService.validateUser(userId, body);
    } catch (err) {
      const errMessage = generateErrMsg(err);

      this.logger.error(`validateUser:::ERROR: ${errMessage}`);
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UsersGuard)
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<DefaultResponse<FindOneUserResponse>> {
    try {
      this.logger.log('---FIND ONE---');
      this.logger.log(`findOne:::params: ${JSON.stringify(userId)}`);

      return this.usersService.findOne(userId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findOne:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
