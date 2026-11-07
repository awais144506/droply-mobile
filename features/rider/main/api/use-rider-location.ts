import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export function useRiderLocation(isOnline: boolean) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!isOnline) return;

    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      // 1. Request Foreground Permissions
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        Alert.alert('Permission Denied', 'GPS foreground permission is required to track deliveries.');
        return;
      }

      // 2. Safely Request Background Permissions (Prevents unhandled promise rejection crashes)
      try {
        const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
        if (bgStatus !== 'granted') {
          console.warn('⚠️ Background location permission not granted. Tracking will pause when screen is locked or app is minimized.');
        }
      } catch (err) {
        console.warn('⚠️ Background permission request skipped or unsupported in current environment:', err);
      }

      try {
        const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ latitude: initial.coords.latitude, longitude: initial.coords.longitude });

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: Number(process.env.EXPO_PUBLIC_GPS_TIME_INTERVAL) || 5000,
            distanceInterval: Number(process.env.EXPO_PUBLIC_GPS_DISTANCE_INTERVAL) || 10,
          },
          (loc) => {
            setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          }
        );
      } catch (err) {
        console.error('Error starting location watcher:', err);
      }
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, [isOnline]);

  return { location, setLocation };
}