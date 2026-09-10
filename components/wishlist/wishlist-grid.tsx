"use client";

import { motion } from "framer-motion";
import type { WishlistItem } from "@/features/wishlist";
import { WishlistItemCard } from "./wishlist-item-card";

type WishlistGridProps = {
  items: WishlistItem[];
  onMoveToCart: (item: WishlistItem) => void;
  onRemove: (item: WishlistItem) => void;
};

export function WishlistGrid({
  items,
  onMoveToCart,
  onRemove,
}: WishlistGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
        >
          <WishlistItemCard
            item={item}
            onMoveToCart={onMoveToCart}
            onRemove={onRemove}
          />
        </motion.div>
      ))}
    </div>
  );
}
