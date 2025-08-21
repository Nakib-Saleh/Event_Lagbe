import React, { useEffect, useState } from "react";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skillIdToName, setSkillIdToName] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, skillsRes] = await Promise.all([
          fetch("http://localhost:2038/api/events?page=0&size=50"),
          fetch("http://localhost:2038/api/skills"),
        ]);
        if (!eventsRes.ok) throw new Error("Failed to load events");
        if (!skillsRes.ok) throw new Error("Failed to load skills");

        const [eventsData, skillsData] = await Promise.all([
          eventsRes.json(),
          skillsRes.json(),
        ]);

        const content = Array.isArray(eventsData?.content)
          ? eventsData.content
          : Array.isArray(eventsData)
          ? eventsData
          : [];
        setEvents(content);

        const map = {};
        (Array.isArray(skillsData) ? skillsData : []).forEach((s) => {
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
              <div key={evt.id} className="card bg-base-100 shadow border">
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllEvents;


