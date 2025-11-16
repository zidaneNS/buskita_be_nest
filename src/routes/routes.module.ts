import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Route } from 'src/models/routes.model';

@Module({
  controllers: [RoutesController],
  imports: [
    SequelizeModule.forFeature([
      Route
    ])
  ]
})
export class RoutesModule {}
