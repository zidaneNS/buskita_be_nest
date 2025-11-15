import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import responseTemplate from 'src/helpers/responseTemplate';
import { Bus } from 'src/models/buses.model';
import { CreateBusRequest, FindOneBusResponse, FindAllBusesResponse } from './buses.contract';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BusesService {
  constructor(
    @InjectModel(Bus)
    private busRepositories: typeof Bus
  ) {}
  private readonly logger = new Logger('BusesService')

  async findAll(): Promise<DefaultResponse<FindAllBusesResponse>> {
    try {
      this.logger.log('---FIND ALL--');

      const data = await this.busRepositories.findAll() || [];
      return responseTemplate(HttpStatus.OK, 'get all buses', { data })
    } catch (err) {
      this.logger.error(`findAll:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(body: CreateBusRequest): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      const { name } = body;

      const isExist = await this.busRepositories.findOne({ where: { name }});

      if (isExist) throw new BadRequestException(`bus with identity ${name} is existed`);

      const bus = await this.busRepositories.create({
        busId: uuid(),
        ...body
      });

      return responseTemplate(HttpStatus.OK, 'bus successfully created', { data: bus });
    } catch (err) {
      this.logger.error(`create:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(body: CreateBusRequest, busId: string): Promise<DefaultResponse<FindOneBusResponse>> {
    try {
      this.logger.log('---UPDATE---');
      this.logger.log(`update:::body: ${JSON.stringify(body)}`);

      const bus = await this.busRepositories.findOne({ where: { busId }});

      if (!bus) throw new BadRequestException(`bus with id ${busId} is not found`);

      await bus.update({...body});

      return responseTemplate(HttpStatus.OK, 'bus successfully updated', { data: bus });
    } catch (err) {
      this.logger.error(`update:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(busId: string): Promise<DefaultResponse<null>> {
    try {
      this.logger.log('---DELETE---');
      this.logger.log(`delete:::busId: ${busId}`);

      const bus = await this.busRepositories.findOne({ where: { busId }});

      if (!bus) throw new BadRequestException(`bus with id ${busId} is not found`);

      const schedules = bus.schedules;

      this.logger.log(`delete:::schedules: ${JSON.stringify(schedules)}`);

      await bus.destroy();
      
      return responseTemplate(HttpStatus.NO_CONTENT, 'bus successfully deleted');
    } catch (err) {
      this.logger.error(`delete:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
