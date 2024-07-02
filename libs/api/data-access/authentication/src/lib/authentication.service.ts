import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@cockpit/api-data-access-users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _users: UsersService,
    private readonly _jwt: JwtService
  ) {}

  async authenticate(email: string, passcode: string) {
    const users = await this._users.getAll({ email });
    if (users.length && users[0].accessCode === passcode) {
      const token = await this._jwt.signAsync({ sub: users[0].id });
      return {
        user: users[0],
        token,
      };
    }

    throw new UnauthorizedException();
  }
}
