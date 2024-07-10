import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BadgesService } from '@cockpit/api/data-access/badges';
import { Badge } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { AwsService } from '@cockpit/api/aws';
import { forkJoin, from, map, of, switchMap } from 'rxjs';

@Controller('admin/badges')
export class AdminBadgesController {
  constructor(
    private readonly _badges: BadgesService,
    private readonly _aws: AwsService
  ) {}

  @Get()
  getAll() {
    return this._badges.getAll();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'lockedImage', maxCount: 1 },
      { name: 'unlockedImage', maxCount: 1 },
    ])
  )
  create(
    @Body() data: Badge,
    @UploadedFiles()
    files: {
      lockedImage?: Express.Multer.File[];
      unlockedImage?: Express.Multer.File[];
    }
  ) {
    return this._createBadge(
      data,
      files.unlockedImage?.[0],
      files.lockedImage?.[0]
    );
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'lockedImage', maxCount: 1 },
      { name: 'unlockedImage', maxCount: 1 },
    ])
  )
  update(
    @Body() data: Partial<Badge>,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      lockedImage?: Express.Multer.File[];
      unlockedImage?: Express.Multer.File[];
    }
  ) {
    return this._updateBadge(
      id,
      data,
      files.unlockedImage?.[0],
      files.lockedImage?.[0]
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this._badges.delete(id);
  }

  private _uploadBadgeFile(
    data: Pick<Badge, 'id'>,
    file: Express.Multer.File,
    isUnlocked: boolean
  ) {
    return this._aws.uploadExercisrFile(
      `badges/${data.id}${isUnlocked ? '-unlocked' : '-locked'}`,
      file.buffer,
      file.mimetype
    );
  }

  private _createBadge(
    data: Badge,
    unlockedImage?: Express.Multer.File,
    lockedImage?: Express.Multer.File
  ) {
    return forkJoin([
      unlockedImage
        ? this._uploadBadgeFile(data, unlockedImage, true)
        : of({ link: '' }),
      lockedImage
        ? this._uploadBadgeFile(data, lockedImage, false)
        : of({ link: '' }),
    ]).pipe(
      map(([unlocked, locked]) => {
        return this._badges.create({
          ...data,
          badge_image_unlocked_url: unlocked.link,
          badge_image_locked_url: locked.link,
        });
      })
    );
  }

  private _updateBadge(
    id: string,
    data: Partial<Badge>,
    unlockedImage?: Express.Multer.File,
    lockedImage?: Express.Multer.File
  ) {
    return from(this._badges.getOneById(id)).pipe(
      switchMap((badge) =>
        forkJoin([
          unlockedImage
            ? this._uploadBadgeFile(badge!, unlockedImage, true)
            : of({ link: badge!.badge_image_unlocked_url }),
          lockedImage
            ? this._uploadBadgeFile(badge!, lockedImage, false)
            : of({ link: badge!.badge_image_locked_url }),
        ]).pipe(
          switchMap(([unlocked, locked]) =>
            from(
              this._badges.update(id, {
                ...data,
                badge_image_unlocked_url: unlocked.link,
                badge_image_locked_url: locked.link,
              })
            )
          )
        )
      )
    );
  }
}
