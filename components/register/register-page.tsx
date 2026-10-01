"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Left Branding Panel */}
      <section className="relative hidden flex-1 flex-col justify-between bg-zinc-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-zinc-950 to-amber-900/20" />
        <div className="relative z-10">
          <span className="text-2xl font-black tracking-wider text-accent">
            ONLINE BOOKSTORE
          </span>
        </div>
        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Discover your next favorite book today.
          </h2>
          <p className="text-base text-zinc-400">
            Join thousands of readers and independent sellers on the premiere online bookstore marketplace.
          </p>
        </div>
        <div className="relative z-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} Online BookStore. All rights reserved.
        </div>
      </section>

      {/* Register Form Section */}
      <section className="relative flex flex-1 flex-col justify-center overflow-y-auto bg-background px-6 py-10 sm:px-12 md:px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full max-w-md my-auto"
        >
          <div className="mb-8 text-center lg:text-left">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Fill in your details below to get started
            </p>
          </div>

          <RegisterForm
            onSwitchToLogin={() => router.push("/login")}
          />
        </motion.div>
      </section>
    </main>
  );
}
