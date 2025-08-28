import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../../Provider/AuthContext";
import { toast } from "react-hot-toast";
import { FiCalendar, FiMapPin, FiClock, FiUser, FiCheckCircle } from "react-icons/fi";
import { MdOutlineEmojiEvents } from "react-icons/md";

// Utility function to format date safely
const formatDate = (dateString) => {
  if (!dateString) return 'Date TBA';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date TBA';
    return date.toLocaleDateString();
  } catch {
    return 'Date TBA';
  }
};

const PastEvents = () => {
  const { user } = useContext(AuthContext);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:2038/api/participant/${user.firebaseUid}/past-events`);
        setPastEvents(response.data);
      } catch (error) {
        console.error("Error fetching past events:", error);
        toast.error("Failed to fetch past events");
      } finally {
        setLoading(false);
      }
    };

    if (user?.firebaseUid) {
      fetchPastEvents();
    }
  }, [user.firebaseUid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiCheckCircle className="text-2xl text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">Past Events</h2>
          <span className="badge badge-primary">{pastEvents.length}</span>
        </div>

        {pastEvents.length === 0 ? (
          <div className="text-center py-12">
            <FiCheckCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Past Events</h3>
            <p className="text-gray-500 mb-4">
              You haven't attended any events yet. Start exploring events and register for the ones you're interested in!
            </p>
            <button 
              onClick={() => window.location.href = '/events'}
              className="btn btn-primary"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Event Image */}
                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={event.coverImageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="badge badge-success">Completed</span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                     {event.description}
                   </p>

                   {/* Event Tags */}
                   <div className="flex flex-wrap gap-2 mb-3">
                     {event.eventType && (
                       <span className="badge badge-outline badge-sm text-xs">
                         {event.eventType}
                       </span>
                     )}
                     {event.tags && event.tags.length > 0 && event.tags.map((tag, index) => (
                       <span key={index} className="badge badge-neutral badge-sm text-xs">
                         {tag}
                       </span>
                     ))}
                   </div>

                   {/* Event Details */}
                   <div className="space-y-2 text-sm text-gray-500">
                     <div className="flex items-center gap-2">
                       <FiCalendar className="text-red-500" />
                       <span>
                         {formatDate(event.startDate)} - {formatDate(event.endDate)}
                       </span>
                     </div>
                     
                     <div className="flex items-center gap-2">
                       <FiClock className="text-red-500" />
                       <span>
                         {event.startTime || 'Time TBA'} - {event.endTime || 'Time TBA'}
                       </span>
                     </div>
                    
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-red-500" />
                      <span>{event.venue || 'Location TBA'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiUser className="text-red-500" />
                      <span>{event.organizerName || 'Organizer'}</span>
                    </div>
                  </div>

                  {/* Event Status and Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="badge badge-warning">Past Event</span>
                    
                    <button
                      onClick={() => window.location.href = `/event/${event.id}`}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;
