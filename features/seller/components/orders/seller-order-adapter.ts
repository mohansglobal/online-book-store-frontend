import type {
  SellerOrder,
  SellerRecentOrder,
  SellerOrderItem,
} from "../../types/seller.types";

export function toSellerRecentOrder(order: SellerOrder): SellerRecentOrder {
  const sellerTotalInPaise =
    order.sellerSubtotalInPaise ??
    order.items.reduce((acc, it) => acc + (it.subtotalInPaise ?? 0), 0);

  const sellerTotalInRupees = sellerTotalInPaise / 100;

  const sellerItemCount = order.items.reduce(
    (acc, it) => acc + (it.quantity ?? 1),
    0,
  );

  const items: SellerOrderItem[] = order.items.map((it, idx) => {
    const priceInPaise = it.priceInPaise ?? 0;
    const subtotalInPaise =
      it.subtotalInPaise ?? priceInPaise * (it.quantity ?? 1);

    const bookListingId =
      typeof it.bookListing === "string"
        ? it.bookListing
        : (it.bookListing as unknown as { _id?: string })?._id || "";

    const bookId =
      typeof it.book === "string"
        ? it.book
        : (it.book as unknown as { _id?: string })?._id || "";

    const title = it.title || "Book";

    return {
      itemId: it._id || it.id || `item-${idx}`,
      _id: it._id,
      bookListingId,
      bookId,
      title,
      coverImage: it.coverImage,
      priceInRupees: priceInPaise / 100,
      priceInPaise,
      quantity: it.quantity ?? 1,
      subtotalInRupees: subtotalInPaise / 100,
      subtotalInPaise,
      status: it.status,
    };
  });

  const customerName =
    order.buyer?.name || order.shippingAddress?.fullName || "Customer";

  const customerEmail = order.buyer?.email || "-";

  return {
    orderId: order._id,
    orderNumber: order.orderNumber,
    customer: {
      id: order.buyer?._id || "",
      name: customerName,
      email: customerEmail,
      profilePicture: order.buyer?.profilePicture,
    },
    orderStatus: order.orderStatus,
    overallOrderStatus: order.overallOrderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    sellerTotalInRupees,
    sellerTotalInPaise,
    sellerItemCount,
    items,
  };
}
