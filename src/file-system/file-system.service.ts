import { Injectable } from '@nestjs/common';
import { log } from 'console';
import * as fs from 'fs';

@Injectable()
export class FileSystemService {
  private fs = fs;
  constructor() {}
  writeFile(path: string, data: string) {
    try {
      this.fs.writeFileSync(path, data);
    } catch (error) {
      throw new Error(`Error writing file: ${error}`);
    }
  }
  readFile(path: string, encoding: string = 'utf8') {
    try {
      const data = this.fs.readFileSync(path, {
        encoding: encoding as BufferEncoding,
        flag: 'r',
      });
      return { data: data };
    } catch (error) {
      return{
        error: 'Error reading file',
        details: error.message,
      
      }
    }
  }
}
