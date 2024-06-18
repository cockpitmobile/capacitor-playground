import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller';
import { ApiDataAccessUsersModule } from '@cockpit/api-data-access-users';

@Module({
  imports: [ApiDataAccessUsersModule],
  controllers: [AdminUsersController],
  providers: [],
  exports: [],
})
export class ApiAdminUsersControllersModule {}
