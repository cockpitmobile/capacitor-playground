import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '@cockpit/api-data-access-users';
import { User } from '@prisma/client';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this._usersService.getAll();
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this._usersService.create(user);
  }
}
