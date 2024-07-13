import { Test } from '@nestjs/testing';
import { ApiDataAccessCacheService } from './api-data-access-cache.service';

describe('ApiDataAccessCacheService', () => {
  let service: ApiDataAccessCacheService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiDataAccessCacheService],
    }).compile();

    service = module.get(ApiDataAccessCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
