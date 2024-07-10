import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { Badge } from '@prisma/client';

@Injectable()
export class BadgesService {
  constructor(private readonly _prisma: PrismaService) {}

  getAll(): Promise<Badge[]> {
    return this._prisma.badge.findMany();
  }

  getOneById(id: string): Promise<Badge | null> {
    return this._prisma.badge.findUnique({ where: { id } });
  }

  create(data: Badge): Promise<Badge> {
    return this._prisma.badge.create({ data });
  }

  update(id: string, data: Partial<Badge>): Promise<Badge> {
    return this._prisma.badge.update({ where: { id }, data });
  }

  delete(id: string): Promise<Badge> {
    return this._prisma.badge.delete({ where: { id } });
  }
}
