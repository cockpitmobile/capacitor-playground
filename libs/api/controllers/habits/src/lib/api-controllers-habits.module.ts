import { Module } from '@nestjs/common';
import { ApiControllersHabitsController } from './api-controllers-habits.controller';
import { ApiDataAccessHabitsModule } from '@cockpit/api/data-access/habits';

@Module({
  imports: [ApiDataAccessHabitsModule],
  controllers: [ApiControllersHabitsController],
  providers: [],
  exports: [],
})
export class ApiControllersHabitsModule {}
