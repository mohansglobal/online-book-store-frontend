// Compact table and list of registered authors with edit and delete alert confirmation
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ExternalLink, RefreshCw, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAuthors, useDeleteAuthor, type Author } from "@/features/authors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export const DEFAULT_AUTHOR_FALLBACK =
  "https://i.pinimg.com/1200x/65/f4/d9/65f4d91a400d893d02d1151c4616bba5.jpg";

export function getAuthorImage(photo?: string): string {
  if (!photo) {
    return DEFAULT_AUTHOR_FALLBACK;
  }

  const trimmed = photo.trim();
  if (!trimmed) {
    return DEFAULT_AUTHOR_FALLBACK;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const backendBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    "http://localhost:5000";

  return `${backendBase}/assets/upload/author/${trimmed}`;
}

function AuthorRowAvatar({ photo, name }: { photo?: string; name: string }) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = getAuthorImage(photo);
  const displaySrc = hasError ? DEFAULT_AUTHOR_FALLBACK : resolvedSrc;

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/70 bg-[#ebe4d2]">
      <Image
        key={resolvedSrc}
        src={displaySrc}
        alt={name || "Author"}
        fill
        sizes="40px"
        unoptimized={typeof displaySrc === "string"}
        onError={() => setHasError(true)}
        className="object-cover object-top"
      />
    </div>
  );
}

interface RecentAuthorsListProps {
  onEditAuthor?: (author: Author) => void;
}

export function RecentAuthorsList({ onEditAuthor }: RecentAuthorsListProps) {
  const [search, setSearch] = useState("");
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);

  const { data: authorsResponse, isLoading, isFetching, refetch } = useAuthors({
    limit: 150,
    search: search.trim() || undefined,
  });

  const { mutate: deleteAuthorMutation, isPending: isDeleting } = useDeleteAuthor();

  const authors = authorsResponse?.data ?? [];

  const handleConfirmDelete = () => {
    if (!authorToDelete?._id) {
      return;
    }

    deleteAuthorMutation(authorToDelete._id, {
      onSettled: () => {
        setAuthorToDelete(null);
      },
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">Registered Authors</h3>
            <p className="text-xs text-text-secondary">
              Catalog authors with auto-generated slugs ({authors.length} loaded).
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter authors by name..."
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
              >
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : authors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
            No authors found. Add an author using the form on the left.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {authors.map((author) => {
              const authorName = author.name;
              const authorSlug = author.slug;
              const isActive = author.isActive ?? true;

              return (
                <div
                  key={author._id || author.slug}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/50 p-3 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <AuthorRowAvatar photo={author.photo} name={authorName} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {authorName}
                        </p>
                        {author.nameBn && (
                          <span className="text-[11px] text-muted-foreground">
                            ({author.nameBn})
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs font-mono text-accent">
                        /{authorSlug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>

                    {onEditAuthor && (
                      <button
                        type="button"
                        onClick={() => onEditAuthor(author)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:border-accent hover:text-accent cursor-pointer"
                        title="Edit Author"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setAuthorToDelete(author)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:border-destructive hover:text-destructive cursor-pointer"
                      title="Delete Author"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <Link
                      href={`/authors`}
                      target="_blank"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-accent"
                      title="View on Storefront"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Soft Delete Alert Confirmation Modal */}
      <AlertDialog
        open={Boolean(authorToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setAuthorToDelete(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-md bg-surface border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Author
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-text-secondary">
              Are you sure you want to delete{" "}
              <strong className="text-foreground font-semibold">
                &ldquo;{authorToDelete?.name}&rdquo;
              </strong>
              ? This action will soft-delete the author and exclude them from catalog listings.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setAuthorToDelete(null)}
              className="h-9 text-xs cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-9 text-xs font-semibold cursor-pointer gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Author"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
