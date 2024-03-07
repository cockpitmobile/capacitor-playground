import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.cockpit.exercisr',
  appName: 'Exercisr',
  webDir: '../../dist/apps/exercisr',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
