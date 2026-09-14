import React from "react";
import { Check, type LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
        {eyebrow}
      </p>

      <h1 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
        {title}
      </h1>

      <p className="mt-4 max-w-2xl text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={htmlFor}
          className="text-xs font-medium text-foreground/90"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function InfoCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-border bg-card p-5 shadow-xs">
      <span className="grid size-10 place-items-center rounded-[13px] bg-surface-soft text-foreground">
        <Icon size={18} />
      </span>

      <h3 className="mt-4 text-sm font-medium">{title}</h3>

      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
        {description}
      </p>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export function SettingsRow({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-surface-soft text-foreground">
          <Icon size={19} />
        </span>

        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        className="rounded-full text-xs font-medium self-start sm:self-auto"
      >
        {action}
      </Button>
    </div>
  );
}

export function ToggleRow({
  id,
  title,
  description,
  checked,
  onChange,
  disabled,
  last = false,
}: {
  id?: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  last?: boolean;
}) {
  const switchId = id || title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className={`flex items-center justify-between gap-5 p-5 sm:p-6 transition-colors ${
        last ? "" : "border-b border-border"
      }`}
    >
      <div className="space-y-0.5">
        <Label htmlFor={switchId} className="cursor-pointer text-sm font-medium block">
          {title}
        </Label>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>

      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={title}
      />
    </div>
  );
}

export function ThemeCard({
  icon: Icon,
  title,
  active,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-[22px] border p-5 text-left transition-all duration-200 cursor-pointer ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-md"
          : "border-border bg-card hover:border-accent/60 hover:bg-surface-hover text-card-foreground"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid size-10 place-items-center rounded-[13px] ${
            active ? "bg-white/15" : "bg-surface-soft"
          }`}
        >
          <Icon size={18} />
        </span>

        {active && (
          <span className="grid size-6 place-items-center rounded-full bg-accent text-white">
            <Check size={13} strokeWidth={2.5} />
          </span>
        )}
      </div>

      <p className="mt-8 text-sm font-medium">{title}</p>
    </button>
  );
}
