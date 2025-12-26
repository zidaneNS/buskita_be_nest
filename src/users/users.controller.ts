import { Controller, Get, HttpException, HttpStatus, Logger, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse } from './users.contract';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersGuard } from './users.guard';
import generateErrMsg from 'src/helpers/generateErrMsg';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}
  private readonly logger = new Logger('UsersController');
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin)
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
