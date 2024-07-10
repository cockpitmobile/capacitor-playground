import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { ApiDataAccessBadgesModule } from '@cockpit/api/data-access/badges';

@Module({
  imports: [ApiDataAccessBadgesModule],
  controllers: [BadgesController],
  providers: [],
  exports: [],
})
export class ApiControllersBadgesModule {}
