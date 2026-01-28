import { Controller, Get, HttpException, HttpStatus, Logger, Param, ParseFilePipeBuilder, Post, Req, Res, StreamableFile, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse, UploadResponse } from './users.contract';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersGuard } from './users.guard';
import generateErrMsg from 'src/helpers/generateErrMsg';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/users.model';
import responseTemplate from 'src/helpers/responseTemplate';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

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
  @Get('/info')
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    dest: './upload/'
  }))
  async upload(@UploadedFile(
    new ParseFilePipeBuilder().build()
  ) image: Express.Multer.File): Promise<DefaultResponse<UploadResponse>> {
    try {
      this.logger.log('---UPLOAD---');
      this.logger.log(`upload:::image: ${JSON.stringify(image)}`);
      const filePath = `${process.env.APP_URL}/file/${image.filename}`;
      return responseTemplate(HttpStatus.CREATED, 'File Uploaded', { data: { filePath } });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`upload:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
