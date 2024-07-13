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
import { FileInterceptor } from '@nestjs/platform-express';
import { Reward } from '@prisma/client';
import { from, of, switchMap } from 'rxjs';
import { RewardsService } from '@cockpit/api-data-access-rewards';
import { Multer } from 'multer';
import { AwsService } from '@cockpit/api/aws';

@Controller('admin/rewards')
export class ApiControllersAdminRewardsController {
  constructor(
    private readonly _rewards: RewardsService,
    private readonly _aws: AwsService
  ) {}

  @Get()
  getRewards() {
    return this._rewards.getAllRewards();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createReward(
    @Body() body: Reward,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this._aws
      .uploadExercisrFile(`rewards/${body.id}`, image.buffer, image.mimetype)
      .pipe(
        switchMap(({ link: imageUrl }) =>
          this._rewards.createReward({ ...body, imageUrl })
        )
      );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateReward(
    @Body() body: Partial<Reward>,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File
  ) {
    return from(this._rewards.getRewardById(id)).pipe(
      switchMap((reward) =>
        (image
          ? this._aws.uploadExercisrFile(
              `rewards/${id}`,
              image.buffer,
              image.mimetype
            )
          : of({ link: reward!.imageUrl })
        ).pipe(
          switchMap(({ link: imageUrl }) =>
            this._rewards.updateReward(id, { ...body, imageUrl })
          )
        )
      )
    );
  }

  @Delete(':id')
  deleteReward(@Param('id') id: string) {
    return this._rewards.deleteReward(id);
  }
}
