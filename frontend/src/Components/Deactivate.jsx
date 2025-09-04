import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';

// Global variables for Firebase configuration provided by the Canvas environment.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- DEACTIVATION CONFIGURATION ---
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
  ERROR_INVALID_CONFIRM_TEXT: `Please type "${'DEACTIVATE'}" to confirm.`,
  ERROR_INVALID_SECURITY_CODE: 'Invalid security code. Please check your email.',
  LOADING_MESSAGE: 'Processing...',
  CANCEL_BUTTON_TEXT: 'Cancel',
  DOWNLOAD_DATA_BUTTON: 'Download My Data',
};

// --- REDUCER STATE MANAGEMENT ---
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
  },
};

// --- FAKE API CALL FUNCTION (REPLACED BY FIRESTORE LOGIC) ---
const mockDeactivationApi = (data) => {
  return new Promise((resolve, reject) => {
    const delay = 1500;
    setTimeout(() => {
      if (data.confirmText !== DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED) {
        reject(DEACTIVATION_CONFIG.ERROR_INVALID_CONFIRM_TEXT);
      } else if (data.securityCode !== '1234') {
        reject(DEACTIVATION_CONFIG.ERROR_INVALID_SECURITY_CODE);
      } else {
        resolve(DEACTIVATION_CONFIG.SUCCESS_MESSAGE);
      }
    }, delay);
  });
};

// --- REUSABLE SUB-COMPONENTS ---
const WarningSection = () => (
  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
    <h2 className="font-semibold text-lg">{DEACTIVATION_CONFIG.WARNING_HEADING}</h2>
    <p className="text-sm mt-2 leading-relaxed">{DEACTIVATION_CONFIG.WARNING_BODY}</p>
  </div>
);

const UserCard = ({ user }) => (
  <div
    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex items-center space-x-3 mb-2">
      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, state, dispatch }) => {
  if (!isOpen) return null;

  const { loading, error, success, formData } = state;
  const isFormValid = formData.confirmText === DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED && formData.securityCode.length === DEACTIVATION_CONFIG.SECURITY_CODE_LENGTH;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-transform duration-300 scale-95"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-3xl font-bold text-gray-800">{DEACTIVATION_CONFIG.MODAL_TITLE}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={onConfirm} className="space-y-6">
          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">Reason for leaving:</label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'reason', value: e.target.value } })}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              aria-describedby="reason-description"
            >
              <option value="">Select a reason</option>
              {DEACTIVATION_CONFIG.REASON_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span id="reason-description" className="sr-only">Select your reason for deactivation.</span>
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">Feedback (optional):</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'feedback', value: e.target.value } })}
              rows="4"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Tell us how we can improve..."
              aria-describedby="feedback-description"
            ></textarea>
            <span id="feedback-description" className="sr-only">Provide optional feedback on your experience.</span>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mt-4">Quick Survey</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">How would you rate your overall experience?</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'rating', value: star } })}
                  className={`text-xl focus:outline-none transition-transform transform hover:scale-110 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
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
          </div>

          <div>
            <label htmlFor="confirmText" className="block text-sm font-semibold text-gray-700 mb-2">Please type "<span className="text-red-500 font-bold">{DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED}</span>" to confirm:</label>
            <input
              type="text"
              id="confirmText"
              name="confirmText"
              value={formData.confirmText}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'confirmText', value: e.target.value } })}
              className="mt-1 block w-full px-3 py-2 bg-red-50 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm font-mono"
              placeholder={DEACTIVATION_CONFIG.CONFIRMATION_TEXT_REQUIRED}
              aria-describedby="confirm-text-description"
            />
            <span id="confirm-text-description" className="sr-only">Type the exact confirmation text to proceed.</span>
          </div>

          <div>
            <label htmlFor="securityCode" className="block text-sm font-semibold text-gray-700 mb-2">Security Code:</label>
            <p className="text-xs text-gray-500 mb-2">A 4-digit code has been sent to your email.</p>
            <input
              type="text"
              id="securityCode"
              name="securityCode"
              value={formData.securityCode}
              onChange={(e) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: 'securityCode', value: e.target.value } })}
              maxLength={DEACTIVATION_CONFIG.SECURITY_CODE_LENGTH}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm font-mono"
              placeholder="e.g., 1234"
              aria-describedby="security-code-description"
            />
            <span id="security-code-description" className="sr-only">Enter the 4 digit security code.</span>
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

const ToastNotification = ({ message, type, isVisible }) => (
  <div
    className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white transition-transform transform ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} z-50`}
    style={{ transitionProperty: 'transform, opacity' }}
  >
    {message}
  </div>
);

