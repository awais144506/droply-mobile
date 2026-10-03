/* eslint-disable import/no-named-as-default-member */
// src/lib/api-client.ts
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo"; // <-- Import useUser
import { useMemo } from "react";

export function useApiClient() {
  const { getToken } = useAuth();
  const { user } = useUser(); // <-- Get the user object

  return useMemo(() => {
    const api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request Interceptor (What you already had)
    api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 🔥 Response Interceptor (The Magic Trigger)
    api.interceptors.response.use(
      (response) => response, // Let successful requests pass
      async (error) => {
        console.log("GETTING BACK ERROR", error.status)
        if (error?.status === 403 || error?.status === 401) {
          console.log("Caught 403 Forbidden. Refreshing Clerk user...");
          try {
            await user?.reload(); // This fetches the "SUSPENDED" status
          } catch (e) {
            console.error("Failed to reload user", e);
          }
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, [getToken, user]); // Add user to dependency array
}