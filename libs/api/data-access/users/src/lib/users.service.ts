import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  create(activity: User): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...activity,
      },
    });
  }
}
