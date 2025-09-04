import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';

// --- DEACTIVATION CONFIGURATION & CONSTANTS ---
const DEACTIVATION_CONFIG = {
  TITLE: 'Deactivate Your Account',
  WARNING_HEADING: 'Warning: This action is permanent.',
  WARNING_BODY: 'Deactivating your account will result in the loss of all your data, including profile information, saved preferences, and content. This action cannot be undone. Please proceed with caution.',
  PROCEED_BUTTON_TEXT: 'Proceed to Deactivation',
  CONFIRMATION_TEXT_REQUIRED: 'DEACTIVATE',
  MODAL_TITLE: 'Confirm Deactivation',
  REASON_OPTIONS: [
    { value: 'privacy', label: 'Privacy concerns' },
    { value: 'too-complex', label: 'Too complex to use' },
    { value: 'not-needed', label: 'No longer need the service' },
    { value: 'too-expensive', label: 'Too expensive' },
    { value: 'other', label: 'Other (please specify)' },
  ],
  SECURITY_CODE_LENGTH: 4,
  SUCCESS_MESSAGE: 'Your account has been successfully deactivated.',
  ERROR_INVALID_CONFIRM_TEXT: 'Please type "DEACTIVATE" to confirm.',
  ERROR_INVALID_SECURITY_CODE: 'Invalid security code. Please check your email.',
  LOADING_MESSAGE: 'Processing...',
  CANCEL_BUTTON_TEXT: 'Cancel',
  DOWNLOAD_DATA_BUTTON: 'Download My Data',
  REASON_DETAILS_PROMPT: 'Please provide more details about your reason for leaving:',
  ALTERNATIVE_PROMPT: 'What alternative service or product are you considering?',
  LIKED_FEATURES_PROMPT: 'What did you like about our service?',
  DISLIKED_FEATURES_PROMPT: 'What did you dislike or what could we improve?',
};

const LS_DEACTIVATIONS_KEY = 'deactivation_requests';
const LS_USER_ID_KEY = 'current_user_id';
const MOCK_SECURITY_CODE = '1234';

