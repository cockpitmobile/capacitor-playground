import { Controller, Get, Param } from '@nestjs/common';
import { RewardsService } from '@cockpit/api-data-access-rewards';
import { AwsService } from '@cockpit/api/aws';

@Controller('rewards')
export class ApiControllersRewardsController {
  constructor(
    private readonly _rewards: RewardsService,
    private readonly _aws: AwsService
  ) {}

  @Get()
  getRewards() {
    return this._rewards.getAllRewards();
  }
}
