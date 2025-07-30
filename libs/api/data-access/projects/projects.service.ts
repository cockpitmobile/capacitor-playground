import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly _prisma: PrismaService) {}

  getAll() {
    return this._prisma.project.findMany();
  }

  getById(id: string) {
    return this._prisma.project.findUnique({
      where: {
        id,
      },
    });
  }

  create(data: Project) {
    return this._prisma.project.create({ data });
  }

  update(id: string, data: Partial<Project>) {
    return this._prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return this._prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
