import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { Role } from '../models/roles.model';
import { ScheduleUser } from 'src/models/schedule_user.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      ScheduleUser
    ])
  ]
})
export class UsersModule {}
