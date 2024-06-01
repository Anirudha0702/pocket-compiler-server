import { Module } from '@nestjs/common';
import { CompilerService } from './compiler.service';
import { CompilerController } from './compiler.controller';
import { FileSystemService } from 'src/file-system/file-system.service';

@Module({
  providers: [CompilerService,FileSystemService],
  controllers: [CompilerController]
})
export class CompilerModule {}
