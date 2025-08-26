import React, { useEffect, useState } from "react";
import { fetchEventsByIds, splitRunningPast, EventCard } from "./shared";

const ParticipantPublic = ({ profile }) => {
  const [tab, setTab] = useState("about"); // about | registered
  const [subTab, setSubTab] = useState("running"); // running | past
  const [events, setEvents] = useState({ running: [], past: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab !== "registered") return;
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchEventsByIds(profile.registeredEventIds || []);
        setEvents(splitRunningPast(all));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, profile]);

  return (
    <div className="mt-4">
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        <button
          className={`tab ${tab === "about" ? "tab-active" : ""}`}
          onClick={() => setTab("about")}
        >
          About
        </button>
        <button
          className={`tab ${tab === "registered" ? "tab-active" : ""}`}
          onClick={() => setTab("registered")}
        >
          Registered Events
        </button>
      </div>

      {/* About */}
      {tab === "about" && (
        <div className="card bg-base-100 shadow mt-4">
          <div className="card-body">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name</p>
                <p>{profile.name}</p>
              </div>
              <div>
                <p className="font-medium">Username</p>
                <p>@{profile.username}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p>{profile.email}</p>
              </div>
              <div>
                <p className="font-medium">Institution</p>
                <p>{profile.institution || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registered Events */}
      {tab === "registered" && (
        <div className="mt-4">
          {/* Sub-tabs */}
          <div role="tablist" className="tabs tabs-lifted">
            <button
              className={`tab ${subTab === "running" ? "tab-active" : ""}`}
              onClick={() => setSubTab("running")}
            >
              Running
            </button>
            <button
              className={`tab ${subTab === "past" ? "tab-active" : ""}`}
              onClick={() => setSubTab("past")}
            >
              Past
            </button>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(subTab === "running"
                  ? events.running
                  : events.past
                ).map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
                {(subTab === "running" ? events.running : events.past).length ===
                  0 && (
                  <div className="text-base-content/60">
                    No {subTab} events.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantPublic;
