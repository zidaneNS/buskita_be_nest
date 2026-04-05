import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageEventPayload } from './event.contract';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://buskita.vercel.app',
      'https://5173-firebase-buskita-1770078248486.cluster-aic6jbiihrhmyrqafasatvzbwe.cloudworkstations.dev'
    ]
  }
})
export class EventGateway {
  private readonly logger = new Logger('EventGateway')
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('server')
  handleMessage(@MessageBody() body: MessageEventPayload) {
    this.logger.log('---SERVER EVENT---');
    this.logger.log(`serverEvent:::body: ${JSON.stringify(body)}`);
    
    this.server.emit(body.key, {
      ...body
    });
  }
}
