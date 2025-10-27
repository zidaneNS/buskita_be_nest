import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RsaModule } from './rsa/rsa.module';

@Module({
  imports: [RsaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
