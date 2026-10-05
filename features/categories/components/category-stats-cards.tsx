// Summary metrics cards for Category Dashboard
import React from "react";
import {
  BookOpen,
  CheckCircle2,
  FolderTree,
  PowerOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryStatsCardsProps {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalBookListings: number;
  isLoading?: boolean;
}

export function CategoryStatsCards({
  totalCategories,
  activeCategories,
  inactiveCategories,
  totalBookListings,
  isLoading = false,
}: CategoryStatsCardsProps) {
  const cards = [
    {
      title: "Total Categories",
      value: totalCategories,
      subtitle: "Catalog taxonomy groups",
      icon: FolderTree,
      iconColor: "text-accent",
      iconBg: "bg-accent/10 border-accent/20",
    },
    {
      title: "Active Categories",
      value: activeCategories,
      subtitle: "Visible in store navigation",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Inactive Categories",
      value: inactiveCategories,
      subtitle: "Hidden from buyer browse",
      icon: PowerOff,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Total Book Listings",
      value: totalBookListings,
      subtitle: "Associated catalog titles",
      icon: BookOpen,
      iconColor: "text-sky-600 dark:text-sky-400",
      iconBg: "bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="border-border bg-surface shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide uppercase text-text-secondary">
                  {card.title}
                </p>

                {isLoading ? (
                  <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value.toLocaleString()}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${card.iconBg}`}
              >
                <Icon size={20} className={card.iconColor} aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
