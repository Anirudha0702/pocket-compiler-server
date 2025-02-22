import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { spawn } from 'child_process';

@WebSocketGateway({port: 3000,cors: { origin: '*' }})
export class ExecuteGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ExecutionGateway');
  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('execute')
  async execute(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received code: ${data}`);
    const python = spawn('python', ['-c', data]);
    python.stdout.on('data', (data) => {
      this.logger.log(`stdout: ${data}`);
      client.emit('stdout', data.toString());
    });
    python.stderr.on('data', (data) => {
      this.logger.error(`stderr: ${data}`);
      client.emit('stderr', data.toString());
    });
    python.on('close', (code) => {
      this.logger.log(`child process exited with code ${code}`);
      client.emit('exit', code);
    });
  }
}
