"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { useHeroStats } from "@/features/stats";

interface HeroStatsProps {
  variants?: Variants;
}

export function HeroStats({ variants }: HeroStatsProps) {
  const { stats } = useHeroStats();

  return (
    <motion.div
      variants={variants}
      className="grid w-full max-w-[820px] grid-cols-2 items-center justify-center gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md md:flex md:gap-10 md:px-10"
    >
      {stats.map((stat, index) => {
        const hasStar = Boolean(stat.hasStar || stat.type === "rating");

        return (
          <Fragment key={stat.id}>
            {index > 0 && (
              <div className="hidden h-8 w-px bg-white/10 md:block" />
            )}

            <div className="flex flex-col items-center gap-1">
              <strong className="inline-flex items-center gap-1.5 font-display text-2xl font-normal tracking-tight text-white">
                {stat.value}

                {hasStar && (
                  <Star
                    size={16}
                    aria-hidden="true"
                    className="fill-orange-500 text-orange-500"
                  />
                )}
              </strong>

              <span className="text-[11px] tracking-widest text-zinc-500 uppercase">
                {stat.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </motion.div>
  );
}
