import { Module } from '@nestjs/common';
import { HabitsService } from './api-data-access-habits.service';
import { ApiModelsModule } from '@cockpit/api/models';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class ApiDataAccessHabitsModule {}
