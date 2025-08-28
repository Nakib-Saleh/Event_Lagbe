import React, { useEffect, useState } from "react";
import { fetchEventsByIds, splitRunningPast, EventCard } from "./shared";
import { MdOutlineEmojiEvents } from "react-icons/md";
import axios from "axios";

const OrganizerPublic = ({ profile }) => {
  const [tab, setTab] = useState("about"); // about | events
  const [subTab, setSubTab] = useState("running");
  const [events, setEvents] = useState({ running: [], past: [] });
  const [loading, setLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  useEffect(() => {
    if (tab !== "events") return;
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchEventsByIds(profile.eventIds || []);
        setEvents(splitRunningPast(all));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, profile]);

  useEffect(() => {
    if (!profile.organizationId) return;

    const fetchOrganizationName = async () => {
      try {
        const res = await axios.get(`http://localhost:2038/api/organization/${profile.organizationId}`);
        if (res.data && res.data.name) {
          setOrganizationName(res.data.name);
        }
      } catch (error) {
        console.error("Error fetching organization name:", error);
        setOrganizationName("Unknown Organization");
      }
    };

    fetchOrganizationName();
  }, [profile.organizationId]);

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
          className={`tab ${tab === "events" ? "tab-active" : ""}`}
          onClick={() => setTab("events")}
        >
          Organized Events
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
                <p className="font-medium">Organization Id</p>
                <p>{organizationName || profile.organizationId || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events */}
      {tab === "events" && (
        <div className="mt-4">
          {/* Sub-tabs */}
          <div role="tablist" className="tabs tabs-lifted gap-6">
            <button
              className={`tab items-center justify-center transition-all duration-300 ease-in-out px-6 py-2 font-medium text-lg ${
                subTab === "running"
                  ? "tab-active bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
              onClick={() => setSubTab("running")}
            >
              Running
            </button>
            <button
              className={`tab items-center justify-center transition-all duration-300 ease-in-out px-6 py-2 font-medium text-lg ${
                subTab === "past"
                  ? "tab-active bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
              onClick={() => setSubTab("past")}
            >
              Past
            </button>
          </div>

          <div className="my-8">
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
                  <div className="text-center py-12 bg-gray-50 rounded-lg col-span-full">
                    <MdOutlineEmojiEvents className="text-6xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No {subTab} Events Found</h3>
                    <p className="text-gray-500">There are no {subTab} events to display at the moment.</p>
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

export default OrganizerPublic;
