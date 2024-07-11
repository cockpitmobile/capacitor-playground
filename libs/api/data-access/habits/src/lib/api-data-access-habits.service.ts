import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { Habit, HabitCompletedDates } from '@prisma/client';

@Injectable()
export class HabitsService {
  constructor(private readonly _prisma: PrismaService) {}

  getAllHabits() {
    return this._prisma.habit.findMany({
      include: {
        HabitDates: true,
      },
    });
  }

  getHabitsForUser(userId: string) {
    return this._prisma.habit.findMany({
      where: {
        userId,
      },
    });
  }

  getCompletedDatesForUser(userId: string) {
    return this._prisma.habitCompletedDates.findMany({
      where: {
        userId,
      },
    });
  }

  getHabitById(id: string) {
    return this._prisma.habit.findUnique({
      where: {
        id,
      },
      include: {
        HabitDates: true,
      },
    });
  }

  createHabit(data: Habit) {
    return this._prisma.habit.create({ data });
  }

  updateHabit(id: string, data: Partial<Habit>) {
    return this._prisma.habit.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteHabit(id: string) {
    return this._prisma.habit.delete({
      where: {
        id,
      },
    });
  }

  createHabitCompletedDate(data: HabitCompletedDates) {
    return this._prisma.habitCompletedDates.create({ data });
  }

  getHabitCompletedDates(habitId: string) {
    return this._prisma.habitCompletedDates.findMany({
      where: {
        habitId,
      },
    });
  }

  deleteHabitCompletedDate(id: string) {
    return this._prisma.habitCompletedDates.delete({
      where: {
        id,
      },
    });
  }

  updateHabitCompletedDate(id: string, data: Partial<HabitCompletedDates>) {
    return this._prisma.habitCompletedDates.update({
      where: {
        id,
      },
      data,
    });
  }
}
