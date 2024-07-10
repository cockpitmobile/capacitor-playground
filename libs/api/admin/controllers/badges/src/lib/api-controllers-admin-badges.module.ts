import { Module } from '@nestjs/common';
import { AdminBadgesController } from './admin-badges.controller';
import { ApiDataAccessBadgesModule } from '@cockpit/api/data-access/badges';
import { AwsModule } from '@cockpit/api/aws';

@Module({
  imports: [ApiDataAccessBadgesModule, AwsModule],
  controllers: [AdminBadgesController],
  providers: [],
  exports: [],
})
export class ApiControllersAdminBadgesModule {}
