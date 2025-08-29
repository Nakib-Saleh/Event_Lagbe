import React, { useState, useEffect, useContext } from "react";
import { FaUsers, FaSearch, FaChevronDown, FaChevronUp, FaDownload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AuthContext from "../../../Provider/AuthContext";
import axios from "axios";

const RegisteredList = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch events created by the user
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.firebaseUid) return;
      
      setEventsLoading(true);
      try {
        const response = await axios.get(`http://localhost:2038/api/events/user/${user.firebaseUid}`);
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.firebaseUid]);

  // Fetch registered participants for selected event
  const fetchParticipants = async (eventId, page = 0) => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:2038/api/events/${eventId}/registered-participants`, {
        params: {
          page: page,
          size: 10
        }
      });
      
      const data = response.data;
      setParticipants(data.participants || []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("Failed to fetch participants");
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
    setShowEventDropdown(false);
    setCurrentPage(0);
    fetchParticipants(eventId, 0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchParticipants(selectedEvent, newPage);
    }
  };

  // Fetch all participants for export
  const fetchAllParticipants = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:2038/api/events/${eventId}/registered-participants`, {
        params: {
          page: 0,
          size: 1000 // Large size to get all participants
        }
      });
      return response.data.participants || [];
    } catch (error) {
      console.error("Error fetching all participants:", error);
      return [];
    }
  };

  const handleExport = async () => {
    if (!selectedEvent) {
      toast.error("Please select an event first");
      return;
    }

    setExporting(true);
    try {
      const allParticipantsData = await fetchAllParticipants(selectedEvent);
      
      if (allParticipantsData.length === 0) {
        toast.error("No participants to export");
        return;
      }

      // Create CSV content
      const csvContent = [
        "Name,Username,Email", // Header
        ...allParticipantsData.map(participant => 
          `"${participant.name || 'Unknown'}","${participant.username || 'unknown'}","${participant.email || ''}"`
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedEventData?.title || 'event'}_participants.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${allParticipantsData.length} participants`);
    } catch (error) {
      console.error("Error exporting participants:", error);
      toast.error("Failed to export participants");
    } finally {
      setExporting(false);
    }
  };

  const selectedEventData = events.find(event => event.id === selectedEvent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FaUsers className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registered Participants</h2>
            <p className="text-gray-600">View participants registered for your events</p>
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Event</h3>
        
        <div className="relative">
          <button
            onClick={() => setShowEventDropdown(!showEventDropdown)}
            className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaSearch className="text-gray-400" />
              <span className={selectedEvent ? "text-gray-800" : "text-gray-500"}>
                {selectedEventData ? selectedEventData.title : "Choose an event..."}
              </span>
            </div>
            {showEventDropdown ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
          </button>

          {showEventDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {eventsLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="loading loading-spinner loading-sm"></div>
                  <span className="ml-2">Loading events...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No events found
                </div>
              ) : (
                events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelect(event.id)}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{event.title}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                      <span>{event.location || "No location"}</span>
                      <span>•</span>
                      <span>{event.registeredByCount} registered</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {event.isActive ? "Active" : "Completed"}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Participants List */}
      {selectedEvent && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Registered Participants
              </h3>
              <p className="text-gray-600">
                {totalCount} participant{totalCount !== 1 ? 's' : ''} registered
              </p>
            </div>
            {selectedEventData && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Event</p>
                <p className="font-medium text-gray-800">{selectedEventData.title}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading loading-spinner loading-lg"></div>
              <span className="ml-3 text-gray-600">Loading participants...</span>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-gray-400 text-2xl" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">No participants yet</h4>
              <p className="text-gray-500">No one has registered for this event yet.</p>
            </div>
          ) : (
            <>
                             {/* Participants Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                 {participants.map((participant) => (
                  <div
                    key={participant.firebaseUid}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={participant.profilePictureUrl || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                          alt={participant.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                          {participant.name || "Unknown"}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          @{participant.username || "unknown"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {participant.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                             {/* Pagination and Export */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   {/* Pagination */}
                   {totalPages > 1 && (
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handlePageChange(currentPage - 1)}
                         disabled={currentPage === 0}
                         className="btn btn-sm btn-outline disabled:opacity-50"
                       >
                         Previous
                       </button>
                       <span className="text-sm text-gray-600">
                         Page {currentPage + 1} of {totalPages}
                       </span>
                       <button
                         onClick={() => handlePageChange(currentPage + 1)}
                         disabled={currentPage === totalPages - 1}
                         className="btn btn-sm btn-outline disabled:opacity-50"
                       >
                         Next
                       </button>
                     </div>
                   )}
                   <div className="text-sm text-gray-600">
                     Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalCount)} of {totalCount} participants
                   </div>
                 </div>
                 
                 {/* Export Button */}
                 <button
                   onClick={handleExport}
                   disabled={exporting}
                   className="btn btn-primary btn-sm"
                 >
                   {exporting ? (
                     <>
                       <div className="loading loading-spinner loading-xs"></div>
                       Exporting...
                     </>
                   ) : (
                     <>
                       <FaDownload className="mr-1" />
                       Export
                     </>
                   )}
                 </button>
               </div>
            </>
          )}
        </div>
      )}

      {/* No Event Selected State */}
      {!selectedEvent && !eventsLoading && (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">Select an Event</h4>
          <p className="text-gray-500">Choose an event from the dropdown above to view registered participants.</p>
        </div>
      )}
    </div>
  );
};

export default RegisteredList;
