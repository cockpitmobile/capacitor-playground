import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '@cockpit/api-data-access-authentication';

@Controller('authenticate')
export class AuthenticationController {
  constructor(private readonly _auth: AuthenticationService) {}

  @Post()
  authenticate(@Body() body: { email: string; accessCode: string }) {
    return this._auth.authenticate(body.email, body.accessCode);
  }
}
