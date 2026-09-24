# Page Integration & API Status Report

**Last Updated**: September 22, 2026  
**Configuration File**: [`config/page-integration.ts`](./config/page-integration.ts)  

---

## 📊 Summary

- **Total Pages / Features Tracked**: 19
- 🟢 **Live on Real Backend API**: **19 Pages (100%)**
- 🟡 **In Mock / Blocked Mode**: **0 Pages (0%)**


## 🟢 1. Live Pages (Real Express Backend API) — 19 Pages

All storefront and administrative pages are actively connected to the real Express backend server (`http://localhost:5000/api/v1`).

| Feature Key | Route / URL | Backend Endpoint(s) | Status |
| :--- | :--- | :--- | :---: |
| **`homepage`** | `/` | `GET /api/v1/listings?homesection=true` | 🟢 Live |
| **`auth`** | `/login`, `/register`, `/auth/*` | `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `/auth/me` | 🟢 Live |
| **`categories`** | `/categories` | `GET /api/v1/categories` | 🟢 Live |
| **`categoryDetails`** | `/categories/[slug]` | `GET /api/v1/categories/:slug` | 🟢 Live |
| **`publishers`** | `/publishers` | `GET /api/v1/publishers` | 🟢 Live |
| **`publisherDetails`** | `/publishers/[slug]` | `GET /api/v1/publishers/:slug` | 🟢 Live |
| **`authors`** | `/authors` | `GET /api/v1/authors` | 🟢 Live |
| **`authorDetails`** | `/authors/[idOrSlug]` | `GET /api/v1/authors/:idOrSlug`, `PATCH /api/v1/authors/:id`, `DELETE /api/v1/authors/:id` | 🟢 Live |
| **`books`** | `/books` | `GET /api/v1/listings`, `GET /api/v1/books` | 🟢 Live |
| **`bookDetails`** | `/books/[id]` | `GET /api/v1/books/:id`, `GET /api/v1/reviews/book/:id` | 🟢 Live |
| **`cart`** | `/cart` | `GET /api/v1/cart`, `POST /api/v1/cart`, `PATCH /api/v1/cart/:id`, `DELETE /api/v1/cart/:id` | 🟢 Live |
| **`checkout`** | `/checkout` | `GET /api/v1/checkout/summary`, `GET /api/v1/addresses`, `POST /api/v1/orders` | 🟢 Live |
| **`orders`** | `/orders`, `/orders/[id]` | `GET /api/v1/orders`, `GET /api/v1/orders/:id`, `POST /api/v1/orders/:id/cancel` | 🟢 Live |
| **`profile`** | `/profile`, `/profile/addresses` | `GET /api/v1/users/me`, `GET /api/v1/addresses`, `POST /api/v1/addresses` | 🟢 Live |
| **`wishlist`** | `/wishlist` | `GET /api/v1/wishlist`, `POST /api/v1/wishlist/:id` | 🟢 Live |
| **`sellerDashboard`** | `/dashboard` | `GET /api/v1/dashboard/revenue-analytics`, `GET /api/v1/dashboard/recent-orders`, `GET /api/v1/dashboard/daily-orders` | 🟢 Live |
| **`sellerInventory`** | `/inventory` | `GET /api/v1/seller/inventory` | 🟢 Live |
| **`sellerAddBook`** | `/add-book` | `POST /api/v1/books`, `POST /api/v1/upload` | 🟢 Live |
| **`sellerDiscounts`** | `/seller/discounts` | `PATCH /api/v1/listings/:id/discount` | 🟢 Live |

---

## ⚙️ How to Toggle Any Page

Open [`config/page-integration.ts`](./config/page-integration.ts) and modify `PAGE_INTEGRATION_FLAGS`:

```ts
export const PAGE_INTEGRATION_FLAGS: PageIntegrationConfig = {
  // Set to true for Real API, false for Local Mock Store
  cart: true,
  checkout: true,
  orders: true,
  // ...
};
```
