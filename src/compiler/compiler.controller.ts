import { Controller, Get, Post, Req } from '@nestjs/common';
import { FileSystemService } from 'src/file-system/file-system.service';
import { CompilerService } from './compiler.service';
import { Request } from 'express';

@Controller('compiler')

export class CompilerController {
    constructor(private compile:CompilerService) {}
    
    @Post('java')
    compileJava(@Req() req:Request) {

           return this.compile.compileJava(req);
        
    }
    @Get('java')
    readJava() {
        return this.compile.readJava();
    }
}
