// In-memory stateful store for mock mode session operations
import type { ApiBook } from "@/features/books/types/book.types";
import type { CartData, CartItem } from "@/features/cart/types/cart.types";
import type { WishlistData, WishlistBookItem } from "@/features/wishlist/types/wishlist.types";
import type { Order, CreateOrderInput } from "@/features/orders/types/order.types";
import type { Address, CreateAddressInput } from "@/features/addresses/types/address.types";
import type { Review, CreateReviewInput } from "@/features/reviews/types/review.types";
import type { User } from "@/features/auth/types/auth.types";

import { MOCK_BOOKS } from "./data/mock-books";
import { MOCK_CATEGORIES } from "./data/mock-categories";
import { MOCK_AUTHORS } from "./data/mock-authors";
import { MOCK_PUBLISHERS } from "./data/mock-publishers";
import { MOCK_USER } from "./data/mock-users";
import { MOCK_ADDRESSES } from "./data/mock-addresses";
import { MOCK_ORDERS } from "./data/mock-orders";
import { MOCK_REVIEWS } from "./data/mock-reviews";
import { MOCK_COUNTRIES } from "./data/mock-countries";

class MockStore {
  public books: ApiBook[] = [...MOCK_BOOKS];
  public categories = [...MOCK_CATEGORIES];
  public authors = [...MOCK_AUTHORS];
  public publishers = [...MOCK_PUBLISHERS];
  public user: User | null = { ...MOCK_USER };
  public addresses: Address[] = [...MOCK_ADDRESSES];
  public orders: Order[] = [...MOCK_ORDERS];
  public reviews: Review[] = [...MOCK_REVIEWS];
  public countries = [...MOCK_COUNTRIES];

  // In-memory cart
  public cartItems: CartItem[] = [
    {
      bookListingId: "listing_curated_01",
      quantity: 1,
      priceInPaise: 38000,
      priceInRupees: 380,
      mrpInPaise: 49900,
      mrpInRupees: 499,
      subtotalInPaise: 38000,
      subtotalInRupees: 380,
      stockAvailable: 45,
      isAvailable: true,
      book: {
        _id: "book_curated_01",
        title: "Pather Panchali (Song of the Little Road)",
        titleBn: "পথের পাঁচালী",
        slug: "pather-panchali",
        coverImage: "/assets/patherpanchali.jpeg",
        format: "Hardcover",
      },
      seller: {
        _id: "seller_main_01",
        name: "Bengal Book Distributors",
        email: "seller@bengalbooks.com",
      },
    },
  ];

  // In-memory wishlist
  public wishlistItems: WishlistBookItem[] = [
    {
      id: "book_curated_02",
      bookId: "book_curated_02",
      listingId: "listing_curated_02",
      title: "Gitanjali (Song Offerings)",
      titleBn: "গীতাঞ্জলি",
      slug: "gitanjali",
      coverImage: "/assets/cover-midnight.jpg",
      priceInPaise: 25000,
      priceInRupees: 250,
      mrpInPaise: 35000,
      mrpInRupees: 350,
      inStock: true,
      totalStock: 80,
      format: "Paperback",
      addedAt: "2024-05-01T10:00:00.000Z",
    },
  ];

  public getCartData(): CartData {
    const totalItemsCount = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmountInPaise = this.cartItems.reduce((acc, item) => acc + item.subtotalInPaise, 0);
    const totalAmountInRupees = Math.round(totalAmountInPaise / 100);

    return {
      _id: "mock_cart_01",
      user: this.user?.id || "user_mock_01",
      items: [...this.cartItems],
      totalItemsCount,
      totalAmountInPaise,
      totalAmountInRupees,
    };
  }

  public addToCart(listingIdOrBookId: string, quantity = 1): CartData {
    const book = this.books.find(
      (b) => b.listingId === listingIdOrBookId || b._id === listingIdOrBookId || b.bookId === listingIdOrBookId,
    );

    const listingId = book?.listingId || listingIdOrBookId;
    const existingIndex = this.cartItems.findIndex((i) => i.bookListingId === listingId);

    const unitPrice = book?.sellingPriceInPaise || 35000;
    const mrp = book?.mrpInPaise || unitPrice;

    if (existingIndex > -1) {
      const existing = this.cartItems[existingIndex];
      const newQty = existing.quantity + quantity;
      this.cartItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        subtotalInPaise: unitPrice * newQty,
        subtotalInRupees: Math.round((unitPrice * newQty) / 100),
      };
    } else {
      this.cartItems.push({
        bookListingId: listingId,
        quantity,
        priceInPaise: unitPrice,
        priceInRupees: Math.round(unitPrice / 100),
        mrpInPaise: mrp,
        mrpInRupees: Math.round(mrp / 100),
        subtotalInPaise: unitPrice * quantity,
        subtotalInRupees: Math.round((unitPrice * quantity) / 100),
        stockAvailable: book?.stock ?? 25,
        isAvailable: true,
        book: {
          _id: book?._id || "mock_book_id",
          title: book?.title || "Book Title",
          titleBn: book?.titleBn,
          slug: book?.slug || "book-slug",
          coverImage: book?.coverImage || "/assets/patherpanchali.jpeg",
          format: book?.format || "Paperback",
        },
        seller: {
          _id: book?.seller?._id || "seller_01",
          name: book?.seller?.name || "Bengal Books",
          email: book?.seller?.email || "seller@bengalbooks.com",
        },
      });
    }

