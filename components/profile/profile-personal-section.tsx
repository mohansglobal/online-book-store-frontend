"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Mail, Smartphone, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, SectionHeading } from "./profile-shared";
import { useCurrentUser } from "@/features/auth";

export function ProfilePersonalSection() {
  const { data: user } = useCurrentUser();

  const [firstName, setFirstName] = useState("Mohan");
  const [lastName, setLastName] = useState("Das");
  const [email, setEmail] = useState("mohan@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const nameParts = user.name?.trim().split(/\s+/) ?? [];

    setFirstName(nameParts[0] ?? "");
    setLastName(nameParts.slice(1).join(" "));
    setEmail(user.email ?? "");
    setPhone(user.mobileNumber ?? "");
  }, [user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Personal details updated successfully");
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Your profile"
        title="Personal information"
        description="Manage the details connected to your account and shopping experience."
      />

      <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Decorative subtle background element */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-[100px] bg-muted/40"
        />

        <div className="relative">
          <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {/* <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound size={18} />
              </div> */}

              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Basic details
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Update the basic information associated with your account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-7">
              {/* Name Fields */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" htmlFor="first-name" required>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Enter first name"
                    className="h-12 rounded-md border-border bg-background px-4 shadow-none transition focus-visible:ring-2"
                  />
                </Field>

                <Field label="Last name" htmlFor="last-name" required>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Enter last name"
                    className="h-12 rounded-md border-border bg-background px-4 shadow-none transition focus-visible:ring-2"
                  />
                </Field>
              </div>

              {/* Contact Details Section */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Contact details
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-5">
                  <Field label="Email address" htmlFor="email-address" required>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="email-address"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter email address"
                        className="h-12 rounded-md border-border bg-background pl-11 pr-4 shadow-none"
                      />
                    </div>
                  </Field>

                  <Field label="Phone number" htmlFor="phone-number">
                    <div className="relative">
                      <Smartphone
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="phone-number"
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="Enter phone number"
                        className="h-12 rounded-md border-border bg-background pl-11 pr-4 shadow-none"
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                Your profile information is only used for your account, orders, and delivery experience.
              </p>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 rounded-full px-6 text-xs font-semibold cursor-pointer"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    Save changes
                    <ArrowUpRight size={14} className="ml-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}