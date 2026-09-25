// Stats query keys factory

export const statsKeys = {
  all: ["stats"] as const,
  hero: () => [...statsKeys.all, "hero"] as const,
};
