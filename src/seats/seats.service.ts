import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';
import { FindAllSeatResponse } from './seats.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';
import { Schedule } from 'src/models/schedules.model';
import responseTemplate from 'src/helpers/responseTemplate';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat)
    private seatRepositories: typeof Seat,

    @InjectModel(User)
    private userRepositories: typeof User,

    @InjectModel(Schedule)
    private scheduleRepositories: typeof Schedule,
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
}
