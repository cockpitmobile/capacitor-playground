export const getFileNameFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').pop() ?? 'default_filename';
};
