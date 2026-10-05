// Table component displaying the list of categories with edit icon
import React from "react";
import { format } from "date-fns";
import { Edit2, BookOpen, Layers, CheckCircle2, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "../types/category.types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
}

export function CategoryTable({
  categories,
  isLoading,
  onEditCategory,
}: CategoryTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface shadow-xs">
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <Layers size={28} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-foreground">
          No categories found
        </h3>

        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Try adjusting your search criteria or clear your current filters to view categories.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Category
              </th>
              {/* <th scope="col" className="px-5 py-3.5">
                Slug
              </th> */}
              <th scope="col" className="px-5 py-3.5 text-center">
                Books Listed
              </th>
              <th scope="col" className="px-5 py-3.5">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5">
                Created
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {categories.map((category) => {
              const isActive = category.isActive ?? true;
              const formattedDate = category.createdAt
                ? format(new Date(category.createdAt), "MMM d, yyyy")
                : "-";

              return (
                <tr
                  key={category._id}
                  className="group transition-colors duration-150 hover:bg-muted/20"
                >
                  {/* Category Name & Bengali */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {category.name}
                      </span>
                      {category.nameBn && (
                        <span className="text-xs text-muted-foreground">
                          {category.nameBn}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 font-mono text-xs text-text-secondary">
                      {category.slug}
                    </span>
                  </td>

                  {/* Books Count */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400">
                      <BookOpen size={12} />
                      {category.bookCount ?? 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {isActive ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                      >
                        <CheckCircle2 size={12} />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      >
                        <PowerOff size={12} />
                        Inactive
                      </Badge>
                    )}
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {formattedDate}
                  </td>

                  {/* Edit Action Icon */}
                  <td className="px-5 py-4 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCategory(category)}
                      title={`Edit ${category.name}`}
                      aria-label={`Edit ${category.name}`}
                      className="h-8.5 w-8.5 cursor-pointer rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent active:scale-95"
                    >
                      <Edit2 size={15} aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
