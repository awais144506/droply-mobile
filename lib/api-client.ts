/* eslint-disable import/no-named-as-default-member */
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMemo } from 'react';

export function useApiClient() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
    });

    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error: any) {
        console.warn("Failed to get token", error.message);
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // 🔥 1. Extract custom NestJS backend message if available
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
          // NestJS validation errors can sometimes be arrays of strings
          error.message = Array.isArray(backendMessage) ? backendMessage[0] : backendMessage;
        }

        // 2. Handle Auth errors (401 / 403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Auth Error Detected: Checking if user was suspended...");

          if (user) {
            try {
              await user.reload();
            } catch (e: any) {
              console.error(e.message);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken, user]);

  return api;
}