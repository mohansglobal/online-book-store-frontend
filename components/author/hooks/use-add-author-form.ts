// Custom hook managing add and edit author form state, cropping, upload, validation, and submission
"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  useCreateAuthor,
  useUpdateAuthor,
  createAuthorSchema,
  updateAuthorSchema,
  type Author,
  type UpdateAuthorInput,
} from "@/features/authors";
import { uploadSingleImage } from "@/lib/api/upload.api";
import { parseAndFormatDate } from "@/lib/date-utils";

export function useAddAuthorForm() {
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [createdAuthor, setCreatedAuthor] = useState<Author | null>(null);

  const { mutateAsync: submitCreateAuthor, isPending: isCreating } = useCreateAuthor();
  const { mutateAsync: submitUpdateAuthor, isPending: isUpdating } = useUpdateAuthor();

  const isSubmitting = isCreating || isUpdating;
  const isEditing = Boolean(editingAuthor);

  // Select an author from the list to prefill into the form for editing
  const handleSelectAuthorForEdit = (author: Author) => {
    setEditingAuthor(author);
    setName(author.name || "");
    setNameBn(author.nameBn || "");
    setBio(author.bio || "");
    setPhoto(author.photo || "");
    setPhotoPreview(null);
    setCropImageSrc(null);
    setBirthDate(author.birthDate ? author.birthDate.slice(0, 10) : "");
    setDeathDate(author.deathDate ? author.deathDate.slice(0, 10) : "");
    setIsActive(author.isActive ?? true);
    setFormErrors({});

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Handles local file selection to open crop modal
  const handlePhotoFileChange = (file: File | null) => {
    if (!file) {
      setPhotoPreview(null);
      setPhoto("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Handles applying cropped image and uploading directly to Cloudinary via uploadSingleImage API
  const handleCropComplete = async (croppedFile: File | null, croppedUrl: string) => {
    setPhotoPreview(croppedUrl);

    if (croppedFile) {
      setIsUploadingPhoto(true);

      try {
        const response = await uploadSingleImage(croppedFile, "authors");
        const uploadedUrl =
          response.data?.url ||
          response.data?.urls?.[0] ||
          response.data?.files?.[0]?.secureUrl ||
          response.data?.files?.[0]?.url ||
          "";

        if (uploadedUrl) {
          setPhoto(uploadedUrl);
          setPhotoPreview(uploadedUrl);
          setIsCropModalOpen(false);
          setCropImageSrc(null);
          toast.success("Portrait cropped and uploaded successfully");
        } else {
          toast.error("Upload succeeded but no image URL was returned");
          setIsCropModalOpen(false);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to upload cropped portrait";
        toast.error(message);
        setIsCropModalOpen(false);
      } finally {
        setIsUploadingPhoto(false);
      }
    } else {
      setIsCropModalOpen(false);
    }
  };

  // Closes the crop modal without saving
  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setCropImageSrc(null);
  };

  // Handles clearing author photo
  const handleRemovePhoto = () => {
    setPhoto("");
    setPhotoPreview(null);
    setCropImageSrc(null);
  };

  // Cancels active edit mode and resets the form to blank add mode
  const handleCancelEdit = () => {
    handleReset();
  };

  // Clears all form fields and returns to create mode
  const handleReset = () => {
    setEditingAuthor(null);
    setName("");
    setNameBn("");
    setBio("");
    setPhoto("");
    setPhotoPreview(null);
    setCropImageSrc(null);
    setBirthDate("");
    setDeathDate("");
    setIsActive(true);
    setFormErrors({});
  };

  // Validates and submits author form (POST in create mode, PATCH in edit mode)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});
    setCreatedAuthor(null);

    const normalizedBirth = birthDate.trim()
      ? parseAndFormatDate(birthDate.trim()) || birthDate.trim()
      : undefined;

    const normalizedDeath = deathDate.trim()
      ? parseAndFormatDate(deathDate.trim()) || deathDate.trim()
      : undefined;

    // 1. Edit mode submission
    if (isEditing && editingAuthor) {
      const rawPayload: UpdateAuthorInput = {
        name: name.trim() || undefined,
        nameBn: nameBn.trim() || undefined,
        bio: bio.trim() || undefined,
        photo: photo.trim() || undefined,
        birthDate: normalizedBirth,
        deathDate: normalizedDeath,
        isActive,
      };

      const validationResult = updateAuthorSchema.safeParse(rawPayload);

      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};

        validationResult.error.issues.forEach((issue) => {
          const pathKey = issue.path[0];
          if (pathKey && typeof pathKey === "string") {
            fieldErrors[pathKey] = issue.message;
          }
        });

        setFormErrors(fieldErrors);
        toast.error("Please resolve the validation errors");
        return;
      }

      try {
        const response = await submitUpdateAuthor({
          id: editingAuthor._id,
          data: validationResult.data,
        });

        const updatedAuthor = response.data;
        const successMessage =
          response.message || `Author "${updatedAuthor.name}" updated successfully!`;

        toast.success(successMessage);
        handleReset();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update author";
        toast.error(message);
      }
      return;
    }

    // 2. Create mode submission
    const rawValues = {
      name: name.trim(),
      nameBn: nameBn.trim() || undefined,
      bio: bio.trim() || undefined,
      photo: photo.trim() || undefined,
      birthDate: normalizedBirth,
      deathDate: normalizedDeath,
      isActive,
    };

    const validationResult = createAuthorSchema.safeParse(rawValues);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};

      validationResult.error.issues.forEach((issue) => {
        const pathKey = issue.path[0];
        if (pathKey && typeof pathKey === "string") {
          fieldErrors[pathKey] = issue.message;
        }
      });

      setFormErrors(fieldErrors);
      toast.error("Please resolve the validation errors");
      return;
    }

    try {
      const response = await submitCreateAuthor(validationResult.data);
      const newAuthor = response.data;

      setCreatedAuthor(newAuthor);
      toast.success(
        response.message || `Author "${newAuthor.name}" created successfully!`
      );
      handleReset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create author";
      toast.error(message);
    }
  };

  return {
    name,
    setName,
    nameBn,
    setNameBn,
    bio,
    setBio,
    photo,
    photoPreview,
    birthDate,
    setBirthDate,
    deathDate,
    setDeathDate,
    isActive,
    setIsActive,
    isUploadingPhoto,
    isCropModalOpen,
    cropImageSrc,
    isSubmitting,
    isEditing,
    editingAuthor,
    formErrors,
    createdAuthor,
    handleSelectAuthorForEdit,
    handleCancelEdit,
    handlePhotoFileChange,
    handleCropComplete,
    handleCloseCropModal,
    handleRemovePhoto,
    handleReset,
    handleSubmit,
  };
}
