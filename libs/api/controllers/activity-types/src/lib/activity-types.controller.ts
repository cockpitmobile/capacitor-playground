import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityTypesService } from '@cockpit/api-data-access-activity-types';
import { ActivityType } from '@prisma/client';
import { JwtAuthGuard } from '@cockpit/api-guard-authentication';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly _activityTypes: ActivityTypesService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<ActivityType[]> {
    return this._activityTypes.getAll();
  }
}
