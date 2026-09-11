import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon toast-icon-success" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon toast-icon-error" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon toast-icon-warning" />;
      case 'info':
      default:
        return <Info size={18} className="toast-icon toast-icon-info" />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`toast-item glass-card toast-${item.type} fade-in-slide`}
          role="alert"
        >
          <div className="toast-content">
            {getIcon(item.type)}
            <span className="toast-message">{item.message}</span>
          </div>

          <button
            onClick={() => removeToast(item.id)}
            className="toast-close-btn"
            title="Dismiss notification"
            type="button"
          >
            <X size={14} />
          </button>

          {item.duration > 0 && (
            <div
              className={`toast-progress toast-progress-${item.type}`}
              style={{ animationDuration: `${item.duration}ms` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