// --- REDUCER STATE MANAGEMENT ---
// This reducer manages the state for the deactivation form and process,
// including loading status, success, errors, and form data.
const deactivationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_SUCCESS':
      return { ...state, loading: false, success: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_FORM_DATA':
      const { field, value } = action.payload;
      return { ...state, formData: { ...state.formData, [field]: value } };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// The initial state for the deactivation reducer.
const initialState = {
  loading: false,
  success: false,
  error: null,
  formData: {
    reason: '',
    feedback: '',
    confirmText: '',
    securityCode: '',
    unsubscribeNewsletter: false,
    rating: 0,
    wouldRecommend: false,
    reasonDetails: '',
    alternative: '',
    likedFeatures: '',
    dislikedFeatures: '',
  },
};

// --- HELPER FUNCTIONS ---
// Generates a unique user ID, persisting it in localStorage to simulate a persistent session.
const getOrCreateUserId = () => {
  let userId = localStorage.getItem(LS_USER_ID_KEY);
  if (!userId) {
    userId = 'user-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(LS_USER_ID_KEY, userId);
  }
  return userId;
};

// Simulates a backend API call with a delay and validation.
const mockDeactivationApi = (data) => {
  return new Promise((resolve, reject) => {
    const delay = 1500;
    setTimeout(() => {
      // Input validation for confirmation text.
      if (data.confirmText !== DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED) {
        reject(DEACTIVATION_CONFIG.ERROR_INVALID_CONFIRM_TEXT);
      }
      // Input validation for the security code.
      else if (data.securityCode !== MOCK_SECURITY_CODE) {
        reject(DEACTIVATION_CONFIG.ERROR_INVALID_SECURITY_CODE);
      } else {
        // Successful API response.
        resolve(DEACTIVATION_CONFIG.SUCCESS_MESSAGE);
      }
    }, delay);
  });
};

// Generates fake deactivation data for the recent deactivations list.
// This function creates a list of mock users with randomized names and deactivation dates.
const generateMockDeactivations = () => {
  const mockUsers = [
    { name: 'Olivia', email: 'olivia.s@example.com' },
    { name: 'Liam', email: 'liam.j@example.com' },
    { name: 'Emma', email: 'emma.c@example.com' },
    { name: 'Noah', email: 'noah.p@example.com' },
    { name: 'Ava', email: 'ava.m@example.com' },
    { name: 'Elijah', email: 'elijah.b@example.com' },
    { name: 'Charlotte', email: 'charlotte.w@example.com' },
    { name: 'James', email: 'james.k@example.com' },
    { name: 'Amelia', email: 'amelia.l@example.com' },
    { name: 'Benjamin', email: 'benjamin.d@example.com' },
    { name: 'Sophia', email: 'sophia.r@example.com' },
    { name: 'Lucas', email: 'lucas.s@example.com' },
    { name: 'Mia', email: 'mia.h@example.com' },
    { name: 'Mason', email: 'mason.g@example.com' },
    { name: 'Isabella', email: 'isabella.a@example.com' },
    { name: 'Ethan', email: 'ethan.q@example.com' },
    { name: 'Harper', email: 'harper.n@example.com' },
    { name: 'Logan', email: 'logan.z@example.com' },
    { name: 'Evelyn', email: 'evelyn.f@example.com' },
    { name: 'Alexander', email: 'alexander.t@example.com' },
  ];

  const now = new Date();
  const deactivations = [];
  for (let i = 0; i < 20; i++) {
    const user = mockUsers[i % mockUsers.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const deactivatedDate = new Date(now.setDate(now.getDate() - daysAgo));
    deactivations.push({
      id: i,
      name: user.name,
      email: user.email,
      deactivatedOn: deactivatedDate.toLocaleDateString(),
    });
  }
  return deactivations;
};

// --- REUSABLE SUB-COMPONENTS ---
// A reusable component for the warning section.
const WarningSection = () => (
  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-inner animate-pulse-fade-in">
    <h2 className="font-semibold text-lg">{DEACTIVATION_CONFIG.WARNING_HEADING}</h2>
    <p className="text-sm mt-2 leading-relaxed">{DEACTIVATION_CONFIG.WARNING_BODY}</p>
  </div>
);

// A card component to display a single user's deactivation.
const UserCard = ({ user }) => (
  <div
    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
  >
    <div className="flex items-center space-x-3 mb-2">
      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center border-2 border-blue-400">
        <span className="font-bold text-blue-700">{user.name.charAt(0)}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">Deactivated on: {user.deactivatedOn}</p>
      </div>
    </div>
    <p className="text-sm text-gray-600 truncate">{user.email}</p>
  </div>
);

// A simple star rating sub-component.
const StarRating = ({ rating, onChange }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-xl focus:outline-none transition-transform transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </button>
    ))}
  </div>
);

