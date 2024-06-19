import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiModelsModule } from '@cockpit/api/models';
import { ApiDataAccessEmailModule } from '@cockpit/api-data-access-email';

@Module({
  imports: [ApiModelsModule, ApiDataAccessEmailModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class ApiDataAccessUsersModule {}
