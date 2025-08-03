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
