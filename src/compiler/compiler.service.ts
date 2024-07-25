import { Injectable } from '@nestjs/common';
import e, { Request } from 'express';
import * as path from 'path';
import { FileSystemService } from 'src/file-system/file-system.service';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { log } from 'console';

@Injectable()
export class CompilerService {
  constructor(private fs: FileSystemService) {}
  async compileJava(req: Request) {
    const filePath = path.join(process.cwd(),'temp', 'Main.java');
    const classPath = path.join(process.cwd(),  'temp');
    try {
      const fileContent = req.body.code.toString();
      const inputs = req.body.input;
      this.fs.writeFile(filePath, fileContent);
      const compile: {
        success: boolean;
        message: string | null;
        error: string | null;
      } = await new Promise((resolve, reject) => {
        const compileProcess = spawn('javac', [filePath]);
        let errorOutput = '';
        compileProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        compileProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: 'compiled successfully',
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error compiling Java file',
            });
          }
        });
      });
      if (!compile.success) throw new Error(compile.error);
      const execute = await new Promise((resolve, reject) => {
        const executeProcess = spawn('java', ['-cp', classPath, 'Main']);
        let output = '';
        let errorOutput = '';
        inputs.forEach((input: string) => {
          executeProcess.stdin.write(input + '\n');
        });
        executeProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        executeProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        executeProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: output,
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error executing Java file',
            });
          }
        });
      });
      return execute;
    } catch (error) {
      return {
        success: false,
        message: null,
        error: error.message,
      };
    } finally {
      this.fs.deleteFile(filePath);
      this.fs.deleteFile(path.join(classPath, 'Main.class'));
    }
  }
  async compilePython(req: Request) {
    const filePath = path.join(process.cwd(),'temp', 'Main.py');
    try {
      const fileContent = req.body.code.toString();
      const inputs = req.body.input;
      this.fs.writeFile(filePath, fileContent);
      const execute = await new Promise((resolve, reject) => {
        const executeProcess = spawn('python', [filePath]);
        let output = '';
        let errorOutput = '';
        inputs.forEach((input: string) => {
          executeProcess.stdin.write(input + '\n');
        });
        executeProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        executeProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        executeProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: output,
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error executing Python file',
            });
          }
        });
      });
      return execute;
    } catch (error) {
      return {
        success: false,
        message: null,
        error: error.message,
      };
    } finally {
      this.fs.deleteFile(filePath);
    }
  }
  async compileC(req: Request) {
    const filePath = path.join(process.cwd(),'temp','Main.c');
    const outputFilePath = path.join(process.cwd(),  'temp','Main.exe');
    try {
      const fileContent = req.body.code.toString();
      const inputs = req.body.input;
      this.fs.writeFile(filePath, fileContent);
      const compile: {
        success: boolean;
        message: string | null;
        error: string | null;
      } = await new Promise((resolve, reject) => {
        const compileProcess = spawn('gcc', ['-o', outputFilePath, filePath]);
        let errorOutput = '';
        compileProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        compileProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: 'compiled successfully',
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error compiling C file',
            });
          }
        });
      });
      if (!compile.success) throw new Error(compile.error);
      const execute = await new Promise((resolve, reject) => {
        const executeProcess = spawn(outputFilePath);
        let output = '';
        let errorOutput = '';
        inputs.forEach((input: string) => {
          executeProcess.stdin.write(input + '\n');
        });
        executeProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        executeProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        executeProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: output,
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error executing C file',
            });
          }
        });
      });
      return execute;
    } catch (error) {
      return {
        success: false,
        message: null,
        error: error.message,
      };
    } 
    finally {
      this.fs.deleteFile(filePath);
      this.fs.deleteFile(outputFilePath);
    }
  }
  async compileCpp(req: Request) {
    const filePath = path.join(process.cwd(),'temp', 'Main.cpp');
    const outputFilePath = path.join(process.cwd(),'temp', 'Main.exe');
    try {
      const fileContent = req.body.code.toString();
      const inputs = req.body.input;
      this.fs.writeFile(filePath, fileContent);
      const compile: {
        success: boolean;
        message: string | null;
        error: string | null;
      } = await new Promise((resolve, reject) => {
        const compileProcess = spawn('g++', ['-o',outputFilePath, filePath]);
        let errorOutput = '';
        compileProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        compileProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: 'compiled successfully',
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error compiling C++ file',
            });
          }
        });
      });
      if (!compile.success) throw new Error(compile.error);
      const execute = await new Promise((resolve, reject) => {
        const executeProcess = spawn(outputFilePath);
        let output = '';
        let errorOutput = '';
        inputs.forEach((input: string) => {
          executeProcess.stdin.write(input + '\n');
        });
        executeProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        executeProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        executeProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: output,
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error executing C++ file',
            });
          }
        });
      });
      return execute;
    } catch (error) {
      return {
        success: false,
        message: null,
        error: error.message,
      };
    } finally {
      this.fs.deleteFile(filePath);
      this.fs.deleteFile(outputFilePath);
    }
  }
  async compileJs(req: Request) {
    const filePath = path.join(process.cwd(),'temp', 'Main.js');
    try {
      const fileContent = req.body.code.toString();
      const inputs = req.body.input;
      this.fs.writeFile(filePath, fileContent);
      const execute = await new Promise((resolve, reject) => {
        const executeProcess = spawn('node', [filePath]);
        let output = '';
        let errorOutput = '';
        inputs.forEach((input: string) => {
          executeProcess.stdin.write(input + '\n');
        });
        executeProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        executeProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        executeProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              message: output,
              error: null,
            });
          } else {
            resolve({
              success: false,
              message: null,
              error: errorOutput || 'Error executing JavaScript file',
            });
          }
        });
      });
      return execute;
    } catch (error) {
      return {
        success: false,
        message: null,
        error: error.message,
      };
    } finally {
      this.fs.deleteFile(filePath);
    }
  }
}
