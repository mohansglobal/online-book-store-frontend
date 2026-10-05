"use client";

import { useQuery } from "@tanstack/react-query";
import { authQueries } from "../queries/auth.queries";

export function useCurrentUser() {
  return useQuery(authQueries.me());
}

// Alias for clean imports
export const useAuthMe = useCurrentUser;
