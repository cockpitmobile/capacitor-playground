import { Test } from '@nestjs/testing';
import { ApiDataAccessRewardsService } from './api-data-access-rewards.service';

describe('ApiDataAccessRewardsService', () => {
  let service: ApiDataAccessRewardsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiDataAccessRewardsService],
    }).compile();

    service = module.get(ApiDataAccessRewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
