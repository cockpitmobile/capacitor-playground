import { Module } from '@nestjs/common';
import { ActivityTypesController } from './activity-types.controller';
import { ApiDataAccessActivityTypesModule } from '@cockpit/api-data-access-activity-types';
import { ApiDataAccessCacheModule } from '@cockpit/api/data-access/cache-service';

@Module({
  imports: [ApiDataAccessActivityTypesModule, ApiDataAccessCacheModule],
  controllers: [ActivityTypesController],
  providers: [],
  exports: [],
})
export class ApiControllersActivityTypesModule {}
