import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompilerModule } from './compiler/compiler.module';
import { CompilerController } from './compiler/compiler.controller';
import { CompilerService } from './compiler/compiler.service';
import { FileSystemService } from './file-system/file-system.service';


@Module({
  imports: [CompilerModule],
  controllers: [AppController, CompilerController],
  providers: [AppService, CompilerService,FileSystemService],
})
export class AppModule {}
