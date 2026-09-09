import CheckoutPage from "@/components/checkout/checkout-page";
import { requireRole } from "@/features/auth/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireRole("BUYER", "/checkout");

  return <CheckoutPage />;
}