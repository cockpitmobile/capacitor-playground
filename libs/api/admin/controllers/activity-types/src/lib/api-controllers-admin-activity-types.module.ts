import { Module } from '@nestjs/common';
import { AdminActivityTypesController } from './admin-activity-types.controller';
import { ApiDataAccessActivityTypesModule } from '@cockpit/api-data-access-activity-types';
import { AwsModule } from '@cockpit/api/aws';

@Module({
  imports: [ApiDataAccessActivityTypesModule, AwsModule],
  controllers: [AdminActivityTypesController],
  providers: [],
  exports: [],
})
export class ApiControllersAdminActivityTypesModule {}
