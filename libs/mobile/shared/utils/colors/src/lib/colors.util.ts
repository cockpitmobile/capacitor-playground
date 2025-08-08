export const getRAATeamTagBlue = () => {
  return getComputedStyle(document.body).getPropertyValue(
    '--raa-team-tag-blue'
  );
};

export const getDDRed = () => {
  return getComputedStyle(document.body).getPropertyValue('--dd-red');
};
