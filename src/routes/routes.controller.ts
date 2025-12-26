import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DefaultResponse } from 'src/app.contract';
import generateErrMsg from 'src/helpers/generateErrMsg';
import responseTemplate from 'src/helpers/responseTemplate';
import { Route } from 'src/models/routes.model';

@Controller('routes')
export class RoutesController {
  constructor(
    @InjectModel(Route)
    private routeRepositories: typeof Route
  ) {}

  private readonly logger = new Logger('RoutesController');

  @Get()
  async findAll(): Promise<DefaultResponse<{ data: Route[] }>> {
    try {
      this.logger.log('---FIND ALL---');

      const routes = await this.routeRepositories.findAll();
      return responseTemplate(HttpStatus.OK, 'find all routes', { data: routes });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
