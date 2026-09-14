"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { ProfileCard } from "./profile-card";
import { ProfilePersonalSection } from "./profile-personal-section";
import { ProfileSecuritySection } from "./profile-security-section";
import { ProfileNotificationsSection } from "./profile-notifications-section";
import { ProfileAppearanceSection } from "./profile-appearance-section";
import { PROFILE_MENU_ITEMS, type SettingsSection } from "./profile-types";

export function ProfilePage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promotionNotifications, setPromotionNotifications] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      {/* 3D Carousel Category Banner */}
      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="grid min-h-[760px] lg:grid-cols-[310px_minmax(0,1fr)]">
              {/* Sidebar navigation */}
              <aside className="border-b border-border p-5 lg:border-b-0 lg:border-r lg:p-6">
                <ProfileCard />

                <nav className="mt-6 space-y-1.5" aria-label="Profile navigation">
                  {PROFILE_MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className={`group flex w-full items-center gap-3 rounded-[16px] px-3.5 py-3 text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-surface-hover text-foreground"
                        }`}
                      >
                        <span
                          className={`grid size-10 shrink-0 place-items-center rounded-[12px] ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-surface-soft text-text-secondary"
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">
                            {item.label}
                          </span>
                          <span
                            className={`mt-0.5 block truncate text-[11px] ${
                              isActive
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.description}
                          </span>
                        </span>

                        <ChevronRight
                          size={16}
                          className={`transition-transform ${
                            isActive
                              ? "translate-x-0 text-primary-foreground"
                              : "text-muted-foreground group-hover:translate-x-0.5"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Active section content */}
              <section className="bg-background/40 p-5 sm:p-7 lg:p-8">
                {activeSection === "profile" && <ProfilePersonalSection />}

                {activeSection === "security" && <ProfileSecuritySection />}

                {activeSection === "notifications" && (
                  <ProfileNotificationsSection
                    emailNotifications={emailNotifications}
                    setEmailNotifications={setEmailNotifications}
                    orderNotifications={orderNotifications}
                    setOrderNotifications={setOrderNotifications}
                    promotionNotifications={promotionNotifications}
                    setPromotionNotifications={setPromotionNotifications}
                  />
                )}

                {activeSection === "appearance" && <ProfileAppearanceSection />}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
