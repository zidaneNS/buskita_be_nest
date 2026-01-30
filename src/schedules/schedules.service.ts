import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, Sse } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import { Schedule } from 'src/models/schedules.model';
import { CreateScheduleRequest, CronProperties, FindAllScheduleResponse, FindAllSeatWithScheduleStats, FindOneScheduleResponse, ScheduleWithSeatInfo, SeatWithScheduleStats } from './schedules.contract';
import responseTemplate from 'src/helpers/responseTemplate';
import { Bus } from 'src/models/buses.model';
import { Route } from 'src/models/routes.model';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';
import generateErrMsg from 'src/helpers/generateErrMsg';
import { Sequelize } from 'sequelize-typescript';
import { ScheduleUser } from 'src/models/schedule_user.model';
import { nanoid } from 'nanoid';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import generateCronProperties from 'src/helpers/generateCronProperties';
import { EventGateway } from 'src/event/event.gateway';

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

    @InjectModel(User)
    private userRepositories: typeof User,

    @InjectModel(ScheduleUser)
    private scheduleUserRepositories: typeof ScheduleUser,

    private sequelize: Sequelize,

    private schedulerRegistry: SchedulerRegistry,

    private eventGateway: EventGateway,
  ) { }

  private readonly logger = new Logger('SchedulesService');

  async findAll(): Promise<DefaultResponse<FindAllScheduleResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      const schedules = await this.scheduleRepositories.findAll({
        include: [
          Bus,
          Seat,
          User,
          Route
        ]
      });

      const scheduleWithSeatInfo: Partial<ScheduleWithSeatInfo>[] = schedules.map(item => {
        const { users, seats, ...restData } = item.get() as Schedule;

        return {
          ...restData,
          totalSeats: seats.length,
          totalUser: users.length,
          users,
        }
      });

      return responseTemplate(HttpStatus.OK, 'find all schedules', { data: scheduleWithSeatInfo });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(scheduleId: string): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---FIND ONE---');
      this.logger.log(`findOne:::scheduleId: ${scheduleId}`);

      const foundSchedule = await this.scheduleRepositories.findByPk(scheduleId, {
        include: [
          Bus,
          Seat,
          Route,
          User
        ]
      });
      if (!foundSchedule) throw new NotFoundException(`schedule with id ${scheduleId} not found`);

      return responseTemplate(HttpStatus.OK, 'schedule found', { data: foundSchedule });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findOne:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findScheduleByUser(user: User): Promise<DefaultResponse<FindAllSeatWithScheduleStats>> {
    try {
      this.logger.log('---FIND SCHEDULE BY USER---');
      const foundUser = await this.userRepositories.findByPk(user.userId, {
        include: [
          {
            model: Seat,
            include: [
              {
                model: Schedule,
                include: [
                  User,
                  Seat,
                  Route
                ]
              },
              Bus
            ]
          }
        ]
      });
      if (!foundUser) throw new NotFoundException('user not found');

      const userData = foundUser.get() as User;
      const userSeats = userData.seats.map(s => {
        const { schedule, ...restData } = s.get() as Seat;
        const { users, seats, ...restSchedule } = schedule.get() as Schedule;

        return {
          ...restData,
          schedule: {
            ...restSchedule,
            totalUser: users.length,
            totalSeats: seats.length,
          },
        }
      }) as SeatWithScheduleStats[];

      return responseTemplate(HttpStatus.OK, `${userSeats.length} schedules by user`, { data: userSeats });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findScheduleByUser:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(body: CreateScheduleRequest): Promise<DefaultResponse<FindOneScheduleResponse>> {
    const transaction = await this.sequelize.transaction();
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      const { busId, routeId, time, isClosed } = body;

      const bus = await this.busRepositories.findByPk(busId);
      if (!bus) throw new NotFoundException('bus not found');

      const route = await this.routeRepositories.findByPk(routeId);
      if (!route) throw new NotFoundException('route not found');

      const totalSeats = bus.get().totalRow * bus.get().totalCol + bus.get().totalBackseat;
      const scheduleId = nanoid(6);

      const schedule = await this.scheduleRepositories.create({
        scheduleId,
        time,
        routeId,
        busId,
        isClosed
      }, { transaction });

      this.logger.log(`schedule id: ${schedule.get().scheduleId}`);

      const seatsRecord = Array.from({ length: totalSeats }, (_, id) => ({
        seatId: `${scheduleId}-${id}`,
        seatNumber: id + 1,
        busId,
        scheduleId: scheduleId,
        verified: false
      }));

      await this.seatRepositories.bulkCreate(seatsRecord, { transaction });

      await transaction.commit();
      const foundSeats = await this.seatRepositories.count({ where: { scheduleId: schedule.get().scheduleId } });

      if (totalSeats !== foundSeats) throw new InternalServerErrorException('seats not fully generated');


      return responseTemplate(HttpStatus.CREATED, 'schedule created', { data: schedule });
    } catch (err) {
      await transaction.rollback();
      const errMessage = generateErrMsg(err);
      this.logger.error(`create:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(body: CreateScheduleRequest, scheduleId: string): Promise<DefaultResponse<FindOneScheduleResponse>> {
    try {
      this.logger.log('---UPDATE---');
      this.logger.log(`update:::body: ${JSON.stringify(body)}`);
      this.logger.log(`update:::scheduleId: ${scheduleId}`);

      const schedule = await this.scheduleRepositories.findByPk(scheduleId);
      if (!schedule) throw new BadRequestException(`schedule with id ${scheduleId} not found`);

      await schedule.update({ ...body });

      const {
        time
      } = body;

      const cronProps = generateCronProperties(time);
      
      this.clearCron(scheduleId);
      
      this.addCron(scheduleId, cronProps);
      this.eventGateway.server.emit('schedule', 'update from schedule service');

      return responseTemplate(HttpStatus.OK, 'schedule updated', { data: schedule });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`update:::ERROR: ${errMessage}`);
      this.logger.error(err);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(scheduleId: string): Promise<DefaultResponse<null>> {
    const transaction = await this.sequelize.transaction();
    try {
      this.logger.log('---DELETE---');
      this.logger.log(`delete:::scheduleId: ${scheduleId}`);

      const foundSchedule = await this.scheduleRepositories.findByPk(scheduleId);

      if (!foundSchedule) throw new BadRequestException(`schedule with id ${scheduleId} not found`);

      await this.scheduleUserRepositories.destroy({
        where: { scheduleId: scheduleId },
        transaction
      })
      await foundSchedule.destroy({ transaction });

      await transaction.commit();

      return responseTemplate(HttpStatus.NO_CONTENT, 'schedule successfully deleted');
    } catch (err) {
      await transaction.rollback();
      const errMessage = generateErrMsg(err);
      this.logger.error(`delete:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  addCron(name: string, cronProps: CronProperties) {
    const {
      second,
      minute,
      hour,
      day,
      month
    } = cronProps;

    const cronTime = {
      second: second ? second : '0',
      minute: minute ? minute : '0',
      hour: hour ? hour : '0',
      day: day ? day : '0',
      month: month ? month : '1',
    };

    const job = new CronJob(`${cronTime.second} ${cronTime.minute} ${cronTime.hour} ${cronTime.day} ${cronTime.month} *`, () => {
      this.logger.log(`job from ${name} in ${JSON.stringify(cronTime)}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Add Cron Job For ${name}, ${JSON.stringify(cronTime)}`);
  }

  clearCron(name: string) {
    try {
      const isExistCron = this.schedulerRegistry.getCronJob(name);

      if (isExistCron) {
        isExistCron.stop();
        this.schedulerRegistry.deleteCronJob(name);
      }
    } catch (err) {

    }
  }

  @Cron('0 0 0 * * *')
  handleCron() {
    
  }
}