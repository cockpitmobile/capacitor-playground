import { Pet } from '@cockpit/mobile/data-models';
import { getShortDayOfWeek, isSameDay } from '@cockpit/mobile-utils-dates';

export const sortPets = (pets: Pet[]): Pet[] => {
  return pets.sort((petA, petB) => petA.pet_name.localeCompare(petB.pet_name));
};

export const setupPet = (pet: Pet) => {
  let newTime = '';
  let secondsLeft = Math.round(pet.pet_total_time_seconds);

  // Calculate Hours
  if (Math.floor(secondsLeft / 3600) > 0) {
    newTime += Math.floor(secondsLeft / 3600) + ':';
    secondsLeft = secondsLeft % 3600;
  } else {
    newTime += '0:';
  }

  // Calculate Minutes
  const minutes = Math.floor(secondsLeft / 60);
  if (minutes > 0) {
    if (minutes < 10) {
      newTime += '0';
    }
    newTime += minutes + ':';
    secondsLeft = secondsLeft % 60;
  } else {
    newTime += '00:';
  }

  // Calculate Seconds
  if (secondsLeft < 10) {
    newTime += '0';
  }
  if (secondsLeft < 0) {
    secondsLeft *= -1;
    newTime = `-${newTime}${secondsLeft}`;
  } else {
    newTime += secondsLeft;
  }

  // Initialize Pet total time
  pet.pet_total_time = newTime;

  // Initialize Pet Active Days
  const current = new Date();
  current.setDate(current.getDate() - 4);
  pet.activeDays = [];
  for (let i = 0; i < 7; i++) {
    pet.activeDays.push({
      title: getShortDayOfWeek(current),
      isFilled: pet.activities
        ? pet.activities.find((eventResult) => {
            const date = new Date(eventResult.time_completed_at);
            return isSameDay(date, current);
          })
        : false,
      isToday: isSameDay(current),
      isFuture: new Date() < current,
    });
    current.setDate(current.getDate() + 1);
  }

  return {
    ...pet,
  };
};
