import { Controller, Get, HttpException, HttpStatus, Logger, Param, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { DefaultResponse } from 'src/app.contract';
import { FindAllSeatResponse } from './seats.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  private readonly logger = new Logger('SeatController');

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Get(':scheduleId')
  async findAll(@Param('scheduleId') scheduleId: string): Promise<DefaultResponse<FindAllSeatResponse>> {
    try {
      this.logger.log('---FIND ALL---');
      this.logger.log(`findAll:::scheduleId: ${scheduleId}`);

      return this.seatsService.findAll(scheduleId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
