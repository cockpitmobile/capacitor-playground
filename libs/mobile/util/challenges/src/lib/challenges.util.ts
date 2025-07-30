import { Challenge } from '@cockpit/mobile/data-models';

export const getChallengeCountdown = (challenge: Challenge): string => {
  const isStartCountdown = new Date() < new Date(challenge.start_date || '');

  const diff =
    new Date(
      (isStartCountdown ? challenge.start_date : challenge.end_date) || ''
    ).getTime() - new Date().getTime();
  const diffHours = Math.ceil(diff / 1000 / 60 / 60);
  const diffDays = Math.floor(diffHours / 24);
  let message;
  const hourText = diffHours === 1 ? 'HOUR' : 'HOURS';
  const dayText = diffDays === 1 ? 'DAY' : 'DAYS';

  if (isStartCountdown) {
    message = `STARTS IN ${diffDays === 0 ? diffHours : diffDays} ${diffDays === 0 ? hourText : dayText}`;
  } else {
    message = `ENDS IN ${diffDays === 0 ? diffHours : diffDays} ${diffDays === 0 ? hourText : dayText}`;
  }

  return message;
};
