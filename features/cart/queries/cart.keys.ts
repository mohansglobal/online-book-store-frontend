// Standardized TanStack Query keys for Cart server state

export const cartKeys = {
  all: ["cart"] as const,
  current: () => [...cartKeys.all, "current"] as const,
};
