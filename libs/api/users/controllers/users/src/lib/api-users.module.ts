import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ApiDataAccessUsersModule } from '@cockpit/api-data-access-users';

@Module({
  imports: [ApiDataAccessUsersModule],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class ApiUsersModule {}
