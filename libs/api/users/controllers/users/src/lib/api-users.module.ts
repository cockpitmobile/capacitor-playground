import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ApiDataAccessUsersModule } from '@cockpit/api-data-access-users';
import { ApiDataAccessHabitsModule } from '@cockpit/api/data-access/habits';

@Module({
  imports: [ApiDataAccessUsersModule, ApiDataAccessHabitsModule],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class ApiUsersModule {}
