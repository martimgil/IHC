"use client";

import { useTheme } from "../../context/ThemeContext";
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
            "group sonner-toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl p-4 flex gap-3 items-center overflow-hidden w-full",
          description: "group-[.sonner-toast]:text-muted-foreground",
          actionButton:
            "group-[.sonner-toast]:bg-primary group-[.sonner-toast]:text-primary-foreground font-bold",
          cancelButton:
            "group-[.sonner-toast]:bg-muted group-[.sonner-toast]:text-muted-foreground",
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
