import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiModelsModule } from '@cockpit/api/models';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesDataAccessModule {}
