import { Module } from '@nestjs/common';
import { CacheService } from './api-data-access-cache.service';

@Module({
  controllers: [],
  providers: [CacheService],
  exports: [CacheService],
})
export class ApiDataAccessCacheModule {}
