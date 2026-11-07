import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

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

    console.log(`🔌 Connecting socket to: ${BACKEND_URL}/rider for rider: ${riderId} (Tier: ${tier})`);

    socketRef.current = io(`${BACKEND_URL}/rider`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      forceNew: true,
      auth: { riderId, branchId },
    });

    socketRef.current.on('connect', () => {
      console.log('🟢 Connected to Rider WebSocket Gateway, Socket ID:', socketRef.current?.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('🔴 WebSocket Connection Error:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isOnline, riderId, branchId, isPlatinum, tier]);

  const broadcastCoordinates = (latitude: number, longitude: number) => {
    if (!isPlatinum) return; // Hard block broadcasting if not Platinum

    if (socketRef.current && socketRef.current.connected && riderId) {
      socketRef.current.emit('broadcastLocation', {
        riderId,
        branchId,
        latitude,
        longitude,
      });
    }
  };

  return { broadcastCoordinates };
}