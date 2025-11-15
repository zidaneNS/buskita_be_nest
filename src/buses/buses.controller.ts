import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { BusesService } from './buses.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ROLE, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { DefaultResponse } from 'src/app.contract';
import { CreateBusRequest, CreateBusResponse, FindAllBusesResponse } from './buses.contract';

@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}
  private readonly logger = new Logger('BusesController');

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Get()
  async findAll(): Promise<DefaultResponse<FindAllBusesResponse>> {
    try {
      this.logger.log('---FIND ALL---');
      return this.busesService.findAll();
    } catch (err) {
      this.logger.error(`findAll:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.SuperAdmin, ROLE.Admin)
  @Post()
  async create(@Body() body: CreateBusRequest): Promise<DefaultResponse<CreateBusResponse>> {
    try {
      this.logger.log('---CREATE---');
      this.logger.log(`create:::body: ${JSON.stringify(body)}`);

      return this.busesService.create(body);
    } catch (err) {
      this.logger.error(`create:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
