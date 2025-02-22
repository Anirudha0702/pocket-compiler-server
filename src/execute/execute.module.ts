import { Module } from '@nestjs/common';
import { ExecuteGateway } from './execute.gateway';

@Module({
    providers:[ExecuteGateway]
})
export class ExecuteModule {}
