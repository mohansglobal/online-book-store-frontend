import { resolveCoverUrl } from "@/lib/image-url";
import type {
  WishlistBookItem,
  WishlistItem,
} from "../types/wishlist.types";

export function transformServerWishlistToViews(
  items: WishlistBookItem[],
): WishlistItem[] {
  return (items || []).map((item) => {
    const authorText =
      item.authors && item.authors.length > 0
        ? item.authors.map((a) => a.name).join(", ")
        : "-";

    const price =
      typeof item.priceInRupees === "number"
        ? item.priceInRupees
        : typeof item.priceInPaise === "number"
          ? item.priceInPaise / 100
          : 0;

    const originalPrice =
      typeof item.mrpInRupees === "number"
        ? item.mrpInRupees
        : typeof item.mrpInPaise === "number"
          ? item.mrpInPaise / 100
          : price;

    const sellerName =
      typeof item.seller === "object" && item.seller !== null
        ? item.seller.name
        : typeof item.seller === "string"
          ? item.seller
          : undefined;

    const itemId = item.id || item.bookId || item.listingId || "";

    return {
      id: itemId,
      slug: item.slug || item.canonicalSlug || itemId,
      title: item.title || "Untitled Book",
      author: authorText,
      coverImage: resolveCoverUrl(item.coverImage),
      format: item.format || "Paperback",
      price,
      originalPrice,
      inStock: item.inStock ?? true,
      category: item.categories?.[0]?.name,
      publisher: item.publisher?.name,
      seller: sellerName,
      quantity: item.quantity ?? 1,
      addedAt: item.addedAt || new Date().toISOString(),
    };
  });
}
