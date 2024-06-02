import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import { FileSystemService } from 'src/file-system/file-system.service';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
@Injectable()
export class CompilerService {
    constructor(
        private fs: FileSystemService
    ) {}

    async compileJava(req: Request) {
        try {
            const filePath = path.join(process.cwd(),'src', 'temp', 'Main.java');
           const  classPath = path.join(process.cwd(),'src', 'temp', 'Main.class');
            const fileContent = req.body.code.toString();

            this.fs.writeFile(filePath, fileContent);

            await execPromise(`javac "${filePath}"`);
            const { stdout, stderr } = await execPromise(`java "${filePath}"`);
            this.fs.deleteFile(filePath);
            this.fs.deleteFile(classPath);
            if (stderr) {
                throw new Error(stderr);
              }
            return {
                success: true,
                message: stdout,
                error:null,
            };
        } catch (error) {
            console.error('Error creating Java file:', error);
            return {
                success: false,
                message:null,
               error: error.message,
            };
        }
        finally{
            const filePath = path.join(process.cwd(),'src', 'temp', 'Main.java');
            const classPath = path.join(process.cwd(),'src', 'temp', 'Main.class');
            
            // this.fs.deleteFile(classPath)

        }
    }
    readJava() {
        return this.fs.readFile(path.join(process.cwd(),'src', 'temp', 'main.java'));
    }
}
