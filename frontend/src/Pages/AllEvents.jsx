import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skillIdToName, setSkillIdToName] = useState({});
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [sortBy, setSortBy] = useState("everything");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
                 const [eventsRes, skillsRes, organizationsRes] = await Promise.all([
           fetch("http://localhost:2038/api/events?page=0&size=50"),
           fetch("http://localhost:2038/api/skills"),
           fetch("http://localhost:2038/api/organization"),
         ]);
                 if (!eventsRes.ok) throw new Error("Failed to load events");
         if (!skillsRes.ok) throw new Error("Failed to load skills");
         if (!organizationsRes.ok) throw new Error("Failed to load organizations");

                 const [eventsData, skillsData, organizationsData] = await Promise.all([
           eventsRes.json(),
           skillsRes.json(),
           organizationsRes.json(),
         ]);

        const content = Array.isArray(eventsData?.content)
          ? eventsData.content
          : Array.isArray(eventsData)
          ? eventsData
          : [];
        setEvents(content);

                 const skillsArray = Array.isArray(skillsData) ? skillsData : [];
         setSkills(skillsArray);

         const organizationsArray = Array.isArray(organizationsData?.content) 
           ? organizationsData.content 
           : Array.isArray(organizationsData) 
           ? organizationsData 
           : [];
         setOrganizations(organizationsArray);

         const map = {};
        skillsArray.forEach((s) => {
          const id = s.id || s._id;
          if (id) map[id] = s.name;
        });
        setSkillIdToName(map);
      } catch (e) {
        setError(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
        <p className="text-gray-600">Browse all published events</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events by name, varsity, or skill..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Skill Filter */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Filter by Skill</span>
            </label>
                         <select
               className="select select-bordered w-full"
               value={selectedSkill}
               onChange={(e) => setSelectedSkill(e.target.value)}
             >
               <option value="">All Skills</option>
               {skills.map((skill) => (
                 <option key={skill.id || skill._id} value={skill.id || skill._id}>
                   {skill.name}
                 </option>
               ))}
             </select>
          </div>

          {/* Organization Filter */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Filter by Varsity</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
            >
              <option value="">All Universities</option>
                             {organizations.map((organization) => (
                 <option key={organization.id || organization._id} value={organization.id || organization._id}>
                   {organization.name || organization.username || organization.organizationName}
                 </option>
               ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Sort By</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="everything">All Events</option>
              <option value="latest">Latest Events</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading events...</div>}
      {error && !loading && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
                         events.map((evt) => (
               <Link key={evt.id} to={`/event/${evt.id}`} className="card bg-base-100 shadow border hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                {evt.coverImageUrl && (
                  <figure>
                    <img src={evt.coverImageUrl} alt={evt.title} className="h-48 w-full object-cover" />
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">{evt.title}</h2>
                  {evt.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">{evt.description}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    <span>{evt.location}</span>
                    {evt.eventType && <span className="ml-2 badge badge-outline">{evt.eventType}</span>}
                  </div>
                  {Array.isArray(evt.requiredSkillIds) && evt.requiredSkillIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {evt.requiredSkillIds.map((sid) => (
                        <span key={sid} className="badge badge-ghost">
                          {skillIdToName[sid] || "Skill"}
                        </span>
                      ))}
                                         </div>
                   )}
                 </div>
               </Link>
             ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllEvents;


