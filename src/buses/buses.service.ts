import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import responseTemplate from 'src/helpers/responseTemplate';
import { Bus } from 'src/models/buses.model';
import { CreateBusRequest, CreateBusResponse, FindAllBusesResponse } from './buses.contract';
import { v4 as uuid } from 'uuid'

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

  async create(body: CreateBusRequest): Promise<DefaultResponse<CreateBusResponse>> {
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
}
