import React, { useEffect, useState } from "react";
import "./assets/toast.scss";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <div className={`toast-msg toast-msg--${type}${visible ? " toast-msg--in" : " toast-msg--out"}`}>
      <span className="toast-msg__icon">{icons[type]}</span>
      <span className="toast-msg__text">{message}</span>
    </div>
  );
};

// Global toast manager
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let _setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null;
let _counter = 0;

export function showToast(message: string, type: ToastType = "success") {
  if (_setToasts) {
    const id = ++_counter;
    _setToasts((prev) => [...prev, { id, message, type }]);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  _setToasts = setToasts;

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}
