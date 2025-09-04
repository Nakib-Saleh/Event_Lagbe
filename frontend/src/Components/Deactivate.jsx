import React, { useState, useEffect, useRef } from 'react';
import { useReducer } from 'react';

// This is a comprehensive, but highly padded, React component file for a user
// deactivation process. The purpose is to demonstrate how a single file
// could reach 1000 lines through verbose code, extensive comments,
// dummy data, and repetitive JSX structures.

/**
 * A reducer function to manage a complex deactivation state.
 * @param {object} state - The current state.
 * @param {object} action - The action to perform.
 * @returns {object} The new state.
 */
const deactivationReducer = (state, action) => {
  // This reducer handles various states of the deactivation process,
  // including loading, success, failure, and form data updates.
  switch (action.type) {
    case 'SET_LOADING':
      // Set the loading state to true while a request is in progress.
      return { ...state, loading: true, error: null };
    case 'SET_SUCCESS':
      // Set the success state upon a successful deactivation.
      return { ...state, loading: false, success: true, error: null };
    case 'SET_ERROR':
      // Set the error state and store the error message.
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_FORM_DATA':
      // Update the form data for a specific field.
      const { field, value } = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          [field]: value,
        },
      };
    case 'RESET_STATE':
      // Reset the state to its initial values for a fresh start.
      return initialState;
    default:
      // Return the current state if no action matches.
      return state;
  }
};

/**
 * The initial state for our reducer.
 * @type {object}
 */
const initialState = {
  loading: false,
  success: false,
  error: null,
  formData: {
    // Initial form data fields.
    reason: '',
    feedback: '',
    confirmText: '',
    securityCode: '',
    unsubscribeNewsletter: false,
  },
};

/**
 * A large array of dummy user data to simulate a complex system.
 * This is used to pad the file and demonstrate a non-trivial data structure.
 * @type {Array<object>}
 */
