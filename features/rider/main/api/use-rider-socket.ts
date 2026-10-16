import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Use your NestJS backend URL (e.g., your local IP for testing on physical devices, or your production URL)
const BACKEND_URL = 'http://192.168.1.6:4000'; // Change this to your local IP/host

export function useRiderSocket(isRiding: boolean, riderId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isRiding || !riderId) {
      // Disconnect if ride stops
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect to the /rider namespace
    socketRef.current = io(`${BACKEND_URL}/rider`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current.on('connect', () => {
      console.log('🟢 Connected to Rider WebSocket Gateway, Socket ID:', socketRef.current?.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('🔴 WebSocket Connection Error:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isRiding, riderId]);

  // Function to emit live coordinates
  const broadcastCoordinates = (latitude: number, longitude: number) => {
    if (socketRef.current && socketRef.current.connected && riderId) {
      socketRef.current.emit('broadcastLocation', {
        riderId,
        latitude,
        longitude,
      });
    }
  };

  return { broadcastCoordinates };
}