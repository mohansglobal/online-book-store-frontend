"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type WishlistClearDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmClear: () => void;
  itemCount: number;
};

export function WishlistClearDialog({
  open,
  onOpenChange,
  onConfirmClear,
  itemCount,
}: WishlistClearDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-border sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl text-foreground">
            Clear Wishlist?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to remove all {itemCount} books from your
            wishlist? This action will remove all saved items.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-foreground hover:bg-surface-hover">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmClear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Clear All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
