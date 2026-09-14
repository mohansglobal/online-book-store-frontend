"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Your profile"
        title="Personal information"
        description="Manage the details connected to your account and shopping experience."
      />

      <div className="mt-8 overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
        <div className="grid xl:grid-cols-[330px_1fr]">
          {/* LEFT PROFILE PANEL */}
          <ProfileSummary
            name={`${firstName} ${lastName}`.trim()}
            email={email}
            profilePicture={user?.profilePicture}
          />

          {/* RIGHT FORM PANEL */}
          <div className="relative p-5 sm:p-8 lg:p-10">
            {/* decorative background */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-[100px] bg-muted/40"
            />

            <div className="relative">
              <div className="mb-9 flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UserRound size={18} />
                  </div>

                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Basic details
                  </h2>

                  <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                    Update the basic information associated with your account.
                  </p>
                </div>


              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-7">
                  {/* NAME */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="First name"
                      htmlFor="first-name"
                      required
                    >
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(event) =>
                          setFirstName(event.target.value)
                        }
                        placeholder="Enter first name"
                        className="h-12 rounded-md border-border bg-background px-4 shadow-none transition focus-visible:ring-2"
                      />
                    </Field>

                    <Field
                      label="Last name"
                      htmlFor="last-name"
                      required
                    >
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(event) =>
                          setLastName(event.target.value)
                        }
                        placeholder="Enter last name"
                        className="h-12 rounded-md border-border bg-background px-4 shadow-none transition focus-visible:ring-2"
                      />
                    </Field>
                  </div>

                  {/* CONTACT SECTION */}
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Contact details
                      </span>

                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-5">
                      {/* EMAIL */}
                      <Field
                        label="Email address"
                        htmlFor="email-address"
                        required
                      >
                        <div className="relative">
                          <Mail
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />

                          <Input
                            id="email-address"
                            type="email"
                            value={email}
                            onChange={(event) =>
                              setEmail(event.target.value)
                            }
                            placeholder="Enter email address"
                            className="h-12 rounded-md border-border bg-background pl-11 pr-28 shadow-none"
                          />


                        </div>
                      </Field>

                      {/* PHONE */}
                      <Field
                        label="Phone number"
                        htmlFor="phone-number"
                      >
                        <div className="relative">
                          <Smartphone
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />

                          <Input
                            id="phone-number"
                            type="tel"
                            value={phone}
                            onChange={(event) =>
                              setPhone(event.target.value)
                            }
                            placeholder="Enter phone number"
                            className="h-12 rounded-md border-border bg-background pl-11 shadow-none"
                          />
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                    Your profile information is only used for your account,
                    orders and delivery experience.
                  </p>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 rounded-full px-6 text-xs font-semibold"
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        Save changes
                        <ArrowUpRight size={14} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProfileSummaryProps {
  name: string;
  email: string;
  profilePicture?: string | null;
}

function ProfileSummary({ name, email, profilePicture }: ProfileSummaryProps) {
  const initials = getInitials(name);

  return (
    <div className="relative overflow-hidden bg-[#0b2116] p-6 text-[#f4f0e6] sm:p-8 xl:min-h-[610px]">
      {/* Background image if user has profile picture */}
      {profilePicture ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profilePicture}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2116] via-[#0b2116]/85 to-[#0b2116]/55 pointer-events-none" />
        </>
      ) : (
        <>
          {/* decorative circles */}
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10"
          />

          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10"
          />
        </>
      )}

      <div className="relative z-10 flex h-full flex-col">
        {/* TOP */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a58d53]">
              Reader profile
            </p>

            <span className="h-2 w-2 rounded-full bg-[#a58d53]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] bg-[#f4f0e6] font-serif text-2xl text-[#0b2116] shadow-md border border-white/20"
          >
            {profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePicture}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </motion.div>

          <div className="mt-6">
            <h3 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl text-white">
              {name || "Your name"}
            </h3>

            <p className="mt-2 truncate text-xs text-[#89a896]">
              {email}
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 xl:mt-auto">
          <div className="mb-6 h-px bg-white/10" />

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a58d53]">
            Member since
          </p>

          <p className="mt-2 font-serif text-2xl tracking-tight text-white">
            August 2026
          </p>

          <p className="mt-5 max-w-[230px] text-xs leading-5 text-[#89a896]">
            Thank you for being part of our growing community of readers.
          </p>

          <div className="mt-7 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#f4f0e6]/60">
            <Check size={12} className="text-[#a58d53]" />
            Verified member
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}