import React, { useState } from "react";
import { FiClock, FiPlay, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/api";

const DeactivateExpiredEvents = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const handleTriggerTask = async () => {
    setIsRunning(true);
    
    try {
      const response = await axios.post(
        //"http://localhost:2038/api/scheduled-tasks/deactivate-expired-events"
        API_ENDPOINTS.DEACTIVATE_EXPIRED_EVENTS
      );

      if (response.data.success) {
        toast.success("✅ Task triggered successfully! Check console logs for details.");
        setLastRun(new Date());
      } else {
        toast.error("❌ Failed to trigger task: " + response.data.message);
      }
    } catch (error) {
      console.error("Error triggering task:", error);
      const errorMessage = error.response?.data?.message || "Failed to trigger task";
      toast.error("❌ Error: " + errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <FiClock className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Deactivate Expired Events</h2>
            <p className="text-gray-600">Manually trigger the scheduled task to deactivate events with expired timeslots</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="max-w-2xl mx-auto">
    
          {/* Manual Trigger Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPlay className="text-white text-2xl" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Manual Task Trigger
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Click the button below to manually run the deactivation task. 
                This is useful for testing or immediate processing.
              </p>

              {/* Trigger Button */}
              <button
                onClick={handleTriggerTask}
                disabled={isRunning}
                className={`btn btn-lg ${
                  isRunning 
                    ? "btn-disabled bg-gray-400" 
                    : "bg-gradient-to-r from-orange-500 to-red-600 border-0 hover:from-orange-600 hover:to-red-700"
                } text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200`}
              >
                {isRunning ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Running Task...
                  </>
                ) : (
                  <>
                    <FiPlay className="mr-2" />
                    Trigger Deactivation Task
                  </>
                )}
              </button>

              {lastRun && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <FiCheckCircle className="text-green-600" />
                    <span className="font-medium">Last triggered:</span>
                    <span>{lastRun.toLocaleString('en-US', { 
                      timeZone: 'Asia/Dhaka',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })} (Bangladesh Time)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeactivateExpiredEvents;
