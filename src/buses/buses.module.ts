import { Module } from '@nestjs/common';
import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bus } from 'src/models/buses.model';
import { Role } from 'src/models/roles.model';
import { Schedule } from 'src/models/schedules.model';

@Module({
  controllers: [BusesController],
  providers: [BusesService],
  imports: [
    SequelizeModule.forFeature([
      Bus,
      Role,
      Schedule
    ])
  ]
})
export class BusesModule {}
