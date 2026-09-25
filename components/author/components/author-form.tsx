// Compact author form with integrated direct avatar uploader, image cropper modal, shadcn UI DatePickers, and inline toggle
"use client";

import { type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { parseSmartDate } from "@/lib/date-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { AuthorAvatarUploader } from "./author-avatar-uploader";
import { ImageCropModal } from "./image-crop-modal";

interface AuthorFormProps {
  name: string;
  onNameChange: (val: string) => void;
  nameBn: string;
  onNameBnChange: (val: string) => void;
  bio: string;
  onBioChange: (val: string) => void;
  photo: string;
  photoPreview: string | null;
  onPhotoFileChange: (file: File | null) => void;
  onRemovePhoto: () => void;
  isUploadingPhoto: boolean;
  isCropModalOpen: boolean;
  cropImageSrc: string | null;
  onCropComplete: (croppedFile: File | null, croppedUrl: string) => Promise<void>;
  onCloseCropModal: () => void;
  birthDate: string;
  onBirthDateChange: (val: string) => void;
  deathDate: string;
  onDeathDateChange: (val: string) => void;
  isActive: boolean;
  onIsActiveChange: (val: boolean) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  formErrors: Record<string, string>;
  onReset: () => void;
  onCancelEdit?: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1";

export function AuthorForm({
  name,
  onNameChange,
  nameBn,
  onNameBnChange,
  bio,
  onBioChange,
  photo,
  photoPreview,
  onPhotoFileChange,
  onRemovePhoto,
  isUploadingPhoto,
  isCropModalOpen,
  cropImageSrc,
  onCropComplete,
  onCloseCropModal,
  birthDate,
  onBirthDateChange,
  deathDate,
  onDeathDateChange,
  isActive,
  onIsActiveChange,
  isSubmitting,
  isEditing = false,
  formErrors,
  onReset,
  onCancelEdit,
  onSubmit,
}: AuthorFormProps) {
  const isBusy = isSubmitting || isUploadingPhoto;

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-7"
      >
        {/* Header with Minimal Inline Status Toggle */}
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isEditing ? "Edit Author" : "Add New Author"}
            </h2>
            <p className="text-xs text-text-secondary">
              {isEditing
                ? "Update author profile, bio, or status. Slugs update automatically if name changes."
                : "Register an author with automatic unique slug indexing."}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-2xs">
            <Label
              htmlFor="authorActiveToggle"
              className="text-xs font-medium cursor-pointer text-text-secondary select-none"
            >
              {isActive ? "Active" : "Draft"}
            </Label>
            <Switch
              id="authorActiveToggle"
              checked={isActive}
              onCheckedChange={onIsActiveChange}
              disabled={isBusy}
              className="scale-90"
            />
          </div>
        </div>

        {/* Top Identity Row: Avatar Uploader (Left) + English/Bengali Names (Right) */}
        <div className="mb-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <AuthorAvatarUploader
            name={name}
            photo={photo}
            photoPreview={photoPreview}
            onPhotoFileChange={onPhotoFileChange}
            onRemovePhoto={onRemovePhoto}
            isUploadingPhoto={isUploadingPhoto}
            disabled={isSubmitting}
          />

          {/* English & Bengali Names */}
          <div className="w-full flex-1 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="authorNameEn" className={LABEL_CLASS}>
                <span>Author Name (English)</span>
                <span className="text-accent">*</span>
              </Label>
              <Input
                id="authorNameEn"
                required
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g. Rabindranath Tagore"
                className="h-10 text-sm"
                disabled={isBusy}
              />
              {formErrors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="authorNameBn" className={LABEL_CLASS}>
                <span>Author Name (Bengali)</span>
              </Label>
              <Input
                id="authorNameBn"
                value={nameBn}
                onChange={(e) => onNameBnChange(e.target.value)}
                placeholder="e.g. রবীন্দ্রনাথ ঠাকুর"
                className="h-10 text-sm"
                disabled={isBusy}
              />
              {formErrors.nameBn && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.nameBn}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dates Row: Birth Date & Death Date (Smart DatePickers with typing & copy-paste) */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Birth Date */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="authorBirthDate" className={LABEL_CLASS}>
                <span>Birth Date</span>
              </Label>
              <span className="text-[10px] text-text-muted">
                Type, paste, or pick
              </span>
            </div>
            <DatePicker
              id="authorBirthDate"
              value={birthDate}
              onChange={onBirthDateChange}
              placeholder="e.g. 1861-05-07 or 7 May 1861"
              maxDate={new Date()}
              disabled={isBusy}
            />
            {formErrors.birthDate && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.birthDate}
              </p>
            )}
          </div>

          {/* Death Date */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="authorDeathDate" className={LABEL_CLASS}>
                <span>Death Date (Optional)</span>
              </Label>
              <span className="text-[10px] text-text-muted">
                Type, paste, or pick
              </span>
            </div>
            <DatePicker
              id="authorDeathDate"
              value={deathDate}
              onChange={onDeathDateChange}
              placeholder="e.g. 1941-08-07 or 7 Aug 1941"
              minDate={birthDate ? (parseSmartDate(birthDate) ?? undefined) : undefined}
              maxDate={new Date()}
              disabled={isBusy}
            />
            {formErrors.deathDate && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.deathDate}
              </p>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="mb-6 space-y-1.5">
          <Label htmlFor="authorBio" className={LABEL_CLASS}>
            <span>Biography</span>
          </Label>
          <Textarea
            id="authorBio"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Write a brief literary biography..."
            className="min-h-[110px] resize-none text-sm"
            disabled={isBusy}
          />
          {formErrors.bio && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={isEditing ? onCancelEdit : onReset}
            disabled={isBusy}
            className="h-10 flex-1 cursor-pointer text-sm"
          >
            {isEditing ? "Cancel Edit" : "Clear Form"}
          </Button>
          <Button
            type="submit"
            disabled={isBusy}
            className="h-10 flex-1 cursor-pointer bg-accent font-semibold text-white hover:bg-accent-hover text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? "Saving Changes..." : "Creating Author..."}
              </span>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Author"
            )}
          </Button>
        </div>
      </form>

      {/* Image Crop Dialog Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        onClose={onCloseCropModal}
        onCropComplete={onCropComplete}
        isProcessing={isUploadingPhoto}
      />
    </>
  );
}
