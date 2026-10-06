import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export function useRiderLocation(isRiding: boolean) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'GPS is required to track route delivery.');
        return;
      }

      // Initial grab
      const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ latitude: initial.coords.latitude, longitude: initial.coords.longitude });

      // Continuous watch
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: Number(process.env.EXPO_PUBLIC_GPS_TIME_INTERVAL) || 5000,
          distanceInterval: Number(process.env.EXPO_PUBLIC_GPS_DISTANCE_INTERVAL) || 10,
        },
        (loc) => {
          // Just update the state. The useEffect in MainScreen will handle the broadcasting!
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      );
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, [isRiding]); // 🔥 Clean dependency array. No more memory leaks!

  return { location, setLocation };
}