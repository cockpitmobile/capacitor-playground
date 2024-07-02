import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiDataAccessUsersModule } from '@cockpit/api-data-access-users';

@Module({
  imports: [ApiDataAccessUsersModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class ApiDataAccessAuthenticationModule {}
