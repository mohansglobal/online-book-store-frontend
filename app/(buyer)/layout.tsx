// app/(buyer)/layout.tsx

import { Navbar } from "@/components/home/components";
import { Footer } from "@/components/home/components";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar wish={0} cart={0} />
      <main>{children}</main>
      <Footer />
    </>
  );
}