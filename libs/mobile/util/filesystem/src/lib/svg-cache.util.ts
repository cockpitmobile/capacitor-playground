import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import write_blob from 'capacitor-blob-writer';

export const checkIfFileExists = async (name: string): Promise<boolean> => {
  try {
    await Filesystem.stat({
      directory: Directory.Data,
      path: name,
    });
    return true;
  } catch (checkDirException) {
    return false;
  }
};

export const getSvgFromCache = async (name: string): Promise<string | null> => {
  const exists = await checkIfFileExists(`activity-icons/${name}`);

  if (exists) {
    const data = await Filesystem.getUri({
      path: `activity-icons/${name}`,
      directory: Directory.Data,
    });
    return Capacitor.convertFileSrc(data.uri);
  }

  return null;
};

export const saveSvgToCache = async (
  name: string,
  blob: Blob
): Promise<string> => {
  await write_blob({
    blob,
    directory: Directory.Data,
    path: `activity-icons/${name}`,
    recursive: true,
    fast_mode: true,
  });

  const url = (await getSvgFromCache(name)) as string;

  return url;
};
