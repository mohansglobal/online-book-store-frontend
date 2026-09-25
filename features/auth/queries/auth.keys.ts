// auth query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  deletionInfo: () => [...authKeys.all, "deletion-info"] as const,
};
