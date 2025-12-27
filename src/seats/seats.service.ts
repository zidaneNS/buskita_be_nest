import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';
import { FindAllSeatResponse, FindOneSeatResponse } from './seats.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';
import { Schedule } from 'src/models/schedules.model';
import responseTemplate from 'src/helpers/responseTemplate';
import { Sequelize } from 'sequelize-typescript';
import { ScheduleUser } from 'src/models/schedule_user.model';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat)
    private seatRepositories: typeof Seat,

    @InjectModel(User)
    private userRepositories: typeof User,

    @InjectModel(Schedule)
    private scheduleRepositories: typeof Schedule,

    @InjectModel(ScheduleUser)
    private scheduleUserRepositories: typeof ScheduleUser,

    private readonly sequelize: Sequelize,
  ) {}

  private readonly logger = new Logger('SeatService');

  async findAll(scheduleId: string): Promise<DefaultResponse<FindAllSeatResponse>> {
    try {
      this.logger.log('---FIND ALL---');
      this.logger.log(`findAll:::scheduleId: ${scheduleId}`);
      const schedule = await this.scheduleRepositories.findByPk(scheduleId, {
        include: [
          Seat
        ]
      });

      if (!schedule) throw new NotFoundException(`schedule with id ${scheduleId} not found`);

      const scheduleData = schedule.get() as Schedule;
      const seats = scheduleData.seats;

      return responseTemplate(HttpStatus.OK, `seats from schedule ${scheduleId}`, { data: seats });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async attach(user: User, seatId: string): Promise<DefaultResponse<FindOneSeatResponse>> {
    const transaction = await this.sequelize.transaction();
    try {
      this.logger.log('---ATTACH---');
      this.logger.log(`attach:::seatId: ${seatId}`);

      const seat = await this.seatRepositories.findByPk(seatId);
      if (!seat) throw new NotFoundException(`seat with id ${seatId} not found`);

      const seatData = seat.get() as Seat;
      if (seatData.user) throw new BadRequestException('seat is occupied');

      const foundUser = await this.userRepositories.findByPk(user.userId, {
        include: [
          Schedule
        ]
      });
      const foundUserData = foundUser?.get() as User;
      const userSchedules = foundUserData.schedules.map(sc => sc.get());
      if (userSchedules.some(schedule => schedule.scheduleId === seatData.scheduleId)) throw new BadRequestException('schedule already booked');

      const foundSchedule = await this.scheduleRepositories.findByPk(seatData.scheduleId);
      if (!foundSchedule) throw new NotFoundException(`schedule with id ${seat.scheduleId} not found`);

      await seat.update(
        { userId: user.userId },
        { transaction }
      );

      const scheduleUser = await this.scheduleUserRepositories.findOrCreate({
        where: {
          scheduleId: seatData.scheduleId,
          userId: user.userId
        },
        transaction
      });

      console.log('schedule user', scheduleUser);

      await transaction.commit();

      return responseTemplate(HttpStatus.CREATED, 'successfully attach', { data: seat });

    } catch (err) {
      await transaction.rollback();
      const errMessage = generateErrMsg(err);
      this.logger.error(`attach:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
