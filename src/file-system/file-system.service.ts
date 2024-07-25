import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileSystemService {
  private fs = fs;
  constructor() {}
  writeFile(path: string, data: string) {
    try {
      console.log('Writing file on location: ', path);
      this.fs.writeFileSync(path, data);
      console.log('File written on location: ', path);
    } catch (error) {
      throw new Error(`Error writing file: ${error}`);
    }
  }

  deleteFile(path: string) {
    try {
      console.log('Deleting file: ', path);
      this.fs.unlinkSync(path);
      console.log('Deleted file: ', path);
    } catch (error) {
      console.log('Error on deleting file: ', error);
      throw new Error(`Error deleting file: ${error}`);
    }
  }
  createDir(path: string) {
    try {
      this.fs.mkdirSync(path);
    } catch (error) {
      throw new Error(`Error creatinf Dir: ${error}`);
    }
  }
}
