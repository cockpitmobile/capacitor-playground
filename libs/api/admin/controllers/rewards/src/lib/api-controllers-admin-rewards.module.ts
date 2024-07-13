import { Module } from '@nestjs/common';
import { ApiControllersAdminRewardsController } from './api-controllers-admin-rewards.controller';
import { ApiDataAccessRewardsModule } from '@cockpit/api-data-access-rewards';
import { AwsModule } from '@cockpit/api/aws';

@Module({
  imports: [ApiDataAccessRewardsModule, AwsModule],
  controllers: [ApiControllersAdminRewardsController],
  providers: [],
  exports: [],
})
export class ApiControllersAdminRewardsModule {}