// A reusable input field component for the form.
const FormField = ({ id, label, type = 'text', value, onChange, placeholder, isRequired = false, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}{isRequired && <span className="text-red-500">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows="4"
        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        placeholder={placeholder}
      ></textarea>
    ) : type === 'select' ? (
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        maxLength={type === 'text' && id === 'securityCode' ? DEACTIVATION_CONFIG.SECURITY_CODE_LENGTH : undefined}
        className={`mt-1 block w-full px-3 py-2 ${id === 'confirmText' ? 'bg-red-50 border-red-300 font-mono' : 'bg-gray-50 border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
        placeholder={placeholder}
      />
    )}
  </div>
);

// A comprehensive modal for deactivation confirmation and survey.
const ConfirmationModal = ({ isOpen, onClose, onConfirm, state, dispatch }) => {
  if (!isOpen) return null;

  const { loading, error, formData } = state;
  const isFormValid = formData.confirmText === DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED && formData.securityCode === MOCK_SECURITY_CODE && formData.reason !== '' && formData.rating > 0;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-transform duration-300 scale-95 animate-scale-up"
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 id="modal-title" className="text-3xl font-bold text-gray-800">{DEACTIVATION_CONFIG.MODAL_TITLE}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={onConfirm} className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Your Feedback Matters</h3>
          <p className="text-sm text-gray-600">Please help us understand why you are leaving so we can improve our service.</p>

          <FormField
            id="reason"
            label="Reason for leaving:"
            type="select"
            value={formData.reason}
            onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'reason', value: e.target.value } })}
            isRequired
          >
            <option value="">Select a reason</option>
            {DEACTIVATION_CONFIG.REASON_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </FormField>

          {formData.reason === 'other' && (
            <FormField
              id="reasonDetails"
              label={DEACTIVATION_CONFIG.REASON_DETAILS_PROMPT}
              type="textarea"
              value={formData.reasonDetails}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'reasonDetails', value: e.target.value } })}
              placeholder="e.g., I'm moving to a new platform..."
            />
          )}

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mt-4">Quick Survey</h3>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">How would you rate your overall experience? <span className="text-red-500">*</span></span>
              <StarRating
                rating={formData.rating}
                onChange={(newRating) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'rating', value: newRating } })}
              />
            </div>
            
            <FormField
              id="likedFeatures"
              label={DEACTIVATION_CONFIG.LIKED_FEATURES_PROMPT}
              type="textarea"
              value={formData.likedFeatures}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'likedFeatures', value: e.target.value } })}
              placeholder="e.g., I really enjoyed the..."
            />
            
            <FormField
              id="dislikedFeatures"
              label={DEACTIVATION_CONFIG.DISLIKED_FEATURES_PROMPT}
              type="textarea"
              value={formData.dislikedFeatures}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'dislikedFeatures', value: e.target.value } })}
              placeholder="e.g., The user interface could be..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="wouldRecommend"
              name="wouldRecommend"
              type="checkbox"
              checked={formData.wouldRecommend}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'wouldRecommend', value: e.target.checked } })}
              className="h-4 w-4 text-red-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="wouldRecommend" className="ml-2 block text-sm text-gray-900">
              Would you recommend our service to a friend?
            </label>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-800">Security Check</h3>
            <p className="text-sm text-gray-600">To protect your account, please complete this final step.</p>

            <FormField
              id="confirmText"
              label={`Please type "${DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED}" to confirm:`}
              value={formData.confirmText}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'confirmText', value: e.target.value } })}
              placeholder={DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED}
              isRequired
            />
            
            <div>
              <label htmlFor="securityCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Security Code: <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                A 4-digit code (Hint: {MOCK_SECURITY_CODE}) has been sent to your email.
              </p>
              <input
                type="text"
                id="securityCode"
                name="securityCode"
                value={formData.securityCode}
                onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'securityCode', value: e.target.value } })}
                maxLength={DEACTIVATION_CONFIG.SECURITY_CODE_LENGTH}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm font-mono"
                placeholder="e.g., 1234"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 pt-4">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform ${loading || !isFormValid ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 hover:scale-105'} text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>{DEACTIVATION_CONFIG.LOADING_MESSAGE}</span>
                </span>
              ) : (
                'Permanently Deactivate My Account'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105 shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              {DEACTIVATION_CONFIG.CANCEL_BUTTON_TEXT}
            </button>
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 text-center" role="alert"><span className="block sm:inline">{error}</span></div>}
        </form>
      </div>
    </div>
  );
};

// A notification component that slides into view.
const ToastNotification = ({ message, type, isVisible }) => (
  <div
    className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white transition-transform transform ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} z-50 animate-fade-in-slide-up`}
    style={{ transitionProperty: 'transform, opacity' }}
  >
    {message}
  </div>
);

// --- MAIN COMPONENT ---
// This is the main component that renders the entire deactivation page.
const Deactivate = () => {
  const [state, dispatch] = useReducer(deactivationReducer, initialState);
  const { loading, error, formData } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deactivations, setDeactivations] = useState([]);
  const [userId, setUserId] = useState(getOrCreateUserId);
  const toastTimeoutRef = useRef(null);
  
  // This useEffect hook runs once on component mount to load initial data.
  useEffect(() => {
    // Load deactivations from localStorage to simulate persistence.
    const savedDeactivations = JSON.parse(localStorage.getItem(LS_DEACTIVATIONS_KEY) || '[]');
    if (savedDeactivations.length === 0) {
      // If no data, generate a fresh set of mock data.
      setDeactivations(generateMockDeactivations());
    } else {
      setDeactivations(savedDeactivations);
    }
  }, []);

  // A memoized function to show a toast notification.
  const showNotification = useCallback((message, type) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 5000);
  }, []);

  // Handles the data download action.
  const handleDownloadData = () => {
    showNotification('Simulating data download...', 'success');
  };

  // Handles the form submission logic.
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING' });

    try {
      // Simulate API call and validation.
      await mockDeactivationApi(formData);
      
      // Get the current list from localStorage or initialize if it doesn't exist.
      const currentDeactivations = JSON.parse(localStorage.getItem(LS_DEACTIVATIONS_KEY) || '[]');
      
      // Create a new deactivation entry.
      const newDeactivation = {
        id: `local-${currentDeactivations.length + 1}`,
        name: `User ${userId.substring(0, 4)}...`,
        email: 'data not available',
        deactivatedOn: new Date().toLocaleDateString(),
      };
      
      // Add the new entry to the list and save it back to localStorage.
      const updatedDeactivations = [newDeactivation, ...currentDeactivations];
      localStorage.setItem(LS_DEACTIVATIONS_KEY, JSON.stringify(updatedDeactivations));
      
      // Update the component state with the new list.
      setDeactivations(updatedDeactivations);
      
      showNotification('Deactivation request submitted!', 'success');
      setTimeout(() => setIsModalOpen(false), 2000);

    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || err });
      showNotification(err.message || err, 'error');
    }
  };

  // Closes the modal and resets the form state.
  const closeModal = () => {
    setIsModalOpen(false);
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-6 overflow-hidden">
      <style>{`
        /* Custom Keyframe Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }
        @keyframes pulseFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in-slide-up { animation: fadeIn 0.5s ease-out forwards, slideUp 0.5s ease-out forwards; }
        .animate-pulse-fade-in { animation: pulseFadeIn 0.8s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.5s ease-out forwards; }
      `}</style>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold text-red-600 mb-6 text-center animate-fade-in">{DEACTIVATION_CONFIG.TITLE}</h1>
        {userId && <p className="text-center text-sm text-gray-500 mb-4 animate-fade-in-slide-up">Your User ID: <span className="font-mono font-bold text-gray-800 tracking-wide">**{userId}**</span></p>}
        <WarningSection />

        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 animate-fade-in"
          >
            {DEACTIVATION_CONFIG.PROCEED_BUTTON_TEXT}
          </button>
          <button
            onClick={handleDownloadData}
            className="flex-1 w-full mt-4 md:mt-0 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 animate-fade-in"
          >
            {DEACTIVATION_CONFIG.DOWNLOAD_DATA_BUTTON}
          </button>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">Important Information Before You Go</h2>
          <p className="text-gray-600 leading-relaxed">
            Before you deactivate your account, please consider a few key points. All your data, including your public profile and private settings, will be permanently erased. This includes your posts, comments, and any other contributions you have made to the platform.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <span>Account deactivation is different from a temporary suspension. A temporary suspension allows you to return to your account later. Deactivation is final.</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path d="M13 11a1 1 0 000 2h3a1 1 0 100-2h-3zm-6 3a1 1 0 100 2h.01a1 1 0 100-2H7zm0-5a1 1 0 100 2h.01a1 1 0 100-2H7zm0-5a1 1 0 100 2h.01a1 1 0 100-2H7zm9-1a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1z" /><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.93-8.683a1 1 0 01.034-1.442l.06-.058A1 1 0 017 6a1 1 0 011 1v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1z" clipRule="evenodd" /></svg>
              <span>If you have any active subscriptions or services, they will be immediately cancelled, and no refunds will be provided for the remaining period.</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
              <span>Your username will be released and may be available for other users to claim. Any direct messages you have sent to other users will remain in their inboxes.</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h1a3 3 0 003-3 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
              <span>This process is secure and requires you to verify your identity. We strongly advise that you contact support if you have any doubts.</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.93 9.382a1 1 0 00-.814.195l-1.323.957a1 1 0 00-.246 1.341l.926 1.768a1 1 0 001.341.246l1.768-.926a1 1 0 00.246-1.341l-1.768-.926a1 1 0 00-.57-.14zM10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM10 13a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM10 7a1 1 0 00-1 1v1a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>Please ensure you have backed up any data you wish to keep before proceeding. Once your account is gone, there is no way to recover your information.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="space-y-4 animate-fade-in-slide-up">
          <h2 className="text-2xl font-bold text-gray-800">Recent Deactivations (Simulated Live Data)</h2>
          <p className="text-gray-600">This is a simulated list of recent deactivation requests.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deactivations.length > 0 ? (
              deactivations.map(user => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">No deactivations have been logged yet.</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleSubmit}
        state={state}
        dispatch={dispatch}
      />
      
      <ToastNotification
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
      />
    </div>
  );
};

export default Deactivate;