    return this.getCartData();
  }

  public updateCartItem(bookListingId: string, quantity: number): CartData {
    if (quantity <= 0) {
      return this.removeCartItem(bookListingId);
    }
    const idx = this.cartItems.findIndex((i) => i.bookListingId === bookListingId);
    if (idx > -1) {
      const item = this.cartItems[idx];
      this.cartItems[idx] = {
        ...item,
        quantity,
        subtotalInPaise: item.priceInPaise * quantity,
        subtotalInRupees: Math.round((item.priceInPaise * quantity) / 100),
      };
    }
    return this.getCartData();
  }

  public removeCartItem(bookListingId: string): CartData {
    this.cartItems = this.cartItems.filter((i) => i.bookListingId !== bookListingId);
    return this.getCartData();
  }

  public clearCart(): CartData {
    this.cartItems = [];
    return this.getCartData();
  }

  public getWishlistData(): WishlistData {
    return {
      _id: "mock_wishlist_01",
      user: this.user?.id || "user_mock_01",
      items: [...this.wishlistItems],
      totalItemsCount: this.wishlistItems.length,
    };
  }

  public addToWishlist(bookId: string): WishlistData {
    const exists = this.wishlistItems.some((i) => i.bookId === bookId || i.id === bookId);
    if (!exists) {
      const book = this.books.find((b) => b._id === bookId || b.bookId === bookId);
      if (book) {
        this.wishlistItems.push({
          id: book._id,
          bookId: book._id,
          listingId: book.listingId,
          title: book.title,
          titleBn: book.titleBn,
          slug: book.slug,
          coverImage: book.coverImage || "/assets/patherpanchali.jpeg",
          priceInPaise: book.sellingPriceInPaise,
          priceInRupees: book.sellingPriceInPaise ? Math.round(book.sellingPriceInPaise / 100) : 0,
          mrpInPaise: book.mrpInPaise,
          mrpInRupees: book.mrpInPaise ? Math.round(book.mrpInPaise / 100) : 0,
          inStock: book.inStock ?? true,
          totalStock: book.stock,
          format: book.format,
          addedAt: new Date().toISOString(),
        });
      }
    }
    return this.getWishlistData();
  }

  public removeFromWishlist(idOrBookId: string): WishlistData {
    this.wishlistItems = this.wishlistItems.filter(
      (i) => i.id !== idOrBookId && i.bookId !== idOrBookId,
    );
    return this.getWishlistData();
  }

  public clearWishlist(): WishlistData {
    this.wishlistItems = [];
    return this.getWishlistData();
  }

  public createOrder(input: CreateOrderInput): Order {
    const cart = this.getCartData();
    const orderItems = input.items && input.items.length > 0
      ? input.items.map((it) => {
          const b = this.books.find((book) => book.listingId === it.bookListingId || book._id === it.bookListingId);
          const p = b?.sellingPriceInPaise || 35000;
          return {
            bookListing: it.bookListingId || "listing_01",
            title: b?.title || "Direct Book Item",
            coverImage: b?.coverImage || "/assets/patherpanchali.jpeg",
            priceInPaise: p,
            quantity: it.quantity,
            subtotalInPaise: p * it.quantity,
          };
        })
      : cart.items.map((it) => ({
          bookListing: it.bookListingId,
          title: it.book.title,
          coverImage: it.book.coverImage,
          priceInPaise: it.priceInPaise,
          quantity: it.quantity,
          subtotalInPaise: it.subtotalInPaise,
        }));

    const subtotal = orderItems.reduce((acc, it) => acc + it.subtotalInPaise, 0);
    const delivery = 4000;
    const discount = input.couponCode ? 5000 : 0;
    const total = subtotal + delivery - discount;

    const shippingAddress =
      this.addresses.find((a) => a._id === input.shippingAddressId) || this.addresses[0];

    const newOrder: Order = {
      _id: `order_mock_${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      buyer: this.user?.id || "user_mock_01",
      items: orderItems,
      subtotalInPaise: subtotal,
      deliveryChargeInPaise: delivery,
      couponDiscountInPaise: discount,
      couponCode: input.couponCode,
      totalAmountInPaise: total,
      paymentMethod: input.paymentMethod,
      orderStatus: "CONFIRMED",
      paymentStatus: input.paymentMethod === "ONLINE_PAY" ? "PAID" : "PENDING",
      shippingAddress: {
        fullName: shippingAddress.fullName,
        mobileNumber: shippingAddress.mobileNumber,
        streetAddress: shippingAddress.streetAddress,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      billingAddress: {
        fullName: shippingAddress.fullName,
        mobileNumber: shippingAddress.mobileNumber,
        streetAddress: shippingAddress.streetAddress,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      billingSameAsShipping: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.clearCart();
    return newOrder;
  }

  public createAddress(input: CreateAddressInput): Address {
    const newAddress: Address = {
      _id: `addr_mock_${Date.now()}`,
      user: this.user?.id || "user_mock_01",
      addressType: input.addressType || "SHIPPING",
      fullName: input.fullName,
      email: input.email,
      mobileNumber: input.mobileNumber,
      country: input.country,
      state: input.state,
      city: input.city,
      postalCode: input.postalCode,
      streetAddress: input.streetAddress,
      apartment: input.apartment,
      isDefault: input.isDefault ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newAddress.isDefault) {
      this.addresses.forEach((a) => (a.isDefault = false));
    }
    this.addresses.push(newAddress);
    return newAddress;
  }

  public createReview(input: CreateReviewInput): Review {
    const newReview: Review = {
      _id: `rev_mock_${Date.now()}`,
      bookId: input.bookId,
      sellerId: input.sellerId,
      rating: input.rating,
      title: input.title,
      review: input.review,
      isVerifiedPurchase: true,
      user: {
        _id: this.user?.id || "user_mock_01",
        name: this.user?.name || "Mohan Das",
        profilePicture: this.user?.profilePicture,
      },
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);
    return newReview;
  }
}

export const mockStore = new MockStore();
