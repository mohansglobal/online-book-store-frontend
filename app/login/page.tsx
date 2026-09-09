import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoginPage from "@/components/login/login-page";
import { getServerCurrentUser } from "@/features/auth/server";
import { getSafePostLoginRedirect } from "@/features/auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function Page({ searchParams }: LoginPageProps) {
  const user = await getServerCurrentUser();
  const resolvedSearchParams = await searchParams;

  if (user) {
    const targetUrl = getSafePostLoginRedirect({
      redirect: resolvedSearchParams.redirect,
      role: user.role,
    });
    redirect(targetUrl);
  }

  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}

