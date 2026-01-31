import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Put, Req, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DefaultResponse } from 'src/app.contract';
import { CreateScheduleRequest, FindAllScheduleResponse, FindAllSeatWithScheduleStats, FindOneScheduleResponse, scheduleSchema } from './schedules.contract';
import { RolesGuard } from 'src/roles/roles.guard';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { ModelValidationPipe } from 'src/app.validation';
import generateErrMsg from 'src/helpers/generateErrMsg';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/users.model';
import { FindAllSeatResponse } from 'src/seats/seats.contract';

@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly schedulesService: SchedulesService,

    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger('SchedulesController');

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<DefaultResponse<FindAllScheduleResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      return this.schedulesService.findAll();
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);
      
      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/user')
  async findScheduleByUser(@Req() req: Request): Promise<DefaultResponse<FindAllSeatWithScheduleStats>> {
    try {
      this.logger.log('---FIND SCHEDULE BY USER---');

      const [_, token] = req.headers.authorization?.split(' ') ?? [];

      if (!token) throw new UnauthorizedException();
      const {iat, exp, ...decoded} = this.jwtService.decode(token);

      const user = decoded as User;

      return this.schedulesService.findScheduleByUser(user);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findScheduleByUser:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':scheduleId')
  async findOne(@Param('scheduleId') scheduleId: string): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---FIND ONE---');
      this.logger.log(`findOne:::scheduleId: ${scheduleId}`);

      return this.schedulesService.findOne(scheduleId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findOne:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @UsePipes(new ModelValidationPipe(scheduleSchema))
  @Post()
  async create(@Body() body: CreateScheduleRequest): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      return this.schedulesService.create(body);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`create:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Patch('confirm/:scheduleId')
  async confirmSchedule(@Param('scheduleId') scheduleId: string): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---CONFIRM SCHEDULE---');
      this.logger.log(`confirmSchedule:::scheduleId: ${scheduleId}`);

      return this.schedulesService.confirmSchedule(scheduleId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`confirmSchedule:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @UsePipes(new ModelValidationPipe(scheduleSchema))
  @Put(':scheduleId')
  async update(@Body() body: CreateScheduleRequest, @Param('scheduleId') scheduleId: string): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---UPDATE---');
      this.logger.log(`update:::body: ${JSON.stringify(body)}`);
      this.logger.log(`update:::scheduleId: ${scheduleId}`);

      return this.schedulesService.update(body, scheduleId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`update:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Delete(':scheduleId')
  async delete(@Param('scheduleId') scheduleId: string): Promise<DefaultResponse<null>> {
    try {
      this.logger.log('---DELETE---');
      this.logger.log(`delete:::scheduleId: ${scheduleId}`);

      return this.schedulesService.delete(scheduleId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`delete:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
