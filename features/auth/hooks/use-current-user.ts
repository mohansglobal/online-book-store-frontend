// current authenticated user query hook
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "../queries/auth.queries";

export function useCurrentUser() {
  return useQuery(authQueries.me());
}

// alias for clean imports
export const useAuthMe = useCurrentUser;
