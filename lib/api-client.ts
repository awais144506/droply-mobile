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
  }, [getToken, user]); // Only recreate if Clerk's core functions change

  return api;
}