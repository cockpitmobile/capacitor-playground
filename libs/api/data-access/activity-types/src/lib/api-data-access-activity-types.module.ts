import { Module } from '@nestjs/common';
import { ActivityTypesService } from './activity-types.service';
import { ApiModelsModule } from '@cockpit/api/models';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [ActivityTypesService],
  exports: [ActivityTypesService],
})
export class ApiDataAccessActivityTypesModule {}
