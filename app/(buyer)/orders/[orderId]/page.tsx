import { OrderDetailsView } from "@/features/orders/components/order-details-view";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata = {
  title: "Order Details | Indian Book Bank",
  description: "View tracking and details for your book order.",
};

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;
  return <OrderDetailsView orderId={orderId} />;
}
