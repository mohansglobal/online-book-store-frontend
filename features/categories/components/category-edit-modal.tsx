// Dialog modal for editing category details with React Hook Form and Zod
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateCategory } from "../hooks/use-categories";
import type { Category } from "../types/category.types";
import { CategoryImageUploader } from "./category-image-uploader";

const editCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(100),
  nameBn: z.string().trim().max(100).optional(),
  slug: z.string().trim().min(1, "Slug is required").toLowerCase(),
  description: z.string().trim().max(1000).optional(),
  isActive: z.boolean(),
});

type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

interface CategoryEditModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryEditModal({
  category,
  isOpen,
  onClose,
}: CategoryEditModalProps) {
  const updateMutation = useUpdateCategory();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
        nameBn: category?.nameBn ?? "",
        slug: category?.slug ?? "",
        description: category?.description ?? "",
        isActive: category?.isActive ?? true,
      },
    });

    const onSubmit = async (values: EditCategoryFormValues) => {
      if (!category?._id) return;

      try {
        await updateMutation.mutateAsync({
          id: category._id,
          data: {
            name: values.name,
            nameBn: values.nameBn || undefined,
            slug: values.slug,
            description: values.description || undefined,
            isActive: values.isActive,
            image: selectedImageFile || undefined,
          },
        });

        toast.success(
          selectedImageFile
            ? "Category and image uploaded to Cloudinary successfully!"
            : "Category updated successfully",
        );
        onClose();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to update category";

        toast.error(errorMsg);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Category</DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Update category taxonomy details, slug, and store visibility.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Category Name */}
            <div className="space-y-1.5">
              <Label htmlFor="category-name" className="text-xs font-semibold">
                Category Name (English) <span className="text-destructive">*</span>
              </Label>

              <Input
                id="category-name"
                {...register("name")}
                placeholder="e.g. Fiction, History, Science"
                className="rounded-xl"
            />

            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Bengali Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name-bn" className="text-xs font-semibold">
              Category Name (Bengali)
            </Label>

            <Input
              id="category-name-bn"
              {...register("nameBn")}
              placeholder="e.g. কথাসাহিত্য, ইতিহাস"
              className="rounded-xl font-bengali"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="category-slug" className="text-xs font-semibold">
              URL Slug <span className="text-destructive">*</span>
            </Label>

            <Input
              id="category-slug"
              {...register("slug")}
              placeholder="e.g. fiction, history"
              className="rounded-xl font-mono text-xs"
            />

            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="category-desc" className="text-xs font-semibold">
              Description
            </Label>

            <Textarea
              id="category-desc"
              {...register("description")}
              rows={3}
              placeholder="Brief overview of this book category..."
              className="rounded-xl text-xs"
            />
          </div>

          {/* Image Uploader */}
          <CategoryImageUploader
            currentImageUrl={category?.image}
            categoryName={category?.name ?? ""}
            categorySlug={category?.slug ?? ""}
            selectedFile={selectedImageFile}
            onFileSelect={setSelectedImageFile}
            disabled={updateMutation.isPending}
          />

          {/* Active Status Switch */}
          <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/20">
            <div className="space-y-0.5">
              <Label htmlFor="category-status" className="text-xs font-semibold cursor-pointer">
                Store Visibility
              </Label>
              <p className="text-xs text-muted-foreground">
                Active categories appear in store navigation and filter menus
              </p>
            </div>

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="category-status"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Actions */}
          <DialogFooter className="gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl bg-accent text-xs font-medium text-white hover:bg-accent-hover"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
