import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivityTypesService {
  constructor(private readonly _prisma: PrismaService) {}

  getAll() {
    return this._prisma.activityType.findMany();
  }

  update(id: string, data: Partial<ActivityType>) {
    return this._prisma.activityType.update({
      where: { id },
      data,
    });
  }

  create(data: ActivityType) {
    return this._prisma.activityType.create({
      data,
    });
  }

  delete(id: string) {
    return this._prisma.activityType.delete({
      where: { id },
    });
  }
}
