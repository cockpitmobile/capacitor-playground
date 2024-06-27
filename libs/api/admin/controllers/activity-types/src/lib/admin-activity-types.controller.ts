import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ActivityTypesService } from '@cockpit/api-data-access-activity-types';
import { ActivityType } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';
import { AwsService } from '@cockpit/api/aws';
import { from, Observable, switchMap } from 'rxjs';

interface ActivityTypeData {
  name: string;
  file: Express.Multer.File;
  value: string;
  isFeatured?: string;
}

@Controller('admin/activity-types')
export class AdminActivityTypesController {
  constructor(
    private readonly _activityTypes: ActivityTypesService,
    private readonly _aws: AwsService
  ) {}

  @Get()
  getAll(): Promise<ActivityType[]> {
    return this._activityTypes.getAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: ActivityTypeData
  ): Observable<ActivityType> {
    return this._aws
      .uploadExercisrFile(
        `activity-types/${data.name}.svg`,
        file.buffer,
        file.mimetype
      )
      .pipe(
        switchMap((response) =>
          from(
            this._activityTypes.create({
              ...data,
              imageUrl: response.link,
              isFeatured: data.isFeatured === 'true',
            } as unknown as ActivityType)
          )
        )
      );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: Partial<ActivityTypeData>,
    @Param('id') id: string
  ): Observable<ActivityType> {
    return file
      ? this._aws
          .uploadExercisrFile(
            `activity-types/${data.name}.svg`,
            file.buffer,
            file.mimetype
          )
          .pipe(
            switchMap((response) =>
              from(
                this._activityTypes.update(id, {
                  ...data,
                  isFeatured: data.isFeatured === 'true',
                  imageUrl: response.link,
                })
              )
            )
          )
      : from(
          this._activityTypes.update(id, {
            ...data,
            isFeatured: data.isFeatured === 'true',
          })
        );
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<ActivityType> {
    return this._activityTypes.delete(id);
  }
}
