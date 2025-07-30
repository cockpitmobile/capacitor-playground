import { Module } from '@nestjs/common';
import { ApiModelsModule } from '@cockpit/api/models';
import { ProjectsService } from './projects.service';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsDataAccessModule {}
