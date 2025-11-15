import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RsaModule } from './rsa/rsa.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { Role } from './models/roles.model';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Bus } from './models/buses.model';
import { Route } from './models/routes.model';
import { Schedule } from './models/schedules.model';
import { ScheduleUser } from './models/schedule_user.model';
import { Seat } from './models/seats.model';
import { BusesModule } from './buses/buses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RsaModule, 
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        User,
        Role,
        Bus,
        Route,
        Schedule,
        ScheduleUser,
        Seat
      ]
    }),
    AuthModule,
    BusesModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
