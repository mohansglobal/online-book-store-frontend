"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "./button";

export function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    setSubscribed(true);
  };

  return (
    <section className="border-b border-border bg-card py-[90px] md:py-[130px]">
      <div className="mx-auto grid w-[min(1320px,calc(100%-36px))] grid-cols-1 gap-9 md:w-[min(1320px,calc(100%-72px))] md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-[100px]">
        {/* Heading */}
        <div>
          <h2 className="m-0 font-display text-[clamp(46px,5.5vw,86px)] leading-[0.9] font-normal text-foreground">
            Good books deserve
            <br />

            <em className="italic text-accent">
              good company.
            </em>
          </h2>
        </div>

        {/* Newsletter Form */}
        <div>
          <p className="m-0 mb-6 max-w-[470px] text-sm leading-relaxed text-muted-foreground md:text-base">
            Get thoughtful recommendations, new releases and
            reading inspiration delivered occasionally.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 sm:flex-row"
          >
            {subscribed ? (
              <div
                role="status"
                aria-live="polite"
                className="flex h-[50px] items-center gap-2.5 text-sm font-medium text-accent"
              >
                <Check
                  size={18}
                  aria-hidden="true"
                />

                You&apos;re on the reading list.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  aria-label="Email address"
                  placeholder="Your email address"
                  className="h-[50px] min-w-0 flex-1 rounded-sm border border-border bg-secondary px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />

                <Button type="submit">
                  Join the Reading List

                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}