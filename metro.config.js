const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Enable ESM and CommonJS resolution for packages like lucide-react-native
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "mjs",
  "cjs",
];

module.exports = withNativeWind(config, { input: "./app/global.css" });