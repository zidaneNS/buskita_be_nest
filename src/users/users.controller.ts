import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse } from './users.contract';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersGuard } from './users.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin)
  @Get()
  findAll(): Promise<DefaultResponse<FindAllUsersResponse>> {
    return this.usersService.findAll()
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, UsersGuard)
  @Get(':userId')
  findOne(@Param('userId') userId: string): Promise<DefaultResponse<FindOneUserResponse>> {
    return this.usersService.findOne(userId)
  }
}
