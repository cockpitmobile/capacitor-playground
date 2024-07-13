import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ActivityTypesService } from '@cockpit/api-data-access-activity-types';
import { ActivityType } from '@prisma/client';
import { JwtAuthGuard } from '@cockpit/api-guard-authentication';
import { CacheService } from '@cockpit/api/data-access/cache-service';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(
    private readonly _activityTypes: ActivityTypesService,
    private readonly _cache: CacheService
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<ActivityType[]> {
    return this._activityTypes.getAll();
  }

  // @Post('/cache')
  // async cache(): Promise<void> {
  //   return this._cache.set('test', 'test', 10000);
  // }
  //
  // @Get('/cache')
  // async getCache(): Promise<string | undefined> {
  //   return this._cache.get<string>('test');
  // }
  //
  // @Delete('/cache')
  // async deleteCache(): Promise<void> {
  //   return this._cache.del('test');
  // }
}
