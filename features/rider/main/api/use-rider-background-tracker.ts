import { useEffect } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { io, Socket } from 'socket.io-client';

const LOCATION_TASK_NAME = 'ANDROID_BACKGROUND_RIDER_LOCATION_TASK';
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

let backgroundSocket: Socket | null = null;
let activeRiderId: string | null = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: { data?: any; error?: any }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations?.[0];
    if (location && activeRiderId) {
      const { latitude, longitude } = location.coords;
      console.log(`📍 [Android BG GPS] ${latitude}, ${longitude}`);

      if (backgroundSocket && backgroundSocket.connected) {
        backgroundSocket.emit('broadcastLocation', {
          riderId: activeRiderId,
          latitude,
          longitude,
        });
      } else if (BACKEND_URL) {
        // Quick fallback socket emission if dropped
        const tempSocket = io(`${BACKEND_URL}/rider`, {
          transports: ['websocket'],
          auth: { riderId: activeRiderId },
          forceNew: true,
        });
        tempSocket.on('connect', () => {
          tempSocket.emit('broadcastLocation', { riderId: activeRiderId, latitude, longitude });
          setTimeout(() => tempSocket.disconnect(), 2000);
        });
      }
    }
  }
});

export function useRiderBackgroundTracker(isOnline: boolean, riderId?: string) {
  useEffect(() => {
    activeRiderId = riderId || null;

    if (!isOnline || !riderId) {
      if (backgroundSocket) {
        backgroundSocket.disconnect();
        backgroundSocket = null;
      }
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => {});
      return;
    }

    if (!backgroundSocket && BACKEND_URL) {
      backgroundSocket = io(`${BACKEND_URL}/rider`, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        forceNew: true,
        auth: { riderId },
      });

      backgroundSocket.on('connect', () => {
        console.log('🟢 Android Background Socket Connected, ID:', backgroundSocket?.id);
      });
    }

    const startAndroidTracking = async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') return;

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        console.warn('Background location permission denied on Android.');
        return;
      }

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!hasStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: Number(process.env.EXPO_PUBLIC_GPS_TIME_INTERVAL) || 5000,
          distanceInterval: Number(process.env.EXPO_PUBLIC_GPS_DISTANCE_INTERVAL) || 10,
          foregroundService: {
            notificationTitle: 'Droply Delivery Active',
            notificationBody: 'Broadcasting location in the background.',
            notificationColor: '#10b981',
          },
        });
        console.log('🚀 Android Foreground Location Service Started.');
      }
    };

    startAndroidTracking();

    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => {});
      if (backgroundSocket) {
        backgroundSocket.disconnect();
        backgroundSocket = null;
      }
    };
  }, [isOnline, riderId]);
}