"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          title: "font-bold text-base",
          // Map status colors for richColors
          success: "group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success",
          error: "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive",
          info: "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground group-[.toaster]:border-primary",
          warning: "group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
