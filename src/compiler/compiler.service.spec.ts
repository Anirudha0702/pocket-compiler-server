import { Test, TestingModule } from '@nestjs/testing';
import { CompilerService } from './compiler.service';
import { FileSystemService } from 'src/file-system/file-system.service';

describe('CompilerService', () => {
  let service: CompilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompilerService],
    }).compile();

    service = module.get<CompilerService>(CompilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
