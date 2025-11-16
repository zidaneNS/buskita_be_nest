import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, UseGuards, UsePipes } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DefaultResponse } from 'src/app.contract';
import { CreateScheduleRequest, FindAllScheduleResponse, FindOneScheduleResponse, scheduleSchema } from './schedules.contract';
import { RolesGuard } from 'src/roles/roles.guard';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { ModelValidationPipe } from 'src/app.validation';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}
  private readonly logger = new Logger('SchedulesController');

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<DefaultResponse<FindAllScheduleResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      return this.schedulesService.findAll();
    } catch (err) {
      this.logger.error(`findAll:::ERROR: ${JSON.stringify(err)}`);
      
      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
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
      this.logger.error(`create:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
