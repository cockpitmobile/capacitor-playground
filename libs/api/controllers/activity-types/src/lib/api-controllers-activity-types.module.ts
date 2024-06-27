import { Module } from '@nestjs/common';
import { ActivityTypesController } from './activity-types.controller';
import { ApiDataAccessActivityTypesModule } from '@cockpit/api-data-access-activity-types';

@Module({
  imports: [ApiDataAccessActivityTypesModule],
  controllers: [ActivityTypesController],
  providers: [],
  exports: [],
})
export class ApiControllersActivityTypesModule {}
