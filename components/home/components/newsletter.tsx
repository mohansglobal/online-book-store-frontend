"use client";

import { useState, type FormEvent } from "react";

import { ArrowRight, Check, Loader2 } from "lucide-react";

import { useSubscribeNewsletter } from "@/features/newsletter";
import { useNewsletterContent } from "@/features/contents";

import { Button } from "./button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const newsletterContent = useNewsletterContent();

  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    subscribeMutation.mutate({
      email: trimmedEmail,
      source: "footer",
    });
  };

  const isSubscribed = subscribeMutation.isSuccess;

  const isPending = subscribeMutation.isPending;

  const errorMessage = subscribeMutation.error?.message;

  const successMessage =
    subscribeMutation.data?.message || "You're on the reading list.";

  return (
    <section className="border-b border-border bg-card py-[90px] md:py-[130px]">
      <div className="mx-auto grid w-[min(1320px,calc(100%-36px))] grid-cols-1 gap-9 md:w-[min(1320px,calc(100%-72px))] md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-[100px]">
        {/* Heading */}
        <div>
          {newsletterContent ? (
            <h2 className="m-0 font-display text-[clamp(46px,5.5vw,86px)] font-normal leading-[0.9] text-foreground">
              {newsletterContent.heading}

              {newsletterContent.headingAccent ? (
                <>
                  <br />
                  <em className="italic text-accent">
                    {newsletterContent.headingAccent}
                  </em>
                </>
              ) : null}
            </h2>
          ) : (
            <div className="space-y-3 animate-pulse">
              <div className="h-14 w-3/4 rounded bg-muted" />
              <div className="h-14 w-1/2 rounded bg-muted" />
            </div>
          )}
        </div>

        {/* Newsletter Form */}
        <div>
          {newsletterContent ? (
            <p className="m-0 mb-6 max-w-[470px] text-sm leading-relaxed text-muted-foreground md:text-base">
              {newsletterContent.description}
            </p>
          ) : (
            <div className="mb-6 max-w-[470px] space-y-2 animate-pulse">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 sm:flex-row"
          >
            {isSubscribed ? (
              <div
                role="status"
                aria-live="polite"
                className="flex h-[50px] items-center gap-2.5 text-sm font-medium text-accent"
              >
                <Check
                  size={18}
                  aria-hidden="true"
                />

                {successMessage}
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    autoComplete="email"
                    aria-label="Email address"
                    placeholder="Your email address"
                    className="h-[50px] min-w-0 flex-1 rounded-sm border border-border bg-secondary px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <>
                        Join the Reading List
                        <ArrowRight
                          size={16}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Button>
                </div>

                {errorMessage ? (
                  <p
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}