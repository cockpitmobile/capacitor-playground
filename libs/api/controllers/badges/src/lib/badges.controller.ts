import { Controller, Get } from '@nestjs/common';
import { BadgesService } from '@cockpit/api/data-access/badges';

@Controller('badges')
export class BadgesController {
  constructor(private readonly _badges: BadgesService) {}

  @Get()
  getAll() {
    return this._badges.getAll();
  }
}
