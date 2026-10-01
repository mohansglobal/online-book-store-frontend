import { Suspense } from "react";
import ForgotPasswordPage from "@/components/forgot-password/forgot-password-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense>
      <ForgotPasswordPage />
    </Suspense>
  );
}
