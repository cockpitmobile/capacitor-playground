import { Module } from '@nestjs/common';
import { ApiControllersRewardsController } from './api-controllers-rewards.controller';
import { ApiDataAccessRewardsModule } from '@cockpit/api-data-access-rewards';
import { AwsModule } from '@cockpit/api/aws';

@Module({
  imports: [ApiDataAccessRewardsModule, AwsModule],
  controllers: [ApiControllersRewardsController],
  providers: [],
  exports: [],
})
export class ApiControllersRewardsModule {}
