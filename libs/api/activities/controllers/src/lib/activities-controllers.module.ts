import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesDataAccessModule } from '@cockpit/api/activities-data-access';
import { AwsModule } from '@cockpit/api/aws';

@Module({
  imports: [ActivitiesDataAccessModule, AwsModule],
  controllers: [ActivitiesController],
  providers: [],
  exports: [],
})
export class ActivitiesControllersModule {}
