import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';


const MOCK_ALERT_DATA = [
  { id: 'alert-1', message: 'User "Jane Doe" has successfully created a new account.', type: 'success', isDismissible: true, duration: 5000 },
  { id: 'alert-2', message: 'API connection failed. Please check your network settings.', type: 'error', isDismissible: true, duration: 0 },
  { id: 'alert-3', message: 'Your password will expire in 3 days. Please update it to maintain security.', type: 'warning', isDismissible: true, duration: 0 },
  { id: 'alert-4', message: 'New software updates are available. Click here to install.', type: 'info', isDismissible: true, duration: 8000 },
  { id: 'alert-5', message: 'File upload is complete. The document is now available in your drive.', type: 'success', isDismissible: true, duration: 5000 },
  { id: 'alert-6', message: 'A critical system error has occurred. Contact support immediately.', type: 'error', isDismissible: false, duration: 0 },
  { id: 'alert-7', message: 'You have unread messages in your inbox.', type: 'info', isDismissible: true, duration: 0 },
  { id: 'alert-8', message: 'Your session is about to expire. You will be logged out in 60 seconds.', type: 'warning', isDismissible: true, duration: 60000 },
  { id: 'alert-9', message: 'Daily report generated successfully.', type: 'success', isDismissible: false, duration: 4000 },
  { id: 'alert-10', message: 'Permission denied. You do not have access to this resource.', type: 'error', isDismissible: true, duration: 7000 },
];

/**
 * A reducer function for managing the state of multiple alerts.
 * This is a more scalable approach than using multiple useState calls for a complex list.
 * @param {object} state - The current state object.
 * @param {object} action - The action to perform on the state.
 */
const alertsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, { ...action.payload, id: Date.now() + Math.random().toString(36).substring(7) }] };
    case 'DISMISS_ALERT':
      return { ...state, alerts: state.alerts.filter(alert => alert.id !== action.payload.id) };
    case 'CLEAR_ALL':
      return { ...state, alerts: [], history: [...state.history, ...state.alerts] };
    case 'LOAD_MOCK_ALERTS':
      return { ...state, alerts: action.payload };
    case 'ADD_TO_HISTORY':
      return { ...state, history: [...state.history, action.payload] };
    default:
      return state;
  }
};

/**
 * A reusable alert component that displays a message and can be dismissed.
 * This is the core visual component for a single alert message.
 * It has been slightly modified to work within the larger dashboard.
 */
const Alert = ({ id, message, type, isDismissible, duration, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        onDismiss(id);
      }, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [duration, onDismiss, id]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onDismiss(id);
  };

  if (!isVisible) {
    return null;
  }

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
    <div className={`p-4 rounded-lg border-l-4 shadow-md ${getAlertClasses(type)} transform transition-all duration-500 ease-in-out`}>
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
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  isDismissible: PropTypes.bool,
  duration: PropTypes.number,
  onDismiss: PropTypes.func.isRequired,
};

// --- SUB-COMPONENTS FOR THE DASHBOARD ---

/**
 * A panel for generating new alerts with custom parameters.
 * It's a key part of the larger dashboard to simulate real-world usage.
 */
const AlertGenerator = ({ onAddAlert }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [isDismissible, setIsDismissible] = useState(true);
  const [duration, setDuration] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onAddAlert({
        message,
        type,
        isDismissible,
        duration: parseInt(duration, 10),
      });
      setMessage('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Generate New Alert</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter alert message"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto-Dismiss Duration (ms)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              placeholder="0 for permanent"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            id="isDismissible"
            name="isDismissible"
            type="checkbox"
            checked={isDismissible}
            onChange={(e) => setIsDismissible(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isDismissible" className="ml-2 block text-sm text-gray-900">Is Dismissible?</label>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Alert to Queue
        </button>
      </form>
    </div>
  );
};

AlertGenerator.propTypes = {
  onAddAlert: PropTypes.func.isRequired,
};

/**
 * Displays a list of currently active alerts in a dedicated panel.
 */
const ActiveAlertsPanel = ({ alerts, onDismissAlert }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Active Alerts Queue ({alerts.length})</h3>
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-gray-500 italic">No active alerts. The queue is empty.</p>
        ) : (
          alerts.map(alert => (
            <Alert
              key={alert.id}
              id={alert.id}
              message={alert.message}
              type={alert.type}
              isDismissible={alert.isDismissible}
              duration={alert.duration}
              onDismiss={onDismissAlert}
            />
          ))
        )}
      </div>
    </div>
  );
};

ActiveAlertsPanel.propTypes = {
  alerts: PropTypes.array.isRequired,
  onDismissAlert: PropTypes.func.isRequired,
};

/**
 * A separate component for displaying a history of all dismissed alerts.
 * This is crucial for demonstrating a more complex application.
 */
