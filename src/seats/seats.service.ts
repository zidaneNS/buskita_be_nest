import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';
import { FindAllSeatResponse, FindOneSeatResponse, UpdateSeatRequest } from './seats.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';
import { Schedule } from 'src/models/schedules.model';
import responseTemplate from 'src/helpers/responseTemplate';
import { Sequelize } from 'sequelize-typescript';
import { ScheduleUser } from 'src/models/schedule_user.model';
import { EventGateway } from 'src/event/event.gateway';
import generateEventPayload from 'src/helpers/generateEventPayload';

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

    private eventGateway: EventGateway,
  ) { }

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
      
      const foundSeats = await this.seatRepositories.findAll({
        where: {
          scheduleId: scheduleId
        },
        include: [
          User
        ]
      })
      const seats = foundSeats.map(seat => seat.get()) as Seat[];

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
      if (seatData.userId) throw new BadRequestException('seat is occupied');

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

      const schedule = foundSchedule.get() as Schedule;
      if (schedule.isClosed) throw new BadRequestException('schedule closed');

      await seat.update(
        { userId: user.userId },
        { transaction }
      );

      this.eventGateway.server.emit('schedule.management', generateEventPayload({
        key: 'schedule.management',
        message: 'Kursi Terisi'
      }));

      await this.scheduleUserRepositories.findOrCreate({
        where: {
          scheduleId: seatData.scheduleId,
          userId: user.userId
        },
        transaction
      });

      await transaction.commit();

      this.eventGateway.server.emit('schedule.management', generateEventPayload({
        key: 'schedule.management',
        message: 'Kursi Terisi',
      }))

      return responseTemplate(HttpStatus.CREATED, `successfully attach seat number ${seatData.seatNumber}`, { data: seat });

    } catch (err) {
      await transaction.rollback();
      const errMessage = generateErrMsg(err);
      this.logger.error(`attach:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async detach(seatId: string): Promise<DefaultResponse<null>> {
    const transaction = await this.sequelize.transaction();
    try {
      this.logger.log('---DETACH---');
      this.logger.log(`detach:::seatId: ${seatId}`);

      const foundSeat = await this.seatRepositories.findByPk(seatId);
      if (!foundSeat) throw new NotFoundException(`seat with ${seatId} not found`);
      const seat = foundSeat.get() as Seat;
      const userId = seat.userId;
      const scheduleId = seat.scheduleId;

      foundSeat.update(
        { userId: null },
        { transaction }
      );

      await this.scheduleUserRepositories.destroy({
        where: {
          scheduleId,
          userId
        },
        transaction
      });

      await transaction.commit();

      this.eventGateway.server.emit('schedule.management', generateEventPayload({
        key: 'schedule.management',
        message: 'Penumpang Berkurang',
      }));
      this.eventGateway.server.emit('ticket', generateEventPayload({
        key: 'ticket',
        message: 'Tiket Dibatalkan',
        userId: userId,
      }))

      return responseTemplate(HttpStatus.NO_CONTENT, `detach seat number ${seat.seatNumber} successfully`);
    } catch (err) {
      await transaction.rollback();
      const errMessage = generateErrMsg(err);
      this.logger.error(`detach:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(currentSeatId: string, body: UpdateSeatRequest): Promise<DefaultResponse<FindOneSeatResponse>> {
    const transaction = await this.sequelize.transaction();
    try {
      this.logger.log('---UPDATE---');
      this.logger.log(`update:::currentSeatId: ${currentSeatId}`);
      this.logger.log(`update:::body: ${JSON.stringify(body)}`);

      const { seatId } = body;

      const foundCurrSeat = await this.seatRepositories.findByPk(currentSeatId);
      if (!foundCurrSeat) throw new NotFoundException(`current seat with id ${currentSeatId} not found`);

      const currSeat = foundCurrSeat.get() as Seat;

      const userId = currSeat.userId;
      if (!userId) throw new BadRequestException('seat is not belongs to you');

      await foundCurrSeat.update(
        { userId: undefined },
        { transaction }
      );

      const foundSeat = await this.seatRepositories.findByPk(seatId);
      if (!foundSeat) throw new NotFoundException(`seat with id ${seatId} not found`);

      const seat = foundSeat.get() as Seat;

      if (seat.userId) throw new BadRequestException('this seat not empty');

      await foundSeat.update(
        { userId },
        { transaction }
      );

      await transaction.commit();

      return responseTemplate(HttpStatus.OK, `your new seat number is ${seat.seatNumber}`, { data: foundSeat });
    } catch (err) {
      await transaction.rollback();
      const errMessage = generateErrMsg(err);
      this.logger.error(`update:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verify(seatId: string): Promise<DefaultResponse<FindOneSeatResponse>> {
    try {
      this.logger.log('---VERIFY---');
      this.logger.log(`verify:::seatId: ${seatId}`);

      const foundSeat = await this.seatRepositories.findByPk(seatId);
      if (!foundSeat) throw new NotFoundException(`seat with id ${seatId} not found`);

      await foundSeat.update({ verified: true });

      this.eventGateway.server.emit('ticket', generateEventPayload({
        key: 'ticket',
        message: 'Tiket Diverifikasi'
      }))

      return responseTemplate(HttpStatus.OK, 'verified', { data: foundSeat });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`verify:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
