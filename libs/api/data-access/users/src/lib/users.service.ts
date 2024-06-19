import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(options?: Partial<User>): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        ...options,
      },
    });
  }

  create(user: User): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }
}
