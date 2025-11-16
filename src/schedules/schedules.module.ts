import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from 'src/models/schedules.model';
import { ScheduleUser } from 'src/models/schedule_user.model';
import { Role } from 'src/models/roles.model';
import { Route } from 'src/models/routes.model';
import { Bus } from 'src/models/buses.model';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  imports: [
    SequelizeModule.forFeature([
      Schedule,
      ScheduleUser,
      Role,
      Route,
      Bus,
      Seat
    ])
  ]
})
export class SchedulesModule {}
