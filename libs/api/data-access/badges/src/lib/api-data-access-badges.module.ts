import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { ApiModelsModule } from '@cockpit/api/models';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class ApiDataAccessBadgesModule {}
