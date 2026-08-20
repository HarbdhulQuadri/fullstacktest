import { toast } from 'react-hot-toast';

type ToastType = 'success' | 'error';

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

/**
 * Thin wrapper so existing call sites keep using `useToast().notify(...)`
 * while the underlying implementation is react-hot-toast (slick sliding
 * notifications for create/update/delete and exports).
 */
export function useToast(): ToastContextValue {
  return {
    notify: (message: string, type: ToastType = 'success') => {
      if (type === 'error') toast.error(message);
      else toast.success(message);
    },
  };
}
