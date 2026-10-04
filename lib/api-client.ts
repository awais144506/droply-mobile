/* eslint-disable import/no-named-as-default-member */
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMemo } from "react";

export function useApiClient() {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useMemo(() => {
    const api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.status === 403 || error?.status === 401) {
          try {
            await user?.reload();
          } catch (e: any) {
            console.error(e?.message)
          }
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, [getToken, user]);
}