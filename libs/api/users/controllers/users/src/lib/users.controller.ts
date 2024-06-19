import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from '@cockpit/api-data-access-users';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  getAll(@Query() query?: any): Promise<User[]> {
    return this._usersService.getAll(query);
  }

  @Post('access-code/reset')
  async resetAccessCode(@Body('email') email: string): Promise<boolean> {
    return this._usersService.sendResetAccessCodeEmail(email.toLowerCase());
  }
}