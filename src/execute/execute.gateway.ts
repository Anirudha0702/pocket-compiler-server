import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

@WebSocketGateway({ port: 3000, cors: { origin: '*' } })
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

  @SubscribeMessage('execute-py')
  async execute(@MessageBody() code: string, @ConnectedSocket() client: Socket) {
    this.logger.log(`Received code: ${code}`);

    // Security: Restrict code execution (Example: Allow only print statements)
    if (/import|exec|open|os|sys|subprocess|shutil/i.test(code)) {
      this.logger.warn('Blocked potentially unsafe Python execution.');
      client.emit('error', 'Execution blocked for security reasons.');
      return;
    }

    const python: ChildProcessWithoutNullStreams = spawn('python', ['-c', code]);

    python.stdout.on('data', (data) => {
      this.logger.log(`stdout: ${data}`);
      client.emit('stdout', data.toString());
    });

    python.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      this.logger.warn(`stderr: ${errorOutput}`);
      client.emit('stderr', errorOutput);

      if (errorOutput.includes('input()')) {
        client.emit('request-input', 'Python script requires input.');
      }
    });

    python.on('close', (code) => {
      this.logger.log(`Python process exited with code ${code}`);
      client.emit('exit', code);
      client.disconnect(true);
    });

    python.stdin.on('error', (err) => {
      this.logger.warn(`stdin error: ${err.message}`);
    });

    client.on('send-input', (input) => {
      if (!python.killed) {
        this.logger.log(`Received user input: ${input}`);
        python.stdin.write(input + '\n');
      }
    });

    client.on('disconnect', () => {
      if (!python.killed) {
        python.kill();
        this.logger.log(`Terminated Python process for disconnected client.`);
      }
    });
  }



  @SubscribeMessage('execute-c')
  async executeC(@MessageBody() code: string, @ConnectedSocket() client: Socket) {
    this.logger.log(`Received code: ${code}`);

    // Security: Restrict code execution (Example: Allow only print statements)
    if (/import|exec|open|os|sys|subprocess|shutil/i.test(code)) {
      this.logger.warn('Blocked potentially unsafe C execution.');
      client.emit('error', 'Execution blocked for security reasons.');
      return;
    }

    const c: ChildProcessWithoutNullStreams = spawn('gcc', ['-o', 'test', '-x', 'c', '-'], { stdio: 'pipe' });

    c.stdin.write(code);

    c.stdout.on('data', (data) => {
      this.logger.log(`stdout: ${data}`);
      client.emit('stdout', data.toString());
    });

    c.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      this.logger.warn(`stderr: ${errorOutput}`);
      client.emit('stderr', errorOutput);
    });

    c.on('close', (code) => {
      this.logger.log(`C process exited with code ${code}`);
      client.emit('exit', code);
      client.disconnect(true);
    });

    c.stdin.on('error', (err) => {
      this.logger.warn(`stdin error: ${err.message}`);
    });

    client.on('disconnect', () => {
      if (!c.killed) {
        c.kill();
        this.logger.log(`Terminated C process for disconnected client.`);
      }
    });
  }


  @SubscribeMessage('execute-java')
  async executeJava(@MessageBody() code: string, @ConnectedSocket() client: Socket) {
    this.logger.log(`Received code: ${code}`);

    // Security: Restrict code execution (Example: Allow only print statements)
    // if (/exec|open|os|sys|subprocess|shutil/i.test(code)) {
    //   this.logger.warn('Blocked potentially unsafe Java execution.');
    //   client.emit('error', 'Execution blocked for security reasons.');
    //   return;
    // }
//write sode in fileeee
    const java: ChildProcessWithoutNullStreams = spawn('javac', ['Main.java'], { stdio: 'pipe' });

    java.stdin.write(code);

    java.stdout.on('data', (data) => {
      this.logger.log(`stdout: ${data}`);
      client.emit('stdout', data.toString());
    });

    java.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      this.logger.warn(`stderr: ${errorOutput}`);
      client.emit('stderr', errorOutput);
    });

    java.on('close', (code) => {
      this.logger.log(`Java process exited with code ${code}`);
      client.emit('exit', code);
      client.disconnect(true);
    });

    java.stdin.on('error', (err) => {
      this.logger.warn(`stdin error: ${err.message}`);
    });

    client.on('disconnect', () => {
      if (!java.killed) {
        java.kill();
        this.logger.log(`Terminated Java process for disconnected client.`);
      }
    });
  }
}
