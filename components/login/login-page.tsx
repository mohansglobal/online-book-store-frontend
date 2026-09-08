"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LoginForm, RegisterForm } from "@/features/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playbackRate = 1;

    if (shouldReduceMotion) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // handle autoplay restrictions gracefully
        });
      }
    }
  }, [shouldReduceMotion]);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Left Video */}
      <section className="relative hidden flex-1 overflow-hidden bg-zinc-950 lg:block">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/videos/login.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            onLoadedMetadata={(event) => {
              event.currentTarget.playbackRate = 1;
              event.currentTarget.muted = true;
              if (!shouldReduceMotion) {
                event.currentTarget.play().catch(() => {});
              }
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-black/[0.06]" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/35 via-black/10 to-transparent"
        />
      </section>

      {/* Login / Register Form Container */}
      <section className="relative flex flex-1 flex-col justify-center overflow-y-auto bg-background px-8 sm:px-16 md:px-24 lg:px-20 xl:px-28 py-10">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.65,
            delay: shouldReduceMotion ? 0 : 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto w-full max-w-md my-auto"
        >
          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-heading" : "register-heading"}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-2 text-3xl font-bold tracking-tight">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {isLogin
                    ? "Enter your credentials to access your account"
                    : "Fill in the details below to get started"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-content"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.25 }}
              >
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="register-content"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.25 }}
              >
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}