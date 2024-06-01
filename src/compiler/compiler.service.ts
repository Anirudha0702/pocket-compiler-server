import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class CompilerService {
    constructor(
        private fs: FileSystemService
    ) {}

    compileJava(req: Request) {
        try {
            const filePath = path.join(process.cwd(),'src', 'temp', 'main.java');
            const fileContent = req.body.code.toString();

            this.fs.writeFile(filePath, fileContent);
            return 'Java file created';
        } catch (error) {
            console.error('Error creating Java file:', error);
            return {
                error: 'Error creating Java file',
                details: error.message,
            };
        }
    }
    readJava() {
        return this.fs.readFile(path.join(process.cwd(),'src', 'temp', 'main.java'));
    }
}
