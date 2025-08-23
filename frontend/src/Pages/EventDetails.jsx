import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { SiThealgorithms } from "react-icons/si";




const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skillIdToName, setSkillIdToName] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isGoing, setIsGoing] = useState(false);

     useEffect(() => {
     let isMounted = true;
     
     const fetchEventDetails = async () => {
       try {
         setLoading(true);
         setError("");

        // Fetch skills and organizations first
        const [skillsRes, organizationsRes] = await Promise.all([
          fetch("http://localhost:2038/api/skills"),
          fetch("http://localhost:2038/api/organization"),
        ]);

        if (!skillsRes.ok) throw new Error("Failed to load skills");
        if (!organizationsRes.ok) throw new Error("Failed to load organizations");

                 const [skillsData, organizationsData] = await Promise.all([
           skillsRes.json(),
           organizationsRes.json(),
         ]);

         const skillsArray = Array.isArray(skillsData) ? skillsData : [];
         const organizationsArray = Array.isArray(organizationsData?.content) 
           ? organizationsData.content 
           : Array.isArray(organizationsData) 
           ? organizationsData 
           : [];

                 console.log("Raw organizations data:", organizationsData);
         console.log("Extracted organizations array:", organizationsArray);
         setSkills(skillsArray);
         setOrganizations(organizationsArray);

        const map = {};
        skillsArray.forEach((s) => {
          const id = s.id || s._id;
          if (id) map[id] = s.name || s.skillName || "Unnamed Skill";
        });
        setSkillIdToName(map);

        // Try to fetch single event first
        let eventData = null;
        try {
          const eventRes = await fetch(`http://localhost:2038/api/events/${eventId}`);
          if (eventRes.ok) {
            eventData = await eventRes.json();
          }
        } catch {
          console.log("Single event fetch failed, trying fallback...");
        }

        // If single fetch failed, fallback to list fetch
        if (!eventData) {
          const allEventsRes = await fetch("http://localhost:2038/api/events?page=0&size=50");
          if (!allEventsRes.ok) throw new Error("Failed to load events");
          const allEventsData = await allEventsRes.json();
          const content = Array.isArray(allEventsData?.content)
            ? allEventsData.content
            : Array.isArray(allEventsData)
            ? allEventsData
            : [];
          eventData = content.find(
            (e) => e.id == eventId || e._id == eventId
          );
        }

        if (!eventData) throw new Error("Event not found");
         console.log("Final event data:", eventData);
         console.log("Setting event state...");
         
         if (isMounted) {
           setEvent(eventData);
           console.log("Event state set, current event:", event);
         }
       } catch (e) {
         if (isMounted) {
           setError(e.message || "Failed to load event details");
         }
       } finally {
         if (isMounted) {
           setLoading(false);
         }
       }
     };

         if (eventId) {
       console.log("EventDetails: eventId =", eventId);
       fetchEventDetails();
     }

     return () => {
       isMounted = false;
     };
   }, [eventId]);

   useEffect(() => {
     console.log("Event state changed:", event);
   }, [event]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

     const getOrganizationName = (organizationId) => {
     console.log("Looking for organization with ID:", organizationId);
     console.log("Available organizations:", organizations);
     const org = organizations.find(
       (o) => o.id === organizationId || o._id === organizationId
     );
     console.log("Found organization:", org);
     return org
       ? org.name || org.username || org.organizationName || "Unnamed Organization"
       : "Unknown Organization";
   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

     if (error) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-center">
           <div className="text-6xl mb-4">😕</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
           <p className="text-gray-600 mb-4">{error}</p>
           <Link to="/events" className="btn btn-primary">
             Back to Events
           </Link>
         </div>
       </div>
     );
   }

   if (!event) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-center">
           <div className="loading loading-spinner loading-lg"></div>
           <p className="mt-4 text-gray-600">Loading event details...</p>
         </div>
       </div>
     );
   }

    console.log("Rendering with event:", event);
   console.log("Event title:", event?.title);
   console.log("Event description:", event?.description);
   console.log("Event object keys:", Object.keys(event || {}));
   console.log("Organizations array:", organizations);
   console.log("Skills array:", skills);
   
   return (
     <div className="min-h-screen bg-gray-50">
       {/* Hero Section with Cover Image */}
       <div className="relative h-96">
        {event.event.coverImageUrl && (
          <img
            src={event.event.coverImageUrl}
            alt={event.event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{event.event.title || "Untitled Event"}</h1>
                <p className="text-xl opacity-90">
                  {event.event.location || "Location not specified"}
                </p>
                                 <p className="text-lg opacity-80">
                   {event.event.createdAt ? formatDate(event.event.createdAt) : "Date not specified"}
                 </p>
              </div>
              <div className="hidden md:block">
                <button  onClick={() => setIsBookmarked(!isBookmarked)} className={`btn btn-primary btn-lg
                    <FaBookmark className="text-white mr-2" />
                    transition-colors duration-300 ${
                isBookmarked
                ? "bg-blue-500 hover:bg-blue-600 text-white border-none"
                : "bg-white text-black border border-gray-400 hover:bg-gray-100"}`}>
                  <FaBookmark className="" />  {isBookmarked ? "Bookmarked" : "Bookmark Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.event.description || "No description available for this event."}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Date and time</p>
                                         <p className="text-gray-600">
                       {event.event.createdAt ? formatDate(event.event.createdAt) : "Date not specified"}
                     </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.event.location || "Location not specified"}</p>
                  </div>
                </div>

                {event.event.eventType && (
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Event Type</p>
                      <p className="text-gray-600">{event.event.eventType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Required Skills */}
            {Array.isArray(event.event.requiredSkillIds) && event.event.requiredSkillIds.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {event.event.requiredSkillIds.map((skillId) => (
                    <span key={skillId} className="badge badge-primary badge-lg">
                      {skillIdToName[skillId] || "Skill"}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Join Event Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center">
              <button onClick={() => setIsGoing(!isGoing)} className={`btn btn-block text-xl btn-lg mb-4 transition-colors duration-300 ${
                isGoing
                ? "bg-red-500 hover:bg-red-700 text-white border-none"
                : "bg-white text-black border border-gray-400 hover:bg-gray-100"}`} >
                <SiThealgorithms className="mr-2 font-extrabold" />
                {isGoing ? "Going" : "Join Event"}
                </button>
                <button className="btn btn-outline btn-block font-bold tex-3xl"><FaShareAlt className="text-clack" /> Share Event</button>
              </div>
            </div>

                           <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Meet Your Hosts</h3>
                <div className="flex flex-col gap-4">
                <div className="font-medium text-gray-700">Organizer</div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {(() => {
                      const org = organizations.find(
                        (o) => o.id === event.event.organizationId || o._id === event.event.organizationId
                      );
                      return org?.profilePictureUrl ? (
                        <img 
                          src={org.profilePictureUrl} 
                          alt={org.name || org.username || "Organization"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {getOrganizationName(event.event.organizationId).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getOrganizationName(event.event.organizationId)}
                    </p>
                    <p className="text-sm text-gray-600">Organization</p>
                  </div>
                </div>
                
                {/* Sponsors Section */}
                {Array.isArray(event.event.sponsorNames) && event.event.sponsorNames.length > 0 && (
                  <>
                    <div className="font-medium text-gray-700 mt-4">Sponsors</div>
                    <div className="space-y-2">
                      {event.event.sponsorNames.map((sponsor, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {sponsor.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sponsor}</p>
                            <p className="text-sm text-gray-600">Sponsor</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                </div>
              </div>

            {/* Event Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interested</span>
                  <span className="font-medium">0 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Going</span>
                  <span className="font-medium">0 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shares</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>

            {/* Back to Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Link to="/events" className="btn btn-outline btn-block">
                ← Back to All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
