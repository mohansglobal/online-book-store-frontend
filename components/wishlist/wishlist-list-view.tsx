"use client";

import { motion } from "framer-motion";
import type { WishlistItem } from "@/features/wishlist";
import { WishlistItemRow } from "./wishlist-item-row";

type WishlistListViewProps = {
  items: WishlistItem[];
  onMoveToCart: (item: WishlistItem) => void;
  onRemove: (item: WishlistItem) => void;
};

export function WishlistListView({
  items,
  onMoveToCart,
  onRemove,
}: WishlistListViewProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
        >
          <WishlistItemRow
            item={item}
            onMoveToCart={onMoveToCart}
            onRemove={onRemove}
          />
        </motion.div>
      ))}
    </div>
  );
}
