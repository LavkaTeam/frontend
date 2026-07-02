import { useSyncExternalStore } from 'react';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastsState: Toast[] = [];
const toastListeners = new Set<() => void>();

const notifyToastListeners = () => {
  toastListeners.forEach((listener) => listener());
};

const subscribeToToasts = (listener: () => void) => {
  toastListeners.add(listener);

  return () => {
    toastListeners.delete(listener);
  };
};

const getToastsSnapshot = () => toastsState;

export const useToast = () => {
  const toasts = useSyncExternalStore(subscribeToToasts, getToastsSnapshot);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    toastsState = [...toastsState, { id, message, type }];
    notifyToastListeners();

    setTimeout(() => {
      toastsState = toastsState.filter((toast) => toast.id !== id);
      notifyToastListeners();
    }, 3000);
  };

  const removeToast = (id: number) => {
    toastsState = toastsState.filter((toast) => toast.id !== id);
    notifyToastListeners();
  };

  return { toasts, showToast, removeToast };
};
