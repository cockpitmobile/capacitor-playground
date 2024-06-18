import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiModelsModule } from '@cockpit/api/models';

@Module({
  imports: [ApiModelsModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class ApiDataAccessUsersModule {}
