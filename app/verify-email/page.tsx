import { Suspense } from "react";
import VerifyEmailPage from "@/components/verify-email/verify-email-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
