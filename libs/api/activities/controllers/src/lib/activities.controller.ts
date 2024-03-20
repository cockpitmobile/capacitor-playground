import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActivitiesService } from '@cockpit/activities-data-access';
import { TestActivity } from '@prisma/client';

@Controller('activities')
export class ActivitiesController {

  constructor(private readonly activities: ActivitiesService) {
  }

  @Get('/')
  getActivities(): Promise<TestActivity[]> {
    return this.activities.getAll();
  }

  @Post()
  createActivity(@Body() activity: TestActivity): Promise<TestActivity> {
    return this.activities.create(activity);
  }
}
