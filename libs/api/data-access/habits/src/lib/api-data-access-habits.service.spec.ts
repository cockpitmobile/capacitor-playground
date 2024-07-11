import { Test } from '@nestjs/testing';
import { ApiDataAccessHabitsService } from './api-data-access-habits.service';

describe('ApiDataAccessHabitsService', () => {
  let service: ApiDataAccessHabitsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiDataAccessHabitsService],
    }).compile();

    service = module.get(ApiDataAccessHabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
