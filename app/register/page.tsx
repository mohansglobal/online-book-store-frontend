import { Suspense } from "react";
import { redirect } from "next/navigation";
import RegisterPage from "@/components/register/register-page";
import { getServerCurrentUser } from "@/features/auth/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getServerCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <Suspense>
      <RegisterPage />
    </Suspense>
  );
}
