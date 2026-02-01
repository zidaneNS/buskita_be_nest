import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { Role } from '../models/roles.model';
import { ScheduleUser } from 'src/models/schedule_user.model';
import { EventGateway } from 'src/event/event.gateway';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    EventGateway,
  ],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      ScheduleUser
    ])
  ]
})
export class UsersModule {}
