import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import responseTemplate from 'src/helpers/responseTemplate';
import { Bus } from 'src/models/buses.model';
import { CreateBusRequest, FindOneBusResponse, FindAllBusesResponse } from './buses.contract';
import { v4 as uuid } from 'uuid';
import generateErrMsg from 'src/helpers/generateErrMsg';
import { Schedule } from 'src/models/schedules.model';

@Injectable()
export class BusesService {
  constructor(
    @InjectModel(Bus)
    private busRepositories: typeof Bus,

    @InjectModel(Schedule)
    private scheduleRepositories: typeof Schedule,
  ) { }
  private readonly logger = new Logger('BusesService')

  async findAll(): Promise<DefaultResponse<FindAllBusesResponse>> {
    try {
      this.logger.log('---FIND ALL--');

      const data = await this.busRepositories.findAll() || [];
      return responseTemplate(HttpStatus.OK, 'get all buses', { data })
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBySchedule(scheduleId: string): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---FIND BY SCHEDULE');
      this.logger.log(`findBySchedule:::scheduleId: ${scheduleId}`);

      const foundSchedule = await this.scheduleRepositories.findByPk(scheduleId, { include: [Bus] });
      if (!foundSchedule) throw new NotFoundException(`schedule with id ${scheduleId} not found`);

      const schedule = foundSchedule.get() as Schedule;
      const bus = schedule.bus;

      return responseTemplate(HttpStatus.OK, 'bus found', { data: bus });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findBySchedule:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(body: CreateBusRequest): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      const { name } = body;

      const isExist = await this.busRepositories.findOne({ where: { name } });

      if (isExist) throw new BadRequestException(`bus with identity ${name} is existed`);

      const bus = await this.busRepositories.create({
        busId: uuid(),
        ...body
      });

      return responseTemplate(HttpStatus.OK, 'bus successfully created', { data: bus });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`create:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(body: CreateBusRequest, busId: string): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---UPDATE---');
      this.logger.log(`update:::body: ${JSON.stringify(body)}`);
      this.logger.log(`update:::busId: ${busId}`);

      const foundBus = await this.busRepositories.findByPk(busId, { include: [Schedule] });

      if (!foundBus) throw new BadRequestException(`bus with id ${busId} is not found`);
      const bus = foundBus.get() as Bus;
      
      const busSchedules = bus.schedules.map(s => s.get()) || [] as Schedule[];
      if (busSchedules.length > 0) throw new BadRequestException('there is schedule(s) related with this bus, please delete the related schedule(s) first');

      await foundBus.update({ ...body });

      return responseTemplate(HttpStatus.OK, 'bus successfully updated', { data: foundBus });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`update:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(busId: string): Promise<DefaultResponse<null>> {
    try {
      this.logger.log('---DELETE---');
      this.logger.log(`delete:::busId: ${busId}`);

      const foundBus = await this.busRepositories.findByPk(busId, { include: [Schedule] });
      if (!foundBus) throw new NotFoundException(`bus with id ${busId} not found`);
      const bus = foundBus.get() as Bus;
      const busSchedules = bus.schedules.map(s => s.get()) || [] as Schedule[];

      if (busSchedules.length > 0) throw new BadRequestException('there is schedule related with this bus');

      foundBus.destroy();

      return responseTemplate(HttpStatus.NO_CONTENT, 'success delete bus');
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`delete:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
