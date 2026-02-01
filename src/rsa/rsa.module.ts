import { Module } from '@nestjs/common';
import { RsaService } from './rsa.service';
import { RsaController } from './rsa.controller';
import { EventGateway } from 'src/event/event.gateway';

@Module({
  controllers: [RsaController],
  providers: [
    RsaService,
    EventGateway,
  ],
})
export class RsaModule {}
