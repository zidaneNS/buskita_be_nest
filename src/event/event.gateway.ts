import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'dgram';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: string, @ConnectedSocket() socket: Socket): string {
    console.log(body);
    console.log('Hello world');
    socket.emit('message', 'test');

    return 'Hello world!';
  }
}
