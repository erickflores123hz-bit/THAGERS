'use client';

import React from 'react';
import { useApp } from '../lib/context';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="toast-container" id="toastContainer" style={{ zIndex: 1200 }}>
      <AnimatePresence>
        {toasts.map((toast) => {
          let iconClass = 'fa-solid fa-circle-info';
          if (toast.type === 'success') iconClass = 'fa-solid fa-circle-check';
          if (toast.type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`toast-item toast-${toast.type || 'info'}`}
            >
              <i className={iconClass}></i>
              <span className="toast-message">{toast.message}</span>
              <motion.button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                title="Cerrar notificación"
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
