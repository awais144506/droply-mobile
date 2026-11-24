import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;
const MAX_GPS_ACCURACY_METERS = 35;

export function useRiderSocket(
  isOnline: boolean,
  riderId?: string,
  branchId?: string,
  tier?: string
) {
  const socketRef = useRef<Socket | null>(null);
  const isPlatinum = tier?.toUpperCase() === 'PLATINUM';

  useEffect(() => {
    if (!isOnline || !riderId || !isPlatinum) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!BACKEND_URL) {
      console.warn('⚠️ EXPO_PUBLIC_API_URL is missing in environment variables!');
      return;
    }

    const socket = io(`${BACKEND_URL}/rider`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      forceNew: true,
      auth: { riderId, branchId },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🟢 Connected to Rider WebSocket Gateway, Socket ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🟡 Disconnected from Rider WebSocket Gateway:', reason);
    });

    socket.io.on('reconnect', (attempt) => {
      console.log('🔵 Reconnected to Rider WebSocket Gateway after attempts:', attempt);
    });

    socket.on('connect_error', (err) => {
      console.warn('🔴 WebSocket Connection Error:', err.message);
    });

    return () => {
      socket.removeAllListeners();
      socket.io.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOnline, riderId, branchId, isPlatinum, tier]);

  const broadcastCoordinates = (
    latitude: number,
    longitude: number,
    accuracy?: number | null
  ) => {
    if (!isPlatinum) return;
    if (typeof accuracy === 'number' && Number.isFinite(accuracy) && accuracy > MAX_GPS_ACCURACY_METERS) {
      return;
    }

    if (socketRef.current && socketRef.current.connected && riderId) {
      socketRef.current.emit('broadcastLocation', {
        riderId,
        branchId,
        latitude,
        longitude,
        accuracy: accuracy ?? undefined,
      });
    }
  };

  return { broadcastCoordinates };
}