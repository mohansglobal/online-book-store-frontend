"use client";

import React, { useState } from "react";
import { LockKeyhole, ShieldAlert, KeyRound } from "lucide-react";
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
  DialogTrigger,
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
import { SectionHeading, SettingsRow, ToggleRow } from "./profile-shared";

export function ProfileSecuritySection() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    }, 500);
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
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <SettingsRow
            icon={LockKeyhole}
            title="Password"
            description="Last changed 3 months ago"
            action="Change password"
            onClick={() => setPasswordDialogOpen(true)}
          />

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound size={16} />
                </span>
                <DialogTitle>Change Password</DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                Enter your current password and a secure new password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="curr-pass" className="text-xs">Current password</Label>
                <Input
                  id="curr-pass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-pass" className="text-xs">New password</Label>
                <Input
                  id="new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-pass" className="text-xs">Confirm new password</Label>
                <Input
                  id="confirm-pass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Updating..." : "Update password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-xs">
          <ToggleRow
            id="two-factor"
            title="Two-factor authentication (2FA)"
            description="Add an extra layer of security when logging into your account."
            checked={twoFactorEnabled}
            onChange={(checked) => {
              setTwoFactorEnabled(checked);
              toast.success(`Two-factor authentication ${checked ? "enabled" : "disabled"}`);
            }}
            last
          />
        </div> */}
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
                className="rounded-full text-xs font-medium"
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
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
