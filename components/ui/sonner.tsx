// Global Sonner toaster component configured with vertically middle right close icon positioning and 2000ms duration
"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      closeButton
      duration={2000}
      toastOptions={{
        classNames: {
          toast:
            "group toast !relative group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-3.5 group-[.toaster]:pr-10 group-[.toaster]:items-center",

          description: "group-[.toast]:text-muted-foreground",

          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",

          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          closeButton:
            "!absolute !top-1/2 !-translate-y-1/2 !right-2.5 !left-auto !bottom-auto !bg-transparent !border-0 !text-muted-foreground hover:!text-foreground hover:!bg-muted/50 !rounded-md !p-1 !transition-colors cursor-pointer",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
