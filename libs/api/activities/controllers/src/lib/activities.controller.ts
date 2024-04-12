import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ActivitiesService } from '@cockpit/api/activities-data-access';
import { TestActivity } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AwsService } from '@cockpit/api/aws';
import { Multer } from 'multer';
import { from, map, switchMap } from 'rxjs';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activities: ActivitiesService,
    private readonly _aws: AwsService
  ) {}

  @Get()
  getActivities(): Promise<TestActivity[]> {
    return this.activities.getAll();
  }

  @Post()
  createActivity(@Body() activity: TestActivity): Promise<TestActivity> {
    return this.activities.create(activity);
  }

  @Post(':id/selfie')
  @UseInterceptors(FileInterceptor('file'))
  uploadSelfie(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string
  ) {
    return this._aws
      .uploadExercisrFile(id, file.buffer, file.mimetype)
      .pipe(
        switchMap((response) =>
          from(this.activities.update(+id, { image: response.link })).pipe(
            map(() => response)
          )
        )
      );
  }
}