// --- MAIN COMPONENT ---
const Deactivate = () => {
  const [state, dispatch] = useReducer(deactivationReducer, initialState);
  const { loading, success, error, formData } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deactivations, setDeactivations] = useState([]);
  const [userId, setUserId] = useState(null);
  const toastTimeoutRef = useRef(null);

  // --- FIREBASE INITIALIZATION AND REAL-TIME LISTENER ---
  useEffect(() => {
    let unsubscribe;
    const signInUser = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth error:", error);
      }
    };
    
    signInUser();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Set up real-time listener for deactivation requests
        const q = query(collection(db, `/artifacts/${appId}/public/data/deactivations`));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedDeactivations = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Sanitize and parse data from Firestore
            try {
              const parsedData = JSON.parse(data.payload);
              fetchedDeactivations.push({
                id: doc.id,
                name: `User ${parsedData.userId.substring(0, 4)}...`,
                email: 'data not available',
                deactivatedOn: new Date(data.timestamp?.toMillis()).toLocaleDateString(),
              });
            } catch (e) {
              console.error("Failed to parse Firestore document:", e);
            }
          });
          setDeactivations(fetchedDeactivations);
        }, (error) => {
          console.error("Error fetching Firestore data:", error);
        });
      } else {
        setUserId(null);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

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

  const handleDownloadData = () => {
    showNotification('Simulating data download...', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING' });

    try {
      // Simulate API call and validation
      await mockDeactivationApi(formData);
      
      // Save data to Firestore as a deactivation request
      const docRef = await addDoc(collection(db, `/artifacts/${appId}/public/data/deactivations`), {
        userId: userId,
        timestamp: serverTimestamp(),
        payload: JSON.stringify(formData), // Sanitize and save data
      });
      console.log("Deactivation submitted with ID: ", docRef.id);
      
      dispatch({ type: 'SET_SUCCESS' });
      showNotification('Deactivation request submitted!', 'success');
      setTimeout(() => setIsModalOpen(false), 2000);

    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || err });
      showNotification(err.message || err, 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold text-red-600 mb-6 text-center">{DEACTIVATION_CONFIG.TITLE}</h1>
        {userId && <p className="text-center text-sm text-gray-500 mb-4">Your User ID: **{userId}**</p>}
        <WarningSection />

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          {DEACTIVATION_CONFIG.PROCEED_BUTTON_TEXT}
        </button>

        <button
          onClick={handleDownloadData}
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          {DEACTIVATION_CONFIG.DOWNLOAD_DATA_BUTTON}
        </button>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Important Information Before You Go</h2>
          <p className="text-gray-600 leading-relaxed">
            Before you deactivate your account, please consider a few key points.
            All your data, including your public profile and private settings, will
            be permanently erased. This includes your posts, comments, and any
            other contributions you have made to the platform.
          </p>
          <div className="space-y-2">
            <p className="text-gray-600 leading-relaxed">Account deactivation is different from a temporary suspension.</p>
            <p className="text-gray-600 leading-relaxed">If you have any active subscriptions or services, they will be immediately cancelled.</p>
            <p className="text-gray-600 leading-relaxed">Your username will be released and may be available for other users to claim.</p>
            <p className="text-gray-600 leading-relaxed">Any direct messages you have sent to other users will remain in their inboxes.</p>
            <p className="text-gray-600 leading-relaxed">This process is secure and requires you to verify your identity.</p>
            <p className="text-gray-600 leading-relaxed">Please ensure you have backed up any data you wish to keep before proceeding.</p>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Deactivations (Live Data)</h2>
          <p className="text-gray-600">This is a live list of recent deactivation requests.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deactivations.length > 0 ? (
              deactivations.map(user => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p className="text-gray-500">No deactivations have been logged yet.</p>
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
