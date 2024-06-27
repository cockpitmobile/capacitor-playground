import { Controller, Get } from '@nestjs/common';
import { ActivityTypesService } from '@cockpit/api-data-access-activity-types';
import { ActivityType } from '@prisma/client';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly _activityTypes: ActivityTypesService) {}

  @Get()
  getAll(): Promise<ActivityType[]> {
    return this._activityTypes.getAll();
  }
}
