
import { type ToastProps, ToastActionElement } from "@/components/ui/toast";
import { useState, useEffect, useRef, useCallback } from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

type ToastState = Toast[];

export function useToast() {
  const [toasts, setToasts] = useState<ToastState>([]);
  const toastsRef = useRef<ToastState>([]);
  
  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const toast = useCallback(({ ...props }: ToastProps) => {
    const id = crypto.randomUUID();
    const newToast = { ...props, id } as Toast;
    
    setToasts((toasts) => [...toasts, newToast] as ToastState);
    return newToast;
  }, []);

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      setToasts((toasts) => {
        if (toastId) {
          return toasts.filter((toast) => toast.id !== toastId);
        }
        return [];
      });
    },
  };
}

export const toast = ({ ...props }: ToastProps) => {
  const id = crypto.randomUUID();
  const newToast = { ...props, id } as Toast;
  // This is used directly, not via the hook, so we need to manually update the toast state
  // Instead of setting state, we return the toast object so it can be used by components
  return newToast;
};
