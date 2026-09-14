"use client";

import React, { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SectionHeading, ToggleRow } from "./profile-shared";

const THEMES = [
  {
    id: "light",
    label: "Light",
    description: "Crisp and clear interface with light background",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark",
    description: "Easy on the eyes in low-light environments",
    icon: Moon,
  },
  {
    id: "system",
    label: "System",
    description: "Syncs automatically with your OS preference",
    icon: Monitor,
  },
] as const;

export function ProfileAppearanceSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast.success(`Theme switched to ${newTheme}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Appearance"
        title="Make it feel like yours"
        description="Choose how the bookstore interface should look and behave on your device."
      />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Theme</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Select your preferred color mode for browsing books.
          </p>
        </div>

        <RadioGroup
          value={theme}
          onValueChange={(val) => handleThemeChange(val as "light" | "dark" | "system")}
          className="grid gap-4 sm:grid-cols-3"
        >
          {THEMES.map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;

            return (
              <Label
                key={item.id}
                htmlFor={`theme-${item.id}`}
                className={`relative flex flex-col justify-between rounded-[22px] border p-5 cursor-pointer transition-all duration-200 shadow-xs ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card hover:border-accent/60 hover:bg-surface-hover text-card-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-10 place-items-center rounded-[13px] ${
                      isSelected ? "bg-white/15 text-white" : "bg-surface-soft text-foreground"
                    }`}
                  >
                    <Icon size={18} />
                  </span>

                  <RadioGroupItem
                    value={item.id}
                    id={`theme-${item.id}`}
                    className={isSelected ? "border-white text-white data-[state=checked]:bg-white data-[state=checked]:text-primary" : ""}
                  />
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p
                    className={`mt-1 text-[10px] leading-4 ${
                      isSelected ? "text-primary-foreground/75" : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Accessibility & Motion</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Fine-tune animation and contrast preferences.
          </p>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-xs">
          <ToggleRow
            id="reduced-motion"
            title="Reduce motion"
            description="Minimize smooth animations and large parallax movements."
            checked={reducedMotion}
            onChange={(checked) => {
              setReducedMotion(checked);
              toast.success(`Reduced motion ${checked ? "enabled" : "disabled"}`);
            }}
          />

          <ToggleRow
            id="high-contrast"
            title="High contrast text"
            description="Increase contrast ratio for improved readability."
            checked={highContrast}
            onChange={(checked) => {
              setHighContrast(checked);
              toast.success(`High contrast ${checked ? "enabled" : "disabled"}`);
            }}
            last
          />
        </div>
      </div>
    </div>
  );
}
