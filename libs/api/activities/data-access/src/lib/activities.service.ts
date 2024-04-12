import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { TestActivity } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(): Promise<TestActivity[]> {
    return this.prisma.testActivity.findMany();
  }

  create(activity: TestActivity): Promise<TestActivity> {
    return this.prisma.testActivity.create({
      data: {
        ...activity,
      },
    });
  }

  update(id: number, activity: Partial<TestActivity>): Promise<TestActivity> {
    return this.prisma.testActivity.update({
      where: {
        id,
      },
      data: {
        ...activity,
      },
    });
  }
}
