"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useLogout } from "../hooks/use-logout";
import { useLogoutModalStore } from "../stores/use-logout-modal-store";

export function LogoutAlertDialog() {
  const router = useRouter();

  const isOpen = useLogoutModalStore((state) => state.isOpen);
  const close = useLogoutModalStore((state) => state.close);

  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => {
      close();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log out. Please try again.");
    },
  });

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) close();
      }}
    >
      <AlertDialogContent className="max-w-md overflow-hidden border border-border bg-background p-6 shadow-2xl rounded-2xl sm:rounded-2xl">
        <LogOut
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-4 size-24 rotate-12 text-destructive opacity-[0.05]"
        />

        <AlertDialogHeader className="relative z-10 space-y-1.5">
          <AlertDialogTitle className="text-lg font-semibold">
            Log out?
          </AlertDialogTitle>

          <AlertDialogDescription className="max-w-sm text-sm leading-5 text-text-secondary">
            You&apos;ll need to sign in again to access your dashboard, saved
            books, and orders.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="relative z-10 mt-4 gap-2">
          <AlertDialogCancel
            disabled={isPending}
            className="h-9 rounded-lg px-4 text-sm"
          >
            Cancel
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => logout()}
            className="h-9 gap-1.5 rounded-lg px-4 text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="size-3.5" />
                Log out
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}