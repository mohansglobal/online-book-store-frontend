"use client";

import React, { useState } from "react";
import { LockKeyhole, ShieldAlert, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SectionHeading, SettingsRow } from "./profile-shared";
import {
  useCurrentUser,
  useChangePasswordMutation,
  changePasswordSchema,
  ForgotPasswordFlow,
} from "@/features/auth";
import { isApiClientError } from "@/lib/api";

export function ProfileSecuritySection() {
  const { data: user } = useCurrentUser();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useChangePasswordMutation();
  const isUpdatingPassword = changePasswordMutation.isPending;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parseResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      toast.error(firstIssue.message);
      return;
    }

    try {
      const res = await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      toast.success(res.message || "Password updated successfully");
      setPasswordDialogOpen(false);
      setShowForgotPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        toast.error(err.message || "Failed to update password");
        return;
      }

      if (err instanceof Error) {
        toast.error(err.message);
        return;
      }

      toast.error("An unexpected error occurred while updating password");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested. Check your email for confirmation.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Security"
        title="Login & security"
        description="Control how you sign in and keep your account protected."
      />

      <div className="space-y-4">
        <Dialog
          open={passwordDialogOpen}
          onOpenChange={(open) => {
            setPasswordDialogOpen(open);
            if (!open) {
              setShowForgotPassword(false);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }
          }}
        >
          <SettingsRow
            icon={LockKeyhole}
            title="Password"
            description="Manage your account password or reset if forgotten"
            action="Change password"
            onClick={() => {
              setShowForgotPassword(false);
              setPasswordDialogOpen(true);
            }}
          />

          <DialogContent className="sm:max-w-[460px]">
            {showForgotPassword ? (
              <div className="space-y-4 py-2">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <KeyRound size={16} />
                    </span>
                    <DialogTitle>Reset Password</DialogTitle>
                  </div>
                  <DialogDescription className="text-xs">
                    Receive a verification code to set up a new password.
                  </DialogDescription>
                </DialogHeader>

                <ForgotPasswordFlow
                  initialIdentifier={user?.email || user?.mobileNumber || ""}
                  onSuccess={() => {
                    toast.success("Password reset successfully. You can now use your new password.");
                    setShowForgotPassword(false);
                    setPasswordDialogOpen(false);
                  }}
                  onCancel={() => setShowForgotPassword(false)}
                />
              </div>
            ) : (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <KeyRound size={16} />
                    </span>
                    <DialogTitle>Change Password</DialogTitle>
                  </div>
                  <DialogDescription className="text-xs">
                    Enter your current password and choose a secure new password.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="curr-pass" className="text-xs">
                        Current password
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-primary hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Input
                      id="curr-pass"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isUpdatingPassword}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="new-pass" className="text-xs">
                      New password (min. 8 characters)
                    </Label>
                    <Input
                      id="new-pass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isUpdatingPassword}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-pass" className="text-xs">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirm-pass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isUpdatingPassword}
                      required
                    />
                  </div>

                  <DialogFooter className="pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPasswordDialogOpen(false)}
                      disabled={isUpdatingPassword}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      size="sm"
                      disabled={isUpdatingPassword}
                      className="cursor-pointer"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 size={13} className="mr-1.5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update password"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-[22px] border border-destructive/20 bg-destructive/5 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-destructive">
              Delete account
            </h3>
            <p className="mt-1 max-w-xl text-[11px] leading-5 text-muted-foreground">
              Permanently remove your account and personal information. This action
              cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-full text-xs font-medium cursor-pointer"
              >
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs">
                  This action cannot be undone. This will permanently delete your account
                  and remove your reading history, orders, and personal data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
