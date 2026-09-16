// Central request router for Mock Mode, simulating Express backend API routes
import type { HttpMethod, RequestOptions } from "@/lib/api/types";
import { mockStore } from "./mock-store";

function delay(ms = 35): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseParams(params?: RequestOptions["params"]): Record<string, string> {
  if (!params) return {};
  if (params instanceof URLSearchParams) {
    const result: Record<string, string> = {};
    params.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  }
  return result;
}

export async function handleMockRequest<T>(
  endpoint: string,
  options: RequestOptions & { method?: HttpMethod } = {},
): Promise<T> {
  await delay();

  const method = (options.method || "GET").toUpperCase();
  const cleanEndpoint = endpoint.split("?")[0].replace(/^\/+/, "");
  const pathParts = cleanEndpoint.split("/");
  const queryParams = parseParams(options.params);
  const json = options.json as any;

  // 1. Listings & Books
  if (pathParts[0] === "listings" || pathParts[0] === "books") {
    // GET /listings/:id or /books/:id
    if (pathParts.length > 1 && pathParts[1] !== "isbn") {
      const identifier = decodeURIComponent(pathParts[1]);
      const book = mockStore.books.find(
        (b) =>
          b._id === identifier ||
          b.slug === identifier ||
          b.listingId === identifier ||
          b.bookId === identifier,
      ) || mockStore.books[0];

      return {
        success: true,
        message: "Book found",
        data: book,
      } as unknown as T;
    }

    // GET /books/isbn/:isbn
    if (pathParts[1] === "isbn" && pathParts[2]) {
      const isbn = decodeURIComponent(pathParts[2]);
      const book = mockStore.books.find((b) => b.isbn === isbn);
      return {
        success: true,
        exists: !!book,
        alreadyListedBySeller: false,
        existingListingId: book?.listingId || null,
        message: book ? "Book found" : "Book not found",
        data: book || null,
      } as unknown as T;
    }

    // GET /listings
    let filtered = [...mockStore.books];

    if (queryParams.category) {
      filtered = filtered.filter((b) =>
        b.categories?.some((c) => c._id === queryParams.category || c.slug === queryParams.category),
      );
    }

    if (queryParams.search) {
      const q = queryParams.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.titleBn?.toLowerCase().includes(q) ||
          b.authors?.some((a) => a.name.toLowerCase().includes(q) || a.nameBn?.toLowerCase().includes(q)),
      );
    }

    if (queryParams.author) {
      filtered = filtered.filter((b) =>
        b.authors?.some((a) => a._id === queryParams.author || a.slug === queryParams.author),
      );
    }

    if (queryParams.publisher) {
      filtered = filtered.filter(
        (b) =>
          b.publisher?._id === queryParams.publisher ||
          b.publisher?.slug === queryParams.publisher,
      );
    }

    if (queryParams.minPrice) {
      const minP = Number(queryParams.minPrice);
      filtered = filtered.filter((b) => (b.sellingPriceInPaise ? b.sellingPriceInPaise / 100 : 0) >= minP);
    }

    if (queryParams.maxPrice) {
      const maxP = Number(queryParams.maxPrice);
      filtered = filtered.filter((b) => (b.sellingPriceInPaise ? b.sellingPriceInPaise / 100 : 0) <= maxP);
    }

    // Sorting
    if (queryParams.sortBy === "price_low_to_high") {
      filtered.sort((a, b) => (a.sellingPriceInPaise || 0) - (b.sellingPriceInPaise || 0));
    } else if (queryParams.sortBy === "price_high_to_low") {
      filtered.sort((a, b) => (b.sellingPriceInPaise || 0) - (a.sellingPriceInPaise || 0));
    } else if (queryParams.sortBy === "rating") {
      filtered.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    const page = Math.max(1, Number(queryParams.page) || 1);
    const limit = Math.max(1, Number(queryParams.limit) || 10);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      message: "Books fetched successfully",
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    } as unknown as T;
  }

  // 2. Categories
  if (pathParts[0] === "categories") {
    if (pathParts[1]) {
      const slug = decodeURIComponent(pathParts[1]);
      const cat = mockStore.categories.find((c) => c.slug === slug || c._id === slug) || mockStore.categories[0];
      return { success: true, message: "Category found", data: cat } as unknown as T;
    }
    return {
      success: true,
      message: "Categories fetched successfully",
      data: mockStore.categories,
      meta: { page: 1, limit: 100, total: mockStore.categories.length, totalPages: 1 },
    } as unknown as T;
  }

  // 3. Authors
  if (pathParts[0] === "authors") {
    if (pathParts[1]) {
      const slug = decodeURIComponent(pathParts[1]);
      const author = mockStore.authors.find((a) => a.slug === slug || a._id === slug) || mockStore.authors[0];
      return { success: true, message: "Author found", data: author } as unknown as T;
    }
    return {
      success: true,
      message: "Authors fetched successfully",
      data: mockStore.authors,
      meta: { page: 1, limit: 100, total: mockStore.authors.length, totalPages: 1 },
    } as unknown as T;
  }

  // 4. Publishers
  if (pathParts[0] === "publishers") {
    if (pathParts[1]) {
      const slug = decodeURIComponent(pathParts[1]);
      const pub = mockStore.publishers.find((p) => p.slug === slug || p._id === slug) || mockStore.publishers[0];
      return { success: true, message: "Publisher found", data: pub } as unknown as T;
    }
    return {
      success: true,
      message: "Publishers fetched successfully",
      data: mockStore.publishers,
      meta: { page: 1, limit: 100, total: mockStore.publishers.length, totalPages: 1 },
    } as unknown as T;
  }

  // 5. Auth
  if (pathParts[0] === "auth") {
    if (pathParts[1] === "me") {
      return { success: true, message: "Current user", data: mockStore.user } as unknown as T;
    }
    if (pathParts[1] === "login" || pathParts[1] === "register") {
      return {
        success: true,
        message: "Success",
        data: { accessToken: "mock_jwt_token_123", user: mockStore.user },
      } as unknown as T;
    }
    if (pathParts[1] === "logout") {
      return { success: true, message: "Logged out" } as unknown as T;
    }
    if (pathParts[1] === "refresh-token") {
      return { success: true, message: "Refreshed", data: { accessToken: "mock_refreshed_jwt" } } as unknown as T;
    }
    if (pathParts[1] === "send-otp" || pathParts[1] === "verify-otp") {
      return { success: true, message: "Verified", data: { success: true, user: mockStore.user } } as unknown as T;
    }
    if (pathParts[1] === "profile" && pathParts[2] === "photo") {
      return {
        success: true,
        message: "Photo updated",
        data: { user: mockStore.user, imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" },
      } as unknown as T;
    }
  }

  // 6. Cart
  if (pathParts[0] === "cart") {
    if (method === "GET") {
      return { success: true, message: "Cart fetched", data: mockStore.getCartData() } as unknown as T;
    }
    if (method === "POST") {
      const listingId = json?.bookListingId || json?.listingId || json?.bookId;
      const qty = json?.quantity || 1;
      return { success: true, message: "Cart updated", data: mockStore.addToCart(listingId, qty) } as unknown as T;
    }
    if (method === "PUT" && pathParts[1]) {
      return {
        success: true,
        message: "Cart updated",
        data: mockStore.updateCartItem(pathParts[1], json?.quantity || 1),
      } as unknown as T;
    }
    if (method === "DELETE") {
      if (pathParts[1]) {
        return { success: true, message: "Item removed", data: mockStore.removeCartItem(pathParts[1]) } as unknown as T;
      }
      return { success: true, message: "Cart cleared", data: mockStore.clearCart() } as unknown as T;
    }
  }

  // 7. Wishlist
  if (pathParts[0] === "wishlist") {
    if (method === "GET") {
      return { success: true, message: "Wishlist fetched", data: mockStore.getWishlistData() } as unknown as T;
    }
    if (method === "POST") {
      const bookId = json?.bookId || json?.id;
      return { success: true, message: "Wishlist updated", data: mockStore.addToWishlist(bookId) } as unknown as T;
    }
    if (method === "DELETE") {
      if (pathParts[1]) {
        return { success: true, message: "Wishlist item removed", data: mockStore.removeFromWishlist(pathParts[1]) } as unknown as T;
      }
      return { success: true, message: "Wishlist cleared", data: mockStore.clearWishlist() } as unknown as T;
    }
  }

  // 8. Orders
  if (pathParts[0] === "orders") {
    if (method === "GET") {
      if (pathParts[1]) {
        const order = mockStore.orders.find((o) => o._id === pathParts[1] || o.orderNumber === pathParts[1]) || mockStore.orders[0];
        return { success: true, message: "Order found", data: order } as unknown as T;
      }
      return {
        success: true,
        message: "Orders fetched",
        data: mockStore.orders,
        meta: { page: 1, limit: 10, total: mockStore.orders.length, totalPages: 1 },
      } as unknown as T;
    }
    if (method === "POST") {
      if (pathParts[1] && pathParts[2] === "cancel") {
        const order = mockStore.orders.find((o) => o._id === pathParts[1]);
        if (order) {
          order.orderStatus = "CANCELLED";
          order.cancelledAt = new Date().toISOString();
        }
        return { success: true, message: "Order cancelled", data: order || mockStore.orders[0] } as unknown as T;
      }
      if (pathParts[1] === "verify-payment" || pathParts[1] === "razorpay") {
        return { success: true, message: "Payment verified", data: { verified: true, orderId: "order_mock_01" } } as unknown as T;
      }
      const order = mockStore.createOrder(json);
      return { success: true, message: "Order created successfully", data: order } as unknown as T;
    }
  }

  // 9. Addresses
  if (pathParts[0] === "addresses") {
    if (method === "GET") {
      if (pathParts[1]) {
        const addr = mockStore.addresses.find((a) => a._id === pathParts[1]) || mockStore.addresses[0];
        return { success: true, message: "Address found", data: addr } as unknown as T;
      }
      return { success: true, message: "Addresses fetched", data: mockStore.addresses } as unknown as T;
    }
    if (method === "POST") {
      const addr = mockStore.createAddress(json);
      return { success: true, message: "Address created", data: addr } as unknown as T;
    }
    if ((method === "PUT" || method === "PATCH") && pathParts[1]) {
      const addr = mockStore.addresses.find((a) => a._id === pathParts[1]);
      if (addr) Object.assign(addr, json);
      return { success: true, message: "Address updated", data: addr } as unknown as T;
    }
    if (method === "DELETE" && pathParts[1]) {
      mockStore.addresses = mockStore.addresses.filter((a) => a._id !== pathParts[1]);
      return { success: true, message: "Address deleted" } as unknown as T;
    }
  }

  // 10. Reviews
  if (pathParts[0] === "reviews") {
    if (pathParts[1] === "book" && pathParts[2]) {
      const bookId = pathParts[2];
      const reviews = mockStore.reviews.filter((r) => r.bookId === bookId || !r.bookId);
      return {
        success: true,
        message: "Reviews fetched",
        data: {
          reviews: reviews.length > 0 ? reviews : mockStore.reviews,
          totalReviews: reviews.length > 0 ? reviews.length : mockStore.reviews.length,
          averageRating: 4.9,
          ratingDistribution: { 5: 85, 4: 10, 3: 5, 2: 0, 1: 0 },
        },
      } as unknown as T;
    }
    if (pathParts[1] === "eligibility") {
      return {
        success: true,
        message: "Eligibility checked",
        data: {
          canReview: true,
          hasPurchased: true,
          hasDelivered: true,
          eligibleSellers: [{ sellerId: "seller_main_01", sellerName: "Bengal Book Distributors" }],
        },
      } as unknown as T;
    }
    if (method === "POST") {
      const rev = mockStore.createReview(json);
      return { success: true, message: "Review created", data: rev } as unknown as T;
    }
  }

  // 11. Countries
  if (pathParts[0] === "countries") {
    return { success: true, message: "Countries fetched", data: mockStore.countries } as unknown as T;
  }

  // 12. Checkout Summary
  if (pathParts[0] === "checkout" && pathParts[1] === "summary") {
    const cart = mockStore.getCartData();
    const subtotal = cart.totalAmountInPaise;
    const delivery = 4000;
    const discount = 0;
    const total = subtotal + delivery - discount;

    const summaryData = {
      items: cart.items.map((it) => ({
        bookListingId: it.bookListingId,
        bookId: it.book._id,
        title: it.book.title,
        titleBn: it.book.titleBn,
        author: "Author",
        format: it.book.format,
        coverImage: it.book.coverImage,
        quantity: it.quantity,
        stockAvailable: it.stockAvailable,
        isAvailable: true,
        mrpInPaise: it.mrpInPaise,
        sellingPriceInPaise: it.priceInPaise,
        subtotalInPaise: it.subtotalInPaise,
        itemDiscountInPaise: it.mrpInPaise - it.priceInPaise,
        seller: { id: it.seller._id, name: it.seller.name },
      })),
      pricing: {
        itemsCount: cart.items.length,
        totalQuantity: cart.totalItemsCount,
        mrpTotalInPaise: cart.items.reduce((a, b) => a + b.mrpInPaise * b.quantity, 0),
        subtotalInPaise: subtotal,
        itemDiscountInPaise: 0,
        couponDiscountInPaise: discount,
        deliveryChargeInPaise: delivery,
        totalSavingsInPaise: 11900,
        totalAmountInPaise: total,
        currency: "INR",
      },
      coupon: null,
      addresses: {
        shippingAddress: mockStore.addresses[0] || null,
        billingAddress: mockStore.addresses[0] || null,
        billingSameAsShipping: true,
      },
      paymentMethods: [
        { id: "ONLINE_PAY", label: "Online Payment (Razorpay, UPI, Cards)", isAvailable: true },
        { id: "CASH_ON_DELIVERY", label: "Cash on Delivery (COD)", isAvailable: true },
      ],
      delivery: { estimatedMinDays: 3, estimatedMaxDays: 5 },
      checkoutState: { canCheckout: true, issues: [] },
    };

    return { success: true, message: "Summary generated", data: summaryData } as unknown as T;
  }

  // Fallback generic response
  return { success: true, message: "Mock response", data: null } as unknown as T;
}
