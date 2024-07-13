import { Test } from '@nestjs/testing';
import { ApiControllersAdminRewardsController } from './api-controllers-admin-rewards.controller';

describe('ApiControllersAdminRewardsController', () => {
  let controller: ApiControllersAdminRewardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiControllersAdminRewardsController],
    }).compile();

    controller = module.get(ApiControllersAdminRewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
