
import { Toast, toast as showToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

type ToastProps = {
  title?: string;
  description?: string; 
  action?: React.ReactNode;
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
    return showToast({ ...props });
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
  return showToast({ ...props });
};
