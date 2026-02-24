import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Friday AI",
  slug: "friday-ai-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSMicrophoneUsageDescription: "This app uses your microphone to record voice messages for Friday AI.",
      NSLocalNetworkUsageDescription: "This app uses local network to communicate with Friday AI.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#050505",
    },
    permissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.INTERNET",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/splash.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#050505",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
