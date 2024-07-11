import { Test } from '@nestjs/testing';
import { ApiControllersHabitsController } from './api-controllers-habits.controller';

describe('ApiControllersHabitsController', () => {
  let controller: ApiControllersHabitsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiControllersHabitsController],
    }).compile();

    controller = module.get(ApiControllersHabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
