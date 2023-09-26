import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as loadingJson from "../public/lottie/loading.json";
import Lottie from "react-lottie";
import { scrapeData } from "./generateMails";
import { useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { EmailConfig, addToEmails } from "../redux/slices/steps";
import { Toast, AppearanceType, ToastProps } from "../components/Toast";

const ToastContext = React.createContext({
  addToast: (config: ToastProps) => {},
  removeToast: (index: number) => {},
});

const MAX_LENGHT = 3;

export function ToastProvider({ children }) {
  const [toastStack, setToastStack] = useState<ToastProps[]>([]);

  const addToast = (s: ToastProps) => {
    const id = Date.now();
    let newToast = { ...s, id };
    setToastStack((prevToasts) =>
      [newToast, ...prevToasts].slice(0, MAX_LENGHT)
    );
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToastStack((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== id)
    );
  };

  const value = React.useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast__toasts-container">
        {toastStack.map((i) => (
          <Toast {...i} dismiss={() => removeToast(i.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);
