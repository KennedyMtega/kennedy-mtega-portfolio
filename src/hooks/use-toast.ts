// This file is replaced with the proper shadcn-ui use-toast hook
import { useState, useEffect, ReactNode } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ReactNode;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((toasts) => toasts.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  function toast(props: ToastActionProps) {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((toasts) => [...toasts, { id, ...props }]);
    return id;
  }

  function dismiss(toastId?: string) {
    if (toastId) {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
    } else {
      setToasts([]);
    }
  }

  return {
    toast,
    dismiss,
    toasts,
  };
}

export const toast = {
  default(props: ToastActionProps) {
    return useToast().toast({ ...props, variant: "default" });
  },
  destructive(props: ToastActionProps) {
    return useToast().toast({ ...props, variant: "destructive" });
  },
};
