import { TestActivity } from '@cockpit/mobile/data-models';

export function addCachedActivities(
  activities: TestActivity[],
  storedActivities?: TestActivity[]
): TestActivity[] {
  // compare the stored activities with the fetched activities and keep the extra activities that are stored
  const extraActivities = storedActivities?.filter(
    (storedActivity) =>
      !activities.find((activity) => activity.id === storedActivity.id)
  );
  return extraActivities ? [...activities, ...extraActivities] : activities;
}
