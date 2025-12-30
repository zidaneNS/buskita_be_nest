import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { BusesService } from './buses.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { DefaultResponse } from 'src/app.contract';
import { CreateBusRequest, FindOneBusResponse, FindAllBusesResponse, busSchema } from './buses.contract';
import { ModelValidationPipe } from 'src/app.validation';
import generateErrMsg from 'src/helpers/generateErrMsg';

@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}
  private readonly logger = new Logger('BusesController');

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<DefaultResponse<FindAllBusesResponse>> {
    try {
      this.logger.log('---FIND ALL---');
      return this.busesService.findAll();
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('schedule/:scheduleId')
  async findBySchedule(@Param('scheduleId') scheduleId: string): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---FIND BY SCHEDULE---');
      this.logger.log(`findBySchedule:::scheduleId: ${scheduleId}`);

      return this.busesService.findBySchedule(scheduleId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findBySchedule:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @UsePipes(new ModelValidationPipe(busSchema))
  @Post()
  async create(@Body() body: CreateBusRequest): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      return this.busesService.create(body);
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
  @UsePipes(new ModelValidationPipe(busSchema))
  @Put(':busId')
  async update(@Body() body: CreateBusRequest, @Param('busId') busId: string): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---UPDATE---');
      this.logger.log(`update:::body: ${JSON.stringify(body)}`);
      this.logger.log(`update:::busId: ${busId}`);

      return this.busesService.update(body, busId);
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
  @Delete(':busId')
  async delete(@Param('busId') busId: string): Promise<DefaultResponse<null>> {
    try {
      this.logger.log('---DELETE---');
      this.logger.log(`delete:::busId: ${busId}`);

      return this.busesService.delete(busId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`delete:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
