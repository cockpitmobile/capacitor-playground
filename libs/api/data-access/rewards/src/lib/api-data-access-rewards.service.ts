import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { Reward } from '@prisma/client';

@Injectable()
export class RewardsService {
  constructor(private readonly _prisma: PrismaService) {}

  getAllRewards() {
    return this._prisma.reward.findMany();
  }

  getRewardById(id: string) {
    return this._prisma.reward.findUnique({
      where: {
        id,
      },
    });
  }

  createReward(data: Reward) {
    return this._prisma.reward.create({ data });
  }

  updateReward(id: string, data: Partial<Reward>) {
    return this._prisma.reward.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteReward(id: string) {
    return this._prisma.reward.delete({
      where: {
        id,
      },
    });
  }
}
