import { Controller, Get, HttpException, HttpStatus, Logger, Param, Req, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { DefaultResponse } from 'src/app.contract';
import { FindAllSeatResponse, FindOneSeatResponse } from './seats.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SeatPolicyGuard } from 'src/seat-policy/seat-policy.guard';
import { ACTION, Actions } from 'src/actions/actions.decorator';
import { User } from 'src/models/users.model';

@Controller('seats')
export class SeatsController {
  constructor(
    private readonly seatsService: SeatsService,
    private readonly jwtService: JwtService,
  ) {}

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, SeatPolicyGuard)
  @Actions(ACTION.Create)
  @Get('/attach/:seatId')
  async attach(@Req() req: Request, @Param('seatId') seatId: string): Promise<DefaultResponse<FindOneSeatResponse>> {
    try {
      this.logger.log('---ATTACH---');
      this.logger.log(`attach:::seatId: ${seatId}`);

      const [_, token] = req.headers.authorization?.split(' ')!;
      const user = await this.jwtService.decode(token) as User;

      return this.seatsService.attach(user, seatId);
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`attach:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
