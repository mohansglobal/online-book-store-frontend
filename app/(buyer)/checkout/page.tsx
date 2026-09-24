import CheckoutPage from "@/components/checkout/checkout-page";
import { requireAuth } from "@/features/auth/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAuth("/checkout");

  return <CheckoutPage />;
}