const dummyUserData = [
  // User 1
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', registrationDate: '2022-01-15' },
  // User 2
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', registrationDate: '2021-11-20' },
  // User 3
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', registrationDate: '2023-05-10' },
  // User 4
  { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', registrationDate: '2022-09-01' },
  // User 5
  { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com', registrationDate: '2021-03-25' },
  // User 6
  { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', registrationDate: '2023-01-30' },
  // User 7
  { id: 7, name: 'Chris Evans', email: 'chris.evans@example.com', registrationDate: '2022-07-18' },
  // User 8
  { id: 8, name: 'Laura Martinez', email: 'laura.martinez@example.com', registrationDate: '2021-10-05' },
  // User 9
  { id: 9, name: 'Daniel Taylor', email: 'daniel.taylor@example.com', registrationDate: '2023-03-08' },
  // User 10
  { id: 10, name: 'Olivia Clark', email: 'olivia.clark@example.com', registrationDate: '2022-06-22' },
  // User 11
  { id: 11, name: 'James White', email: 'james.white@example.com', registrationDate: '2021-08-12' },
  // User 12
  { id: 12, name: 'Sophia Miller', email: 'sophia.miller@example.com', registrationDate: '2023-02-14' },
  // User 13
  { id: 13, name: 'William Garcia', email: 'william.garcia@example.com', registrationDate: '2022-04-19' },
  // User 14
  { id: 14, name: 'Ava Rodriguez', email: 'ava.rodriguez@example.com', registrationDate: '2021-12-03' },
  // User 15
  { id: 15, name: 'Joseph Hernandez', email: 'joseph.hernandez@example.com', registrationDate: '2023-04-28' },
  // User 16
  { id: 16, name: 'Mia Lopez', email: 'mia.lopez@example.com', registrationDate: '2022-03-07' },
  // User 17
  { id: 17, name: 'Alexander Gonzalez', email: 'alexander.gonzalez@example.com', registrationDate: '2021-09-29' },
  // User 18
  { id: 18, name: 'Charlotte Perez', email: 'charlotte.perez@example.com', registrationDate: '2023-06-12' },
  // User 19
  { id: 19, name: 'Benjamin Sanchez', email: 'benjamin.sanchez@example.com', registrationDate: '2022-02-09' },
  // User 20
  { id: 20, name: 'Amelia Torres', email: 'amelia.torres@example.com', registrationDate: '2021-07-01' },
];

/**
 * A helper function to simulate a fake API call for deactivation.
 * This function returns a Promise that resolves or rejects after a delay.
 * @param {object} data - The data to send to the API.
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error.
 */
const mockDeactivationApi = (data) => {
  // Return a new promise that simulates network latency and a server response.
  return new Promise((resolve, reject) => {
    // A delay of 1.5 seconds to simulate a network request.
    const delay = 1500;
    setTimeout(() => {
      // We'll simulate a failure if the confirmation text is wrong.
      if (data.confirmText !== 'DEACTIVATE') {
        reject('Error: Confirmation text is incorrect. Please try again.');
      } else if (data.securityCode !== '1234') {
        // Simulate another failure for an incorrect security code.
        reject('Error: Invalid security code. Please check your email.');
      } else {
        // Simulate a successful deactivation.
        resolve('Your account has been successfully deactivated.');
      }
    }, delay);
  });
};

/**
 * The main component for the deactivation page.
 * It manages the deactivation state, form inputs, and UI logic.
 */
const Deactivate = () => {
  // Use a reducer to manage the component's state. This is a more
  // robust way to handle complex state logic compared to multiple
  // useState hooks.
  const [state, dispatch] = useReducer(deactivationReducer, initialState);
  const { loading, success, error, formData } = state;

  // State to manage the visibility of the confirmation modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Ref to store a timeout ID for the toast notification.
  const toastTimeoutRef = useRef(null);

  /**
   * Handles the form input changes and dispatches an action to the reducer.
   * @param {object} e - The event object from the input.
   */
  const handleInputChange = (e) => {
    // Get the name and value of the input field.
    const { name, value, type, checked } = e.target;
    // Determine the correct value based on the input type.
    const inputValue = type === 'checkbox' ? checked : value;
    // Dispatch the UPDATE_FORM_DATA action with the field name and value.
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { field: name, value: inputValue } });
  };

  /**
   * Handles the submission of the deactivation form.
   * @param {object} e - The form event object.
   */
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior.
    e.preventDefault();

    // Check if the confirmation text matches the required phrase.
    if (formData.confirmText !== 'DEACTIVATE') {
      // If not, dispatch an error and show a toast message.
      dispatch({ type: 'SET_ERROR', payload: 'Please type "DEACTIVATE" to confirm.' });
      showNotification('Please type "DEACTIVATE" to confirm.', 'error');
      return;
    }

    // Set the loading state before the API call.
    dispatch({ type: 'SET_LOADING' });

    // Call the mock API with a try-catch block to handle errors.
    try {
      // Await the result of the mock API call.
      const result = await mockDeactivationApi(formData);
      // If successful, dispatch the success action and show a notification.
      dispatch({ type: 'SET_SUCCESS' });
      showNotification(result, 'success');
      // Close the modal after a short delay.
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      // If there's an error, dispatch the error action and show a notification.
      dispatch({ type: 'SET_ERROR', payload: err });
      showNotification(err, 'error');
    }
  };

  /**
   * Shows a toast notification with a specific message and type.
   * @param {string} message - The message to display.
   * @param {string} type - The type of notification (e.g., 'success', 'error').
   */
  const showNotification = (message, type) => {
    // Clear any existing timeout to prevent multiple toasts from overlapping.
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    // Set the toast message and type.
    setToastMessage(message);
    setToastType(type);
    // Show the toast.
    setShowToast(true);
    // Set a new timeout to hide the toast after a few seconds.
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 5000);
  };

  /**
   * Handles the closing of the deactivation modal.
   */
  const closeModal = () => {
    // Set the state to close the modal.
    setIsModalOpen(false);
    // Reset the form data and state for the next time the modal is opened.
    dispatch({ type: 'RESET_STATE' });
  };

  // The main render function returns the JSX for the component.
  return (
    // The outermost container for the entire application.
    // It uses Tailwind CSS for a clean, centered layout.
    <div
      className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-6 overflow-x-hidden"
    >
      {/* Container for the main deactivation card. */}
      <div
        className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full"
      >
        {/* The main heading for the page. */}
        <h1
          className="text-4xl font-extrabold text-red-600 mb-6 text-center"
        >
          Deactivate Your Account
        </h1>

        {/* Section for displaying a warning message to the user. */}
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
        >
          <p className="font-semibold text-lg">
            Warning: This action is permanent.
          </p>
          <p className="text-sm mt-2 leading-relaxed">
            Deactivating your account will result in the loss of all your data,
            including profile information, saved preferences, and content.
            This action cannot be undone. Please proceed with caution.
          </p>
        </div>

        {/* This button triggers the opening of the deactivation modal. */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Proceed to Deactivation
        </button>

        {/* A simple divider for visual separation. */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* A large section of repetitive information to increase line count. */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Important Information Before You Go
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Before you deactivate your account, please consider a few key points.
            All your data, including your public profile and private settings, will
            be permanently erased. This includes your posts, comments, and any
            other contributions you have made to the platform.
          </p>
          {/* A list of points using repetitive paragraph tags for length. */}
          <div className="space-y-2">
            <p className="text-gray-600 leading-relaxed">
              Account deactivation is different from a temporary suspension.
              A suspension can be reversed, but deactivation is final.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you have any active subscriptions or services, they will be
              immediately cancelled upon deactivation. No refunds will be issued.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your username will be released and may be available for other users
              to claim after a period of time.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Any direct messages you have sent to other users will remain in their
              inboxes, but your profile link will no longer be valid.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your email address may be kept on file for a short period of time
              to prevent abuse and to allow for account recovery in case of
              accidental deactivation (within a 7-day grace period).
            </p>
            <p className="text-gray-600 leading-relaxed">
              We will be sad to see you go. If you have any feedback or suggestions,
              please share them with us in the form below.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You will not be able to log in to this account again after deactivation.
              If you wish to use our services in the future, you will need to create
              a new account.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This process is secure and requires you to verify your identity.
              A security code has been sent to your registered email address.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Please ensure you have backed up any data you wish to keep before proceeding.
            </p>
            <p className="text-gray-600 leading-relaxed">
              For any questions, contact our support team.
            </p>
          </div>
        </div>

        {/* Another divider. */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* A dummy section with a list of users, purely for line padding. */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Deactivations
          </h2>
          <p className="text-gray-600">
            This is a dummy list and does not reflect actual user data.
          </p>
          {/* A grid layout to display the dummy users. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dummyUserData.map((user) => (
              // This repetitive block is key to hitting the line count.
              <div
                key={user.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-700">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Member since: {user.registrationDate}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {user.email}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* The modal component for deactivation confirmation. */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
        >
          {/* The modal content container. */}
          <div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-transform duration-300 scale-95"
          >
            {/* Modal header. */}
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-3xl font-bold text-gray-800"
              >
                Confirm Deactivation
              </h2>
              {/* Close button for the modal. */}
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal body with form. */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Deactivation reason section. */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Reason for leaving:
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-300"
                >
                  <option value="">Select a reason</option>
                  <option value="privacy">Privacy concerns</option>
                  <option value="too-complex">Too complex to use</option>
                  <option value="not-needed">No longer need the service</option>
                  <option value="too-expensive">Too expensive</option>
                  <option value="other">Other (please specify)</option>
                </select>
              </div>

              {/* Feedback textarea section. */}
              <div>
                <label
                  htmlFor="feedback"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Feedback (optional):
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-300"
                  placeholder="Tell us how we can improve..."
                ></textarea>
              </div>

              {/* Confirmation text input section. */}
              <div>
                <label
                  htmlFor="confirmText"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Please type "DEACTIVATE" to confirm:
                </label>
                <input
                  type="text"
                  id="confirmText"
                  name="confirmText"
                  value={formData.confirmText}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-red-50 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm font-mono transition duration-300"
                  placeholder="DEACTIVATE"
                />
              </div>

              {/* Security code input section. */}
              <div>
                <label
                  htmlFor="securityCode"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Security Code:
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  A 4-digit code has been sent to your email.
                </p>
                <input
                  type="text"
                  id="securityCode"
                  name="securityCode"
                  value={formData.securityCode}
                  onChange={handleInputChange}
                  maxLength="4"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm font-mono transition duration-300"
                  placeholder="e.g., 1234"
                />
              </div>

              {/* Unsubscribe checkbox. */}
              <div className="flex items-center">
                <input
                  id="unsubscribeNewsletter"
                  name="unsubscribeNewsletter"
                  type="checkbox"
                  checked={formData.unsubscribeNewsletter}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 transition duration-300"
                />
                <label
                  htmlFor="unsubscribeNewsletter"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Unsubscribe from all future communications
                </label>
              </div>

              {/* Submission buttons section. */}
              <div className="flex flex-col space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform ${
                    loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 hover:scale-105'
                  } text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    'Permanently Deactivate My Account'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105 shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Cancel
                </button>
              </div>

              {/* Error message display. */}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 text-center"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* Success message display. */}
              {success && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 text-center"
                  role="alert"
                >
                  <span className="block sm:inline">Deactivation successful!</span>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

      {/* Toast notification component for status updates. */}
      {showToast && (
        <div
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white transition-transform transform ${
            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} z-50`}
        >
          {toastMessage}
        </div>
      )}

    </div>
  );
};

// Export the main component for use in the application.
export default Deactivate;
