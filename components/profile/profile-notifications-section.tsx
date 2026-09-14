"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionHeading, ToggleRow } from "./profile-shared";

interface ProfileNotificationsSectionProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  orderNotifications: boolean;
  setOrderNotifications: (value: boolean) => void;
  promotionNotifications: boolean;
  setPromotionNotifications: (value: boolean) => void;
}

const FREQUENCY_OPTIONS = [
  {
    value: "instant",
    label: "Instant notifications",
    description: "Receive updates immediately as events occur.",
  },
  {
    value: "daily",
    label: "Daily digest",
    description: "One daily email summarizing all your notifications.",
  },
  {
    value: "weekly",
    label: "Weekly summary",
    description: "A weekly recap of promotions and recommendations.",
  },
] as const;

export function ProfileNotificationsSection({
  emailNotifications,
  setEmailNotifications,
  orderNotifications,
  setOrderNotifications,
  promotionNotifications,
  setPromotionNotifications,
}: ProfileNotificationsSectionProps) {
  const [frequency, setFrequency] = useState("instant");
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Notification preferences saved successfully");
    }, 300);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Notifications"
        title="Stay in the loop"
        description="Decide what updates and information you want to receive."
      />

      <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-xs">
        <ToggleRow
          id="email-notifs"
          title="Email notifications"
          description="General updates about your account and security alerts."
          checked={emailNotifications}
          onChange={(checked) => {
            setEmailNotifications(checked);
            toast.success(`Email notifications ${checked ? "enabled" : "disabled"}`);
          }}
        />

        <ToggleRow
          id="order-notifs"
          title="Order updates"
          description="Payment, shipping, delivery and cancellation updates."
          checked={orderNotifications}
          onChange={(checked) => {
            setOrderNotifications(checked);
            toast.success(`Order updates ${checked ? "enabled" : "disabled"}`);
          }}
        />

        <ToggleRow
          id="promo-notifs"
          title="Offers & recommendations"
          description="Book recommendations, discounts and special campaigns."
          checked={promotionNotifications}
          onChange={(checked) => {
            setPromotionNotifications(checked);
            toast.success(`Promotions & offers ${checked ? "enabled" : "disabled"}`);
          }}
          last
        />
      </div>

      {/* <div className="rounded-[22px] border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Delivery Frequency</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Control how often promotional and digest emails are sent to your inbox.
          </p>
        </div>

        <RadioGroup
          value={frequency}
          onValueChange={setFrequency}
          className="grid gap-3 sm:grid-cols-3"
        >
          {FREQUENCY_OPTIONS.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`freq-${opt.value}`}
              className={`flex flex-col justify-between rounded-[16px] border p-4 cursor-pointer transition-colors ${
                frequency === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-surface-hover text-card-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{opt.label}</span>
                <RadioGroupItem value={opt.value} id={`freq-${opt.value}`} />
              </div>
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                {opt.description}
              </p>
            </Label>
          ))}
        </RadioGroup>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            size="sm"
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="rounded-full px-5 text-xs font-medium"
          >
            {isSaving ? "Saving..." : "Save preferences"}
          </Button>
        </div>
      </div> */}
    </div>
  );
}
