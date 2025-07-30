import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { ProjectsService } from '../../data-access/projects';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly _projects: ProjectsService) {}

  @Get()
  getAll() {
    return this._projects.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this._projects.getById(id);
  }

  @Post()
  create(@Body() body: Project) {
    return this._projects.create(body);
  }

  @Put(':id')
  update(@Body() body: Partial<Project>, @Param('id') id: string) {
    return this._projects.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this._projects.delete(id);
  }
}
