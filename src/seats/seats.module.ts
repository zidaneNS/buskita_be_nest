import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';
import { Role } from 'src/models/roles.model';
import { Schedule } from 'src/models/schedules.model';
import { ScheduleUser } from 'src/models/schedule_user.model';
import { EventGateway } from 'src/event/event.gateway';

@Module({
  controllers: [SeatsController],
  providers: [
    SeatsService,
    EventGateway,
  ],
  imports: [
    SequelizeModule.forFeature([
      Seat,
      User,
      Role,
      Schedule,
      ScheduleUser
    ])
  ]
})
export class SeatsModule {}
