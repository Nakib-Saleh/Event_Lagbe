import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable alert component that displays a message and can be dismissed.
 * The component supports different types of alerts (success, error, warning, info)
 * and can be automatically dismissed after a set duration.
 */
const Alert = ({ message, type, isDismissible, duration }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Effect to automatically dismiss the alert after the duration.
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  // Handle manual dismissal
  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Do not render if not visible
  if (!isVisible) {
    return null;
  }

  // Determine the CSS classes based on the alert type
  const getAlertClasses = (alertType) => {
    switch (alertType) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  // Determine the icon based on the alert type
  const getIcon = (alertType) => {
    switch (alertType) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.332a.5.5 0 01.464-.092l8.5 4.5a.5.5 0 010 .916l-8.5 4.5a.5.5 0 01-.464-.092A.5.5 0 018 12.5V8a.5.5 0 01.257-.424z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 2a1 1 0 100 2h.5a1 1 0 11-1 1v2a1 1 0 11-2 0v-2.5a2.5 2.5 0 012.5-2.5H10z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-l-4 shadow-md ${getAlertClasses(type)}`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          {getIcon(type)}
        </div>
        <div className="flex-1">
          <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p className="text-sm">{message}</p>
        </div>
        {isDismissible && (
          <div className="ml-auto">
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  isDismissible: PropTypes.bool,
  duration: PropTypes.number,
};

Alert.defaultProps = {
  type: 'info',
  isDismissible: true,
  duration: 0, // 0 means it will not auto-dismiss
};

export default Alert;
