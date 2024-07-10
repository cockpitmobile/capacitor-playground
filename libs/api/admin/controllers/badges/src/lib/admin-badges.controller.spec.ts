import { Test, TestingModule } from '@nestjs/testing';
import { AdminBadgesController } from './admin-badges.controller';

describe('AdminBadgesController', () => {
  let controller: AdminBadgesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBadgesController],
    }).compile();

    controller = module.get<AdminBadgesController>(AdminBadgesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
