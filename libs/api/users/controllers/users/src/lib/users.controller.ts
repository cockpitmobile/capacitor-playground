import { Controller, Get, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from '@cockpit/api-data-access-users';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  getAll(@Query() query?: any): Promise<User[]> {
    return this._usersService.getAll(query);
  }
}
