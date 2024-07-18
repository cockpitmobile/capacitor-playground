import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cockpit.habitapp',
  appName: 'Habit App',
  webDir: '../../dist/apps/exercisr',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always',
  },
  plugins: {
    LiveUpdate: {
      appId: '7e221380-f9d8-4ff7-b9cf-39f042f7d1fb',
      enabled: false,
    },
  },
};

export default config;
