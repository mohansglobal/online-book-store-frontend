"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
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
      {/* Left Video / Branding Section */}
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

      {/* Right Form Container */}
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
          <VerifyEmailForm email={email} />
        </motion.div>
      </section>
    </main>
  );
}
