'use client';

import React from 'react';
import { useApp } from '../lib/context';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast) => {
        let iconClass = 'fa-solid fa-circle-info';
        if (toast.type === 'success') iconClass = 'fa-solid fa-circle-check';
        if (toast.type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

        return (
          <div key={toast.id} className={`toast-item toast-${toast.type || 'info'}`}>
            <i className={iconClass}></i>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              title="Cerrar notificación"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
}
