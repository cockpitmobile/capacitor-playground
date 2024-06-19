import { DeviceInfo } from '@capacitor/device';
import { AppInfo } from '@capacitor/app';

export const getHelpLinkFromDeviceAndAppInfo = (
  deviceInfo: DeviceInfo,
  appInfo: AppInfo
): string => {
  let device;
  if (deviceInfo.model && deviceInfo.manufacturer) {
    device = `${deviceInfo.model} ${deviceInfo.manufacturer}`;
    while (device.includes(' ')) {
      device = device.replace(' ', '-');
    }
  }
  return `mailto:hello@nationwiderun.org?subject=Need help&body=Info for our team: app version ${appInfo.version} build ${appInfo.build} os ${deviceInfo.operatingSystem} device ${device}`;
};
