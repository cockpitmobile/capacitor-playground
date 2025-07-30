import { Module } from '@nestjs/common';
import { ProjectsDataAccessModule } from '../../data-access/projects';
import { ProjectsController } from './projects.controller';

@Module({
  controllers: [ProjectsController],
  imports: [ProjectsDataAccessModule],
})
export class ProjectsControllerModule {}
