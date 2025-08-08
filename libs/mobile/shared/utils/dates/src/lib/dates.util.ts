import { DatePipe } from '@angular/common';

export const getShortDayOfWeek = (date: Date) => {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(new Date(date), 'EEEEEE');
};

export const isSameDay = (day1: Date, day2: Date = new Date()) => {
  return (
    new Date(day1).getFullYear() === new Date(day2).getFullYear() &&
    new Date(day1).getMonth() === new Date(day2).getMonth() &&
    new Date(day1).getDate() === new Date(day2).getDate()
  );
};

export const isSameMonth = (day1: Date, day2: Date = new Date()) => {
  return (
    new Date(day1).getFullYear() === new Date(day2).getFullYear() &&
    new Date(day1).getMonth() === new Date(day2).getMonth()
  );
};

export const getShortMonthOfYear = (date: Date) => {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(new Date(date), 'MMM');
};

export const getTime = (millis: number, type = 'Long') => {
  let newTime = '';
  let secondsLeft = Math.round(millis / 1000);

  if (Math.floor(secondsLeft / 3600) > 0) {
    newTime += Math.floor(secondsLeft / 3600) + ':';
    secondsLeft = secondsLeft % 3600;
  } else if (type === 'Long') {
    newTime += '0:';
  }

  const minutes = Math.floor(secondsLeft / 60);
  if (minutes > 0) {
    if (minutes < 10 && type === 'Long') {
      newTime += '0';
    }
    newTime += minutes + ':';
    secondsLeft = secondsLeft % 60;
  } else {
    newTime += '00:';
  }
  if (secondsLeft < 10) {
    newTime += '0';
  }
  if (secondsLeft < 0) {
    secondsLeft *= -1;
    newTime = `-${newTime}${secondsLeft}`;
  } else {
    newTime += secondsLeft;
  }

  if (millis < 0) {
    return '0:00:00';
  }
  return newTime;
};

export const getLongDate = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(new Date(date), 'MMMM d, yyyy');
};
