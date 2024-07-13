import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HabitsService } from '@cockpit/api/data-access/habits';
import { Habit, HabitCompletedDates } from '@prisma/client';

@Controller('habits')
export class ApiControllersHabitsController {
  constructor(private readonly _habits: HabitsService) {}

  @Get()
  getHabits() {
    return this._habits.getAllHabits();
  }

  @Get(':id')
  getHabit(@Param('id') id: string) {
    return this._habits.getHabitById(id);
  }

  @Post()
  createHabit(@Body() body: Habit) {
    return this._habits.createHabit(body);
  }

  @Put(':id')
  updateHabit(@Body() body: Partial<Habit>, @Param('id') id: string) {
    return this._habits.updateHabit(id, body);
  }

  @Delete(':id')
  deleteHabit(@Param('id') id: string) {
    return this._habits.deleteHabit(id);
  }

  @Post(':habitId/completed-dates')
  completeHabitForDate(
    @Body() body: Omit<HabitCompletedDates, 'habitId'>,
    @Param('habitId') habitId: string
  ) {
    return this._habits.createHabitCompletedDate({
      ...body,
      habitId,
    });
  }

  @Get(':habitId/completed-dates')
  getCompletedDatesForHabit(@Param('habitId') habitId: string) {
    return this._habits.getHabitCompletedDates(habitId);
  }

  @Delete(':habitId/completed-dates/:completedDateId')
  deleteCompletedDateForHabit(
    @Param('completedDateId') completedDateId: string
  ) {
    return this._habits.deleteHabitCompletedDate(completedDateId);
  }

  @Post(':habitId/rewards/:rewardId')
  assignRewardToHabit(
    @Param('habitId') habitId: string,
    @Param('rewardId') rewardId: string
  ) {
    return this._habits.assignRewardToHabit(habitId, rewardId);
  }
}
