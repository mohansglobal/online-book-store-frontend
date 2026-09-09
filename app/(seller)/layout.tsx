import { requireRole } from "@/features/auth/server";

export const dynamic = "force-dynamic";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("SELLER", "/dashboard");

  return <>{children}</>;
}

