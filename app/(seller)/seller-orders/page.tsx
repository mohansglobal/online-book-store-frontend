import type { Metadata } from "next";
import { SellerOrdersPageContent } from "@/features/seller/components/orders/seller-orders-page-content";

export const metadata: Metadata = {
  title: "Orders Management | Seller Dashboard",
  description: "Track customer orders, manage fulfillment status, and monitor store shipments.",
};

export default function Page() {
  return <SellerOrdersPageContent />;
}
