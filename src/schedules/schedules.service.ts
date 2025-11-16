import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import { Schedule } from 'src/models/schedules.model';
import { CreateScheduleRequest, FindAllScheduleResponse, FindOneScheduleResponse } from './schedules.contract';
import responseTemplate from 'src/helpers/responseTemplate';
import { Bus } from 'src/models/buses.model';
import { Route } from 'src/models/routes.model';
import { v4 as uuid } from 'uuid';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule)
    private scheduleRepositories: typeof Schedule,

    @InjectModel(Bus)
    private busRepositories: typeof Bus,

    @InjectModel(Route)
    private routeRepositories: typeof Route,

    @InjectModel(Seat)
    private seatRepositories: typeof Seat,
  ) {}

  private readonly logger = new Logger('SchedulesService');

  async findAll(): Promise<DefaultResponse<FindAllScheduleResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      const schedules = await this.scheduleRepositories.findAll({
        include: [
          Bus,
          Route,
          User
        ]
      });
      return responseTemplate(HttpStatus.OK, 'find all schedules', { data: schedules });
    } catch (err) {
      this.logger.error(`findAll:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(body: CreateScheduleRequest): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      const {busId, routeId, time} = body;

      const bus = await this.busRepositories.findByPk(busId);
      if (!bus) throw new NotFoundException('bus not found');

      const route = await this.routeRepositories.findByPk(routeId);
      if (!route) throw new NotFoundException('route not found');

      const totalSeats = bus.get().totalRow * bus.get().totalCol + bus.get().totalBackseat;

      const schedule = await this.scheduleRepositories.create({
        scheduleId: uuid(),
        time,
        routeId,
        busId
      });

      this.logger.log(`schedule id: ${schedule.get().scheduleId}`);

      const seatsRecord = Array.from({ length: totalSeats }, (_, id) => ({
        seatId: uuid(),
        seatNumber: id + 1,
        busId,
        scheduleId: schedule.get().scheduleId,
        verified: false
      }));

      await this.seatRepositories.bulkCreate(seatsRecord);

      const foundSeats = await this.seatRepositories.count({ where: { scheduleId: schedule.get().scheduleId }});

      if (totalSeats !== foundSeats) throw new InternalServerErrorException('seats not fully generated');

      return responseTemplate(HttpStatus.CREATED, 'schedule created', { data: schedule });
    } catch (err) {
      this.logger.error(`create:::ERROR: ${JSON.stringify(err)}`);
      this.logger.error(err);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}