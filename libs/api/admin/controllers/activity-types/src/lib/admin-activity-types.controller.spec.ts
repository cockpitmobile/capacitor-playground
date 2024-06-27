import { Test, TestingModule } from '@nestjs/testing';
import { AdminActivityTypesController } from './admin-activity-types.controller';

describe('AdminActivityTypesController', () => {
  let controller: AdminActivityTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminActivityTypesController],
    }).compile();

    controller = module.get<AdminActivityTypesController>(
      AdminActivityTypesController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