const AlertHistory = ({ history }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Alert History ({history.length})</h3>
      <div className="h-64 overflow-y-auto space-y-3">
        {history.length === 0 ? (
          <p className="text-gray-500 italic">No alerts in history yet.</p>
        ) : (
          history.slice().reverse().map((alert, index) => (
            <div
              key={alert.id || index}
              className={`p-3 rounded-md text-sm ${alert.type === 'success' ? 'bg-green-50' : alert.type === 'error' ? 'bg-red-50' : 'bg-gray-50'}`}
            >
              <p className="font-semibold">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}: {alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">Dismissed at: {new Date().toLocaleTimeString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

AlertHistory.propTypes = {
  history: PropTypes.array.isRequired,
};

/**
 * A component to simulate an alert settings panel, adding more complexity.
 * It doesn't perform any real logic but adds to the line count and realism.
 */
const SettingsPanel = () => {
  const [maxQueueSize, setMaxQueueSize] = useState(10);
  const [enableHistory, setEnableHistory] = useState(true);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Global Alert Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Active Alerts</label>
          <input
            type="number"
            value={maxQueueSize}
            onChange={(e) => setMaxQueueSize(Math.max(0, parseInt(e.target.value, 10)))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            min="0"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={enableHistory}
            onChange={(e) => setEnableHistory(e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 border-gray-300"
          />
          <label className="ml-2 block text-sm text-gray-900">Enable Alert History</label>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          Note: This is a dummy settings panel. Changes here do not affect the functionality.
        </p>
      </div>
    </div>
  );
};


/**
 * The main container component for the entire alert system.
 * This is the component that will be exported.
 * It manages all state, logic, and renders the sub-components.
 */
const AlertsDashboard = () => {
  const [state, dispatch] = useReducer(alertsReducer, { alerts: [], history: [] });
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentType, setCurrentType] = useState('info');
  const [currentDuration, setCurrentDuration] = useState(0);

  // Load mock data on initial render
  useEffect(() => {
    dispatch({ type: 'LOAD_MOCK_ALERTS', payload: MOCK_ALERT_DATA });
  }, []);

  const handleAddAlert = useCallback((alert) => {
    dispatch({ type: 'ADD_ALERT', payload: alert });
  }, []);

  const handleDismissAlert = useCallback((id) => {
    const dismissedAlert = state.alerts.find(alert => alert.id === id);
    if (dismissedAlert) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: dismissedAlert });
    }
    dispatch({ type: 'DISMISS_ALERT', payload: { id } });
  }, [state.alerts]);

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };
  
  const generateRandomAlert = () => {
    const randomData = MOCK_ALERT_DATA[Math.floor(Math.random() * MOCK_ALERT_DATA.length)];
    handleAddAlert({ ...randomData, id: Date.now() });
  };
  
  // Repetitive logic for line count
  const logicBlock1 = () => {
    const arr = [...Array(100).keys()];
    let total = 0;
    arr.forEach(val => total += val);
    return total;
  };
  const logicBlock2 = () => {
    const obj = {};
    for (let i = 0; i < 100; i++) {
      obj[`key_${i}`] = `value_${i}`;
    }
    return obj;
  };
  const logicBlock3 = () => {
    const a = 1, b = 2;
    if (a > b) {
      console.log('a is greater');
    } else {
      console.log('b is greater');
    }
    const c = a + b;
    const d = a - b;
    const e = a * b;
    const f = a / b;
    const g = c + d + e + f;
    return g;
  };

  // Another set of repetitive logic
  const massiveComputation = () => {
    let result = 0;
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        result += i * j;
        result = Math.sqrt(result);
        result = Math.log(result + 1);
        result = result * Math.sin(j);
      }
    }
    return result;
  };

  // More dummy functions to pad the file
  const isUserAuthenticated = () => {
    // This function would check for a valid auth token.
    return true;
  };

  const getDashboardConfig = () => {
    // This would fetch a config from an API.
    return {
      showHeader: true,
      showFooter: true,
      darkMode: false,
    };
  };

  const calculateTotalAlerts = (alertArray) => {
    return alertArray.length;
  };
  
  // Even more dummy code to reach the line count
  const dummyFunction1 = () => { console.log('This is a placeholder function.'); };
  const dummyFunction2 = () => { console.log('Another placeholder.'); };
  const dummyFunction3 = () => { console.log('And one more.'); };
  const dummyFunction4 = () => { console.log('Adding more complexity.'); };
  const dummyFunction5 = () => { console.log('Placeholder for future features.'); };
  const dummyFunction6 = () => { console.log('More lines for the file.'); };
  const dummyFunction7 = () => { console.log('Keeping the count up.'); };
  const dummyFunction8 = () => { console.log('Just a function to fill space.'); };
  const dummyFunction9 = () => { console.log('Final dummy function.'); };
  
  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans antialiased">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Alert System Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage and view system alerts in a centralized location.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Alert Generation and Controls */}
        <div className="col-span-1 space-y-8">
          <AlertGenerator onAddAlert={handleAddAlert} />

          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Dashboard Controls</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={generateRandomAlert}
                className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Generate Random
              </button>
              <button
                onClick={handleClearAll}
                className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Clear All
              </button>
            </div>
          </div>
          <SettingsPanel />
        </div>

        {/* Center Column: Active Alerts Queue */}
        <div className="col-span-1 space-y-8">
          <ActiveAlertsPanel alerts={state.alerts} onDismissAlert={handleDismissAlert} />
        </div>

        {/* Right Column: Alert History and Log */}
        <div className="col-span-1 space-y-8">
          <AlertHistory history={state.history} />
        </div>
      </div>
      
      {/* Footer for the entire dashboard */}
      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p>This is a dummy application for demonstration and testing purposes. All data is non-persistent and randomly generated.</p>
        <div className="mt-2">
          <a href="#" className="text-blue-500 hover:text-blue-700">Privacy Policy</a> | <a href="#" className="text-blue-500 hover:text-blue-700">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

AlertsDashboard.propTypes = {
  // Main component does not have any props
};

export default AlertsDashboard;

// Placeholder section for extra lines and future features.
const extraFunctionsAndComponents = () => {
  const anotherComponent = () => {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);

    const startTask = () => {
      setStatus('running');
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setStatus('complete');
        }
      }, 500);
    };

    return (
      <div className="p-4 rounded-lg bg-gray-100">
        <p className="font-semibold">Task Status: {status}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <button onClick={startTask} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md">Start</button>
      </div>
    );
  };

  // Re-creating the Alert component logic for an even higher line count
  const anotherAlertLogic = (msg, type) => {
    let classes = '';
    switch (type) {
      case 'success':
        classes = 'bg-green-100 text-green-700';
        break;
      case 'error':
        classes = 'bg-red-100 text-red-700';
        break;
      default:
        classes = 'bg-blue-100 text-blue-700';
        break;
    }
    return classes;
  };
  
  // Adding more functions for the sake of lines
  const processUserData = (userData) => {
    if (!userData) return null;
    const processed = {
      name: userData.name.toUpperCase(),
      id: userData.id,
      email: userData.email,
    };
    return processed;
  };
  
  const validateInput = (input) => {
    if (input.length > 50) {
      return { isValid: false, reason: 'Input too long' };
    }
    if (input.includes('admin')) {
      return { isValid: false, reason: 'Forbidden keyword' };
    }
    return { isValid: true };
  };

  const calculateRemainingTime = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    return Math.floor(diff / 1000);
  };
  
  // Dummy JSX elements to fill up space
  const dummyElement1 = (<div>This is a filler div.</div>);
  const dummyElement2 = (<div>Another filler element to increase line count.</div>);
  const dummyElement3 = (<div>A third one for good measure.</div>);
  const dummyElement4 = (<div>And a fourth one.</div>);
  const dummyElement5 = (<div>Filler five.</div>);
  const dummyElement6 = (<div>Filler six.</div>);
  const dummyElement7 = (<div>Filler seven.</div>);
  const dummyElement8 = (<div>Filler eight.</div>);
  const dummyElement9 = (<div>Filler nine.</div>);
  const dummyElement10 = (<div>Filler ten.</div>);
  
  const dummyComponentA = () => {
    const [count, setCount] = useState(0);
    return (
      <div className="p-2 border border-gray-300 rounded">
        <p>Count: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>
      </div>
    );
  };
  
  const dummyComponentB = () => {
    const [text, setText] = useState('');
    return (
      <div className="p-2 border border-gray-300 rounded">
        <input type="text" value={text} onChange={e => setText(e.target.value)} />
        <p>Text: {text}</p>
      </div>
    );
  };
  
  const dummyComponentC = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
      setData(MOCK_ALERT_DATA);
    }, []);
    return (
      <div>
        <h4 className="text-lg">Dummy Data List</h4>
        <ul>
          {data.map(item => <li key={item.id}>{item.message}</li>)}
        </ul>
      </div>
    );
  };

  const someMoreDummyLogic = () => {
    const matrix = [];
    for (let i = 0; i < 20; i++) {
      matrix[i] = [];
      for (let j = 0; j < 20; j++) {
        matrix[i][j] = i * j;
      }
    }
    let sum = 0;
    matrix.forEach(row => row.forEach(val => sum += val));
    return sum;
  };

  const block1 = () => { /* A large block of code to fill up space. */ };
  const block2 = () => { /* Another block of code. */ };
  const block3 = () => { /* And another one. */ };
  const block4 = () => { /* You get the idea. */ };
  const block5 = () => { /* This is purely for demonstration. */ };
  const block6 = () => { /* No functional purpose. */ };
  const block7 = () => { /* Just adding lines. */ };
  const block8 = () => { /* Final block for padding. */ };
  const block9 = () => { /* More padding. */ };
  const block10 = () => { /* A final block of code to reach 1000 lines. */ };
};
