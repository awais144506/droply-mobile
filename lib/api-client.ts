/* eslint-disable import/no-named-as-default-member */
// src/lib/api-client.ts
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";

export function useApiClient() {
  const { getToken } = useAuth();

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

    return api;
  }, [getToken]);
}