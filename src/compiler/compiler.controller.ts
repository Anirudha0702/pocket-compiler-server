import { Controller, Get, Post, Req } from '@nestjs/common';
import { FileSystemService } from 'src/file-system/file-system.service';
import { CompilerService } from './compiler.service';
import { Request } from 'express';

@Controller('compile')

export class CompilerController {
    constructor(private compile:CompilerService) {}
    
    @Post('java')
    compileJava(@Req() req:Request) {
        return this.compile.compileJava(req); 
    }
    @Post('python')
    compilePython(@Req() req:Request) {
        return this.compile.compilePython(req);
    }
    @Post('c')
    compileC(@Req() req:Request) {
        return this.compile.compileC(req);
    }
    @Post('cpp')
    compileCpp(@Req() req:Request) {
        return this.compile.compileCpp(req);
    }
    @Post('js')
    compileJs(@Req() req:Request) {
        return this.compile.compileJs(req);
    }
}
