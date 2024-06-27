import { ActivityType } from '@prisma/client';

export interface GlobalState {
  activityTypes: ActivityType[];
}
