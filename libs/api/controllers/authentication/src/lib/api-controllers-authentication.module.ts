import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { ApiDataAccessAuthenticationModule } from '@cockpit/api-data-access-authentication';

@Module({
  imports: [ApiDataAccessAuthenticationModule],
  controllers: [AuthenticationController],
  providers: [],
  exports: [],
})
export class ApiControllersAuthenticationModule {}
