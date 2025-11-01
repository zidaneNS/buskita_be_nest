import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse } from './users.contract';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<DefaultResponse<FindAllUsersResponse>> {
    return this.usersService.findAll()
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string): Promise<DefaultResponse<FindOneUserResponse>> {
    return this.usersService.findOne(userId)
  }
}
