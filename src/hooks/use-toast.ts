import { toast } from "sonner";
import React from "react";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const success = ({ title, description, duration = 3000 }: ToastOptions = {}) => {
    toast.success(
      React.createElement("div", null, [
        title && React.createElement("p", { className: "font-semibold" }, title),
        description && React.createElement("p", { className: "text-sm opacity-90" }, description),
      ]),
      { duration }
    );
  };

  const error = ({ title, description, duration = 4000 }: ToastOptions = {}) => {
    toast.error(
      React.createElement("div", null, [
        title && React.createElement("p", { className: "font-semibold" }, title),
        description && React.createElement("p", { className: "text-sm opacity-90" }, description),
      ]),
      { duration }
    );
  };

  const loading = ({ title, description }: ToastOptions = {}) => {
    return toast.loading(
      React.createElement("div", null, [
        title && React.createElement("p", { className: "font-semibold" }, title),
        description && React.createElement("p", { className: "text-sm opacity-90" }, description),
      ])
    );
  };

  const dismiss = (toastId: string) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    loading,
    dismiss,
  };
} 