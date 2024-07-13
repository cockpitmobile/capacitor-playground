import { Test } from '@nestjs/testing';
import { ApiControllersRewardsController } from './api-controllers-rewards.controller';

describe('ApiControllersRewardsController', () => {
  let controller: ApiControllersRewardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiControllersRewardsController],
    }).compile();

    controller = module.get(ApiControllersRewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
