import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.63e5dab493914db5ae7de64aa6c29be9',
  appName: 'tamamsdad',
  webDir: 'dist',
  server: {
    url: "https://63e5dab4-9391-4db5-ae7d-e64aa6c29be9.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;