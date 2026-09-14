import { resolveCoverUrl } from "@/lib/image-url";
export { resolveCoverUrl };
import type {
  CartData,
  CartItem,
  CartItemView,
  CartSummaryView,
  GuestCartItem,
} from "../types/cart.types";

export function transformServerItemsToViews(items: CartItem[]): CartItemView[] {
  return items.map((item) => {
    const book = item.book;
    const authorsText =
      book?.authors && book.authors.length > 0
        ? book.authors.map((a) => a.name).join(", ")
        : "Unknown Author";

    const priceInRupees =
      typeof item.priceInRupees === "number"
        ? item.priceInRupees
        : (item.priceInPaise || 0) / 100;

    const mrpInRupees =
      typeof item.mrpInRupees === "number"
        ? item.mrpInRupees
        : (item.mrpInPaise || 0) / 100 || priceInRupees;

    const subtotalInRupees =
      typeof item.subtotalInRupees === "number"
        ? item.subtotalInRupees
        : (item.subtotalInPaise || 0) / 100 || priceInRupees * item.quantity;

    const savingsInRupees = Math.max(
      0,
      mrpInRupees * item.quantity - subtotalInRupees,
    );

    const coverSrc = resolveCoverUrl(book?.coverImage);
    const bookListingId = item.bookListingId || "";

    return {
      id: bookListingId,
      listingId: bookListingId,
      bookListingId: bookListingId,
      bookId: book?._id || "",
      slug: book?._id || book?.slug || bookListingId,
      title: book?.title || "Untitled Book",
      author: authorsText,
      seller: item.seller?.name || undefined,
      coverImage: coverSrc,
      format: book?.format || "Paperback",
      price: priceInRupees,
      originalPrice: mrpInRupees,
      quantity: item.quantity,
      subtotal: subtotalInRupees,
      savings: savingsInRupees,
      isAvailable: item.isAvailable ?? true,
      isOutOfStock: item.isAvailable === false,
      exceedsStock:
        typeof item.stockAvailable === "number" &&
        item.quantity > item.stockAvailable,
      availableStock: item.stockAvailable,
    };
  });
}

export function transformGuestItemsToViews(
  guestItems: GuestCartItem[],
): CartItemView[] {
  return guestItems.map((g) => {
    const itemId = g.id || g.listingId || g.bookListingId || g.bookId || "";
    return {
      id: itemId,
      listingId: g.listingId || itemId,
      bookListingId: g.bookListingId || g.listingId || itemId,
      bookId: g.bookId || itemId,
      slug: g.slug || itemId,
      title: g.title,
      author: g.author,
      seller: g.seller,
      coverImage: resolveCoverUrl(g.coverImage),
      format: g.format,
      price: g.price,
      originalPrice: g.originalPrice || g.price,
      quantity: g.quantity,
      subtotal: g.price * g.quantity,
      savings: Math.max(0, (g.originalPrice || g.price) - g.price) * g.quantity,
      isAvailable: true,
      isOutOfStock: false,
      exceedsStock: false,
    };
  });
}

export function calculateCartSummary(
  items: CartItemView[],
  serverCartData?: CartData | null,
  isLoggedIn = false,
): CartSummaryView {
  if (isLoggedIn && serverCartData) {
    const subtotal =
      typeof serverCartData.totalAmountInRupees === "number"
        ? serverCartData.totalAmountInRupees
        : (serverCartData.totalAmountInPaise || 0) / 100;

    const totalMrp = items.reduce(
      (sum, i) => sum + i.originalPrice * i.quantity,
      0,
    );
    const totalCount =
      typeof serverCartData.totalItemsCount === "number"
        ? serverCartData.totalItemsCount
        : items.reduce((sum, i) => sum + i.quantity, 0);

    const mrpSavings = Math.max(0, totalMrp - subtotal);

    return {
      totalItems: items.length,
      totalCount,
      subtotal,
      totalMrp,
      mrpSavings,
      totalDiscount: mrpSavings,
      hasUnavailableItems: items.some((i) => !i.isAvailable || i.isOutOfStock),
      hasStockIssues: items.some((i) => i.exceedsStock),
    };
  }

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalMrp = items.reduce(
    (sum, i) => sum + i.originalPrice * i.quantity,
    0,
  );
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const mrpSavings = Math.max(0, totalMrp - subtotal);

  return {
    totalItems: items.length,
    totalCount,
    subtotal,
    totalMrp,
    mrpSavings,
    totalDiscount: mrpSavings,
    hasUnavailableItems: false,
    hasStockIssues: false,
  };
}
