// Dialog modal for cropping images with circular/rectangular preview, zoom, and rotation
"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { ZoomIn, ZoomOut, RotateCw, Loader2, Crop } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCroppedImg, type PixelCrop } from "@/lib/crop-image";
import { toast } from "sonner";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File | null, croppedUrl: string) => Promise<void>;
  isProcessing?: boolean;
  title?: string;
  fileName?: string;
  aspect?: number;
  cropShape?: "round" | "rect";
}

export function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  isProcessing = false,
  title = "Crop Photo",
  fileName = "profile-photo.jpg",
  aspect = 1,
  cropShape = "round",
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleCropAreaComplete = useCallback((_croppedArea: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleApplyCrop = async () => {
    if (!imageSrc) {
      return;
    }

    try {
      const fallbackCrop: PixelCrop = croppedAreaPixels || {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      };

      const { file, url } = await getCroppedImg(
        imageSrc,
        fallbackCrop,
        rotation,
        fileName,
      );

      await onCropComplete(file, url);
    } catch {
      toast.error("Failed to crop image. Please try again.");
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="max-w-md p-6 sm:rounded-2xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Crop className="h-4 w-4 text-accent" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Cropper Preview Area */}
        <div className="relative mt-2 h-64 w-full overflow-hidden rounded-xl bg-black/90">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={handleCropAreaComplete}
            />
          )}
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />

            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.05}
              onValueChange={(val) => {
                const newZoom = val[0];
                if (typeof newZoom === "number") {
                  setZoom(newZoom);
                }
              }}
              disabled={isProcessing}
              className="flex-1"
            />

            <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              disabled={isProcessing}
              className="h-8 w-8 p-0 shrink-0 cursor-pointer ml-1"
              title="Rotate 90 degrees"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="mt-4 flex gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 h-9 cursor-pointer text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="flex-1 h-9 cursor-pointer bg-accent text-white hover:bg-accent-hover text-xs font-semibold"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Cropping & Uploading...
              </span>
            ) : (
              "Crop & Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
