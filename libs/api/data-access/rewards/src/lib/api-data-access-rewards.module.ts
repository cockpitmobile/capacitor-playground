import { Module } from '@nestjs/common';
import { RewardsService } from './api-data-access-rewards.service';
import { ApiModelsModule } from '@cockpit/api/models';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class ApiDataAccessRewardsModule {}